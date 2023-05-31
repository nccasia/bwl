/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Res,
  Query,
  Render,
  Req,
  Post,
  UnauthorizedException,
  Sse,
  Delete,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { AuthService } from './Authentication/auth.service';
import { first, map, Observable, switchMap } from 'rxjs';

const discordTokenUrl = 'https://discord.com/api/oauth2/token';
const discordUserUrl = 'https://discord.com/api/users/@me';

@Controller()
export class AppController {
  getHello(): any {
    //throw new Error('Method not implemented.');
    return 'Hello World!';
  }
  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
    private authService: AuthService,
  ) {}

  @Sse('/sse')
  sse(): Observable<MessageEvent> {
    return this.appService.sendEvents();
  }

  @Get('')
  async index(@Query() query: any, @Req() req: Request, @Res() res: Response) {
    if (req.cookies['token']) {
      try {
        return this.httpService
          .get(discordUserUrl, {
            headers: {
              Authorization: `Bearer ${req.cookies['token']}`,
            },
          })
          .pipe(
            map((userResponse) => {
              return userResponse.data;
            }),
            map(async (user) => {
              const userDb = await this.authService.findUserFromDiscordId(
                user.id,
              );

              if (!userDb) {
                await this.authService.saveUser(
                  user.id,
                  user.username,
                  user.avatar,
                  user.discriminator,
                );
              }
              const posts = await this.appService.getAll(1, 5, null);
              return res.render('index', { posts, user });
            }),
            first(),
          );
      } catch (error) {
        throw new error();
      }
    } else if (query.code) {
      const body = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: query.code,
        redirect_uri: process.env.REDIRECT_URI,
        scope: 'identify',
      });

      try {
        return this.httpService
          .post(discordTokenUrl, body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          })
          .pipe(
            switchMap((response) => {
              res.cookie('token', response.data.access_token);
              return this.httpService.get(discordUserUrl, {
                headers: {
                  Authorization: `Bearer ${response.data.access_token}`,
                },
              });
            }),
            map((userResponse) => {
              return userResponse.data;
            }),
            map(async (user) => {
              const userDb = await this.authService.findUserFromDiscordId(
                user.id,
              );
              if (!userDb) {
                await this.authService.saveUser(
                  user.id,
                  user.username,
                  user.avatar,
                  user.discriminator,
                );
              }
              const posts = await this.appService.getAll(1, 5, null);
              return res.render('index', { posts, user });
            }),
            first(),
          );
      } catch (error) {
        throw new error();
      }
    } else {
      const posts = await this.appService.getAll(1, 5, null);
      //console.log(posts);
      return res.render('index', { posts });
    }
  }
  
  @Get('/login')
  @Render('index')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login() {}

  @Get('/posts')
  @Render('index')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  posts() {}

  @Get('/api/posts')
  async getPostsOne(@Req() req: Request, @Res() res: Response) {
    const posts = await this.appService.getPostsOne(req.query?.messageId as string, String(req.query?.id)? String(req.query?.id) : null);
    return res.json(posts);
  }

  @Get('/api/login')
  //@Render('index')
  root() {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${
      process.env.CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      process.env.REDIRECT_URI,
    )}&response_type=code&scope=identify`;
    return { url };
  }

  @Get('/api/logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    res.redirect('/');
  }

  @Get('/api/getAllPaging')
  async getAllPaging(@Req() req: Request, @Res() res: Response) {
    const posts= await this.appService.getAll(Number(req.query?.page), 5, String(req.query?.messageId)? String(req.query?.messageId) : null);
    const size= await this.appService.findLengthMessage();
    return res.json({posts, size})
  }

  @Post('/api/comment')
  async postComment(@Req() req: Request, @Res() res: Response) {
    if (!req.cookies['token']) {
      throw new UnauthorizedException();
    }
    return this.httpService
      .get(discordUserUrl, {
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
        next: async (user) => {
          const { content, messageId, authorId } = req.body;
          const comment: any = await this.appService.comment({
            content,
            messageId,
            authorId,
          });
          const userDB = await this.appService.findCommentMessageFromDiscordId(
            user.id,
          );
          return res.json({ ...comment.toObject(), author: [userDB] });
        },
        error: (error) => {
          return res
            .status(401)
            .json({ success: false, error: error.response.data.message });
        },
      });
  }

  @Get('/api/comments')
  async getComments(@Req() req: Request, @Res() res: Response) {
    const { messageId } = req.query;
    const comments = await this.appService.getComments(messageId as string);
    return res.json({ comments });
  }

  @Delete('/api/comments')
  async deleteComment(@Req() req: Request, @Res() res: Response) {
    const { id, messageId } = req.query;
    const deleteComment = await this.appService.deleteComment(id as string, messageId as string);
    return res.json(deleteComment ? { message: true } : { message: false });
  }

  @Post('/api/comment/edit')
  async postEditComment(@Req() req: Request, @Res() res: Response) {
    const { id, content } = req.body;
    const editComment = await this.appService.editComment(id as string, content as string);
    return res.json(editComment);
  }

  @Post('/api/like')
  async postLike(@Req() req: Request, @Res() res: Response) {
    if (!req.cookies['token']) {
      throw new UnauthorizedException();
    }
    return this.httpService
      .get(discordUserUrl, {
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
        next: async (user) => {
          const { messageId, authorId } = req.body;
          const userDB = await this.appService.findLikeFromDiscordId(
            user.id,
            messageId,
          );
          const messageDB = await this.appService.findLikeMessageFromDiscordId(
            messageId,
          );
          const usernameDB = await this.appService.findLikeMessageId(user.id);
          const messageLikeDB = await this.appService.findLikeId(messageId);

          if (messageDB && !userDB) {
            const like = await this.appService.like({
              messageId,
              authorId,
            });
            return res.json({ success: true, like, usernameDB, messageLikeDB });
          } else if (userDB) {
            const dislike = await this.appService.unlike({
              messageId,
              authorId: user.id,
            });
            return res.json({ success: true, dislike });
          }
        },
        error: (error) => {
          return res
            .status(401)
            .json({ success: false, error: error.response.data.message });
        },
      });
  }

  @Get('/api/likes')
  async getLikes(@Req() req: Request, @Res() res: Response) {
    const { messageId } = req.query;
    const likes = await this.appService.getLikes(messageId as string);
    return res.json({ likes });
  }
  
  @Get('/api/reactions')
  async getReactions(@Req() req: Request, @Res() res: Response) {
    const { messageId, emoji } = req.query;
    const reactions = await this.appService.getReactions(messageId as string, emoji as string);
    return res.json({ reactions });
  }

  @Get('/api/notifications')
  async getNotifications(@Req() req: Request, @Res() res: Response) {
    const { messageId, page } = req.query;
    const list = await this.appService.findMessageAuthorId(
      messageId as string,
    );
    let notifications : any = [];
    for(let i= 0; i< list.length; i++){
      // eslint-disable-next-line prefer-const
      let notification: any = await this.appService.getNotifications(
        list[i].messageId as string,
        messageId as string,
        Number(page) as number,
        5,
      );
      notifications = notifications.concat(notification);
    }
    return res.json({ notifications });
  }

  @Get('/api/notifications/size')
  async getNotificationsSize(@Req() req: Request, @Res() res: Response) {
    const { messageId } = req.query;
    const list = await this.appService.findMessageAuthorId(
      messageId as string,
    );
    let length =0;
    let size =0;
    for(let i= 0; i< list.length; i++){
      // eslint-disable-next-line prefer-const
      let notification: any = await this.appService.getNotificationsSize(
        list[i].messageId as string,
        messageId as string,
      );
      length = length + notification?.length;
      size = size + notification?.filter((item: any) => item?.onLabel === true).length
    }
    return res.json({ size, length });
  }

  @Post('/api/notifications/size')
  async postNotificationsSize(@Req() req: Request, @Res() res: Response) {
    const { messageId } = req.body;
    const list = await this.appService.findMessageAuthorId(
      messageId as string,
    );
    const promises = list.map((item: any) =>
      this.appService.postNotification(item.messageId as string)
    );
    await Promise.all(promises);
    return res.json(true);
  }

  @Get('/api/hotposts')
  async getHotPosts(@Req() req: Request, @Res() res: Response) {
    const hotposts = await this.appService.getHotPosts();
    return res.json({ hotposts });
  }
}


