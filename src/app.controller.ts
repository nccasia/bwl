/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Render,
  Req,
  Res,
  Sse,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { first, map, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AppService } from './app.service';
import { AuthService } from './Authentication/auth.service';
import { multerOptions } from './Util';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
    private authService: AuthService,
  ) { }

  @Sse('/api/sse')
  sse(): Observable<MessageEvent> {
    return this.appService.sendEvents();
  }
  @Get('')
  @Render('index')
  async index(@Query() query: any, @Req() req: Request, @Res() res: Response) {
    if (req.cookies['token']) {
      try {
        this.httpService
          .get(`${process.env.MEZON_AUTH_URL}/userinfo`, {
            headers: {
              Authorization: `Bearer ${req.cookies['token']}`,
            },
          })
          .pipe(
            map((userResponse) => {
              return userResponse.data;
            }),
            map(async (user) => {
              const userDb: any = await this.appService.onlineUser(
                user.username,
                true,
              );
              if (!userDb) {
                await this.authService.saveUser(
                  user.username,
                  user.username,
                  user.avatar,
                  user.display_name,
                  true,
                );
              }
            }),
            first(),
            catchError((error) => {
              console.log("error: ", error)
              throw error;
            })
          );
      } catch (error) {
        console.log("error: ", error)
        res.clearCookie('token');
        return res.redirect('/');
      }
    } else if (query.code) {
      const requestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        code: query.code,
        client_secret: process.env.MEZON_CLIENT_SECRET,
        client_id: process.env.MEZON_CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
      });
      try {
        return this.httpService
          .post(`${process.env.MEZON_AUTH_URL}/oauth2/token`, requestBody, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          })
          .pipe(
            switchMap((response) => {
              res.cookie('token', response.data.access_token);
              return this.httpService.get(`${process.env.MEZON_AUTH_URL}/userinfo`, {
                headers: {
                  Authorization: `Bearer ${response.data.access_token}`,
                },
              });
            }),
            map((userResponse) => {
              return userResponse.data;
            }),
            map(async (user) => {
              const userDb: any = await this.appService.onlineUser(
                user.username,
                true,
              );
              if (!userDb) {
                await this.authService.saveUser(
                  user.username,
                  user.username,
                  user.avatar,
                  user.display_name,
                  true,
                );
              }
            }),
            first(),
            catchError((error) => {
              console.log("error: ", error)
              throw error;
            }),
          );
      } catch (error) {
        console.log("error: ", error)
        res.clearCookie('token');
        return res.redirect('/');
      }
    }
  }

  @Get('/login')
  @Render('index')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login() { }

  @Get('/api/channel')
  async getChannel(@Req() req: Request, @Res() res: Response) {
    try {
      const channel = await this.appService.getChannelTotal();
      return res.status(200).json({ channel });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/posts')
  async getPostsOne(@Req() req: Request, @Res() res: Response) {
    try {
      const posts = await this.appService.getPostsOne(
        req.query?.messageId as string,
        String(req.query?.id) ? String(req.query?.id) : null,
      );
      return res.status(200).json({ posts, size: 1 });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Delete('/api/posts')
  async deletePost(@Req() req: Request, @Res() res: Response) {
    try {
      const { id, messageId } = req.query;
      const deletePost = await this.appService.deletePost(
        id as string,
        messageId as string,
      );
      if (deletePost.source) {
        const filePath = `./public/assets/images/${deletePost?.links[0]}`;
        fs.unlinkSync(filePath);
      }
      return res.status(200).json({ message: 'Delete post successfully!' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/login')
  async root(@Res() res: Response) {
    try {
      const authServer = process.env.MEZON_AUTH_URL;
      const clientId = process.env.MEZON_CLIENT_ID;
      const redirectUri = process.env.REDIRECT_URI;
      const scope = "openid offline";
      const responseType = "code";
      const state = new Date().getTime();

      const urlSearchParams = new URLSearchParams({
        client_id: clientId ?? "",
        redirect_uri: redirectUri ?? "",
        response_type: responseType ?? "",
        scope: scope ?? "",
        state: state.toString() ?? "",
      });

      const authUrl = `${authServer}/oauth2/auth?${urlSearchParams.toString()}`;
      return res.status(200).json({ url: authUrl });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      res.clearCookie('token');
      res.redirect('/');
      const { messageId } = req.query;
      await this.appService.onlineUser(String(messageId), false);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/getAllPaging')
  async getAllPaging(@Req() req: Request, @Res() res: Response) {
    try {
      const posts = await this.appService.getAll(
        Number(req.query?.page),
        Number(req.query?.size),
        String(req.query?.messageId) ?? null,
        String(req.query?.channel) ?? null,
      );
      const size = await this.appService.findLengthMessage(
        String(req.query?.channel) ?? null
      );
      return res.status(200).json({ posts, size });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/comment/item')
  async getCommentItem(@Req() req: Request, @Res() res: Response) {
    try {
      const { id, page, size, messageId, commentId } = req.query;
      const item = await this.appService.getCommentsItem(
        String(id) as string,
        String(commentId),
        String(messageId),
        Number(page),
        Number(size),
      );
      const total = await this.appService.getCommentsItemLength(
        String(commentId),
        messageId as string,
      );
      return res.status(200).json({ item, size: total?.length });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/current-user')
  async getCurrentUser(@Req() req: Request, @Res() res: Response) {
    if (!req.cookies['token']) {
      res.clearCookie('token');
      res.redirect('/');
      return;
    }
    try {
      this.httpService
        .get(`${process.env.MEZON_AUTH_URL}/userinfo`, {
          headers: {
            Authorization: `Bearer ${req.cookies['token']}`,
          },
        })
        .pipe(
          map((userResponse) => {
            return userResponse.data;
          }),
          first(),
          catchError((error) => {
            return throwError(() => new Error(error));
          }),
        )
        .subscribe({
          next: async (user) => {
            const userDb: any = await this.appService.onlineUser(
              user.username,
              true,
            );
            return res.status(200).json(userDb);
          },
          error: (error) => {
            console.log("Get current user error: ", error)
            res.clearCookie('token');
            return res.redirect('/');
          }
        });
    } catch (error) {
      console.log("Error thrown from appController.getCurrentUser: ", error)
      res.clearCookie('token');
      return res.redirect('/');
    }

  }
  @Post('/api/comment')
  async postComment(@Req() req: Request, @Res() res: Response) {
    if (!req.cookies['token']) {
      throw new UnauthorizedException();
    }
    return this.httpService
      .get(`${process.env.MEZON_AUTH_URL}/userinfo`, {
        headers: {
          Authorization: `Bearer ${req.cookies['token']}`,
        },
      })
      .pipe(
        map((userResponse) => {
          return userResponse.data;
        }),
        first(),
      )
      .subscribe({
        next: async () => {
          const { content, messageId, authorId } = req.body;
          await this.appService.comment({
            content,
            messageId,
            authorId,
            id: req.body?.id,
          });
          return res.status(200).json({ message: 'Add comment successfully!' });
        },
        error: (error) => {
          return res
            .status(401)
            .json({ success: false, message: error.response });
        },
      });
  }

  @Get('/api/comments')
  async getComments(@Req() req: Request, @Res() res: Response) {
    try {
      const { messageId, id, page, size } = req.query;
      const comments = await this.appService.getComments(
        messageId as string,
        String(id),
        Number(page),
        Number(size),
      );
      const total = await this.appService.getCommentsItemLength(
        null,
        messageId as string,
      );
      return res.status(200).json({ comments, size: total?.length });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Delete('/api/comments')
  async deleteComment(@Req() req: Request, @Res() res: Response) {
    try {
      const { id, messageId } = req.query;
      await this.appService.deleteComment(id as string, messageId as string);
      return res.status(200).json({ message: 'Delete comment successfully!' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('/api/comment/edit')
  async postEditComment(@Req() req: Request, @Res() res: Response) {
    try {
      const { id, content, messageId } = req.body;
      await this.appService.editComment(
        id as string,
        content as string,
        messageId as string,
      );
      return res.status(200).json({ message: 'Edit comment successfully!' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('/api/like')
  async postLike(@Req() req: Request, @Res() res: Response) {
    const { messageId, authorId, onLike } = req.body;
    if (onLike === true) {
      await this.appService.like(messageId, authorId, true);
    } else {
      await this.appService.unlike(messageId, authorId);
    }
    return res
      .status(200)
      .json({
        message:
          onLike === true
            ? 'You have successfully liked.'
            : 'You have successfully unliked',
      });
  }

  @Get('/api/likes')
  async getLikes(@Req() req: Request, @Res() res: Response) {
    try {
      const { messageId, size, page } = req.query;
      const likes = await this.appService.getLikes(
        messageId as string,
        String(size) as string,
        Number(page) as number,
      );
      const total = await this.appService.getLikesLength(messageId as string);
      return res.status(200).json({ likes, total: total?.length });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/reactions')
  async getReactions(@Req() req: Request, @Res() res: Response) {
    try {
      const { messageId, emoji, size, page } = req.query;
      const reactions = await this.appService.getReactions(
        messageId as string,
        emoji as string,
        String(size) as string,
        Number(page) as number,
      );
      const total = await this.appService.getReactionsLength(
        messageId as string,
        emoji as string,
      );
      return res.status(200).json({ reactions, total: total?.length });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/notifications')
  async getNotifications(@Req() req: Request, @Res() res: Response) {
    try {
      const { messageId, page } = req.query;
      const notifications: any = await this.appService.getNotifications(
        messageId as string,
        Number(page) as number,
        5,
      );
      return res.status(200).json({ notifications });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/notifications/size')
  async getNotificationsSize(@Req() req: Request, @Res() res: Response) {
    try {
      const { messageId } = req.query;
      const notification = await this.appService.getNotificationsSize(
        messageId as string,
      );
      const length = notification?.length;
      const size = notification?.filter(
        (item: any) => item?.onLabel === true,
      ).length;
      return res.status(200).json({ size, length });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('/api/notifications/size')
  async postNotificationsSize(@Req() req: Request, @Res() res: Response) {
    try {
      const { messageId } = req.body;
      await this.appService.postNotification(messageId as string);
      return res
        .status(200)
        .json({ message: 'Read notification successfully!' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/hotposts')
  async getHotPosts(@Req() req: Request, @Res() res: Response) {
    try {
      const { messageId, page, size, channel } = req.query;
      const posts = await this.appService.getHotPosts(
        String(messageId),
        Number(page),
        Number(size),
        String(channel),
      );
      const size1 = await this.appService.findLengthMessage(String(channel));
      return res.status(200).json({ posts, size: size1 });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('/api/upload')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { id, channelId } = req.query;
      const destinationPath = `./public/assets/images/${file.filename}`;
      const destinationDir = './public/assets/images';
      if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir);
      }
      fs.copyFileSync(file.path, destinationPath);
      await this.appService.addPost(
        String(id),
        [file.filename],
        String(channelId),
        false,
      );
      return res.status(200).json({ message: 'Upload image successfully!' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('/api/edit/post')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async editPost(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { id, messageId } = req.query;
      const editPost: any = await this.appService.editPost(
        id as string,
        messageId as string,
      );
      if (editPost[0]?.source) {
        const filePath = `./public/assets/images/${editPost[0]?.links[0]}`;
        fs.unlinkSync(filePath);
      }
      const destinationPath = `./public/assets/images/${file.filename}`;
      fs.copyFileSync(file.path, destinationPath);
      await this.appService.updatePost(id as string, file.filename as string);
      return res.status(200).json({ message: 'Edit post successfully!' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('/api/comment/like')
  async postCommentLike(@Req() req: Request, @Res() res: Response) {
    try {
      const { messageId, id, onLike, commentId } = req.body;
      const postCommentLike = await this.appService.postLikeComment(
        messageId as string,
        id as string,
        String(onLike) === 'true' ? true : false,
        commentId as string,
      );
      return res.status(200).json({ message: postCommentLike });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('/api/comment/pin')
  async postPinComment(@Req() req: Request, @Res() res: Response) {
    try {
      const { id, onPin } = req.body;
      await this.appService.pinComment(id as string, onPin);
      return res
        .status(200)
        .json({
          message: onPin
            ? 'Pin comment successfully!'
            : 'Unpin comment successfully!',
        });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/search')
  async getSearch(@Req() req: Request, @Res() res: Response) {
    try {
      const { name, page, channelId } = req.query;
      const users = await this.appService.searchByName(
        String(name),
        Number(page),
        String(channelId),
      );
      const size = await this.appService.searchByLength(String(name));
      return res.status(200).json({ users, size: size?.length });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/search/posts')
  async getSearchPosts(@Req() req: Request, @Res() res: Response) {
    try {
      const { messageId, page, channelId } = req.query;
      const posts = await this.appService.searchPosts(
        String(messageId),
        Number(page),
        String(channelId),
      );
      const size = await this.appService.searchPostsLength(
        String(messageId),
        String(channelId),
      );
      return res.status(200).json({ posts, total: size?.length });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/search/time/posts')
  async getSearchTimePosts(@Req() req: Request, @Res() res: Response) {
    try {
      const { start, end, page, channelId } = req.query;
      const posts = await this.appService.searchTimePosts(
        Number(start),
        Number(end) + 86400000,
        Number(page),
        String(channelId),
      );
      const size = await this.appService.searchTimePostsLength(
        Number(start),
        Number(end) + 86400000,
        String(channelId),
      );
      return res.status(200).json({ posts, total: size?.length });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('/api/test')
  async getTest(@Req() req: Request, @Res() res: Response) {
    try {
      const a = await this.appService.deleteStart();
      return res.status(200).json(a);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
