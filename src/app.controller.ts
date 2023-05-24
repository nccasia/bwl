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
  Param,
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
    throw new Error('Method not implemented.');
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
              const posts = await this.appService.getAll(1, 5);
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
              const posts = await this.appService.getAll(1, 5);
              return res.render('index', { posts, user });
            }),
            first(),
          );
      } catch (error) {
        throw new error();
      }
    } else {
      const posts = await this.appService.getAll(1, 5);
      //console.log(posts);
      return res.render('index', { posts });
    }
  }
  
  @Get('/login')
  @Render('index')
  login() {}

  @Get('/posts')
  @Render('index')
  posts(@Query('messageId') messageId: string) {}

  @Get('/api/posts')
  async getPostsOne(@Req() req: Request, @Res() res: Response) {
    const { messageId } = req.query;
    const posts = await this.appService.getPostsOne(messageId as string);
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
  getAllPaging(@Query('page') page = 1) {
    return this.appService.getAll(page <= 0 ? 1 : page, 5);
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
          const { content, messageId, authorId,commentId } = req.body;
          const comment = await this.appService.comment({
            content,
            messageId,
            authorId,
            commentId,
          });
          const userDB = await this.appService.findCommentMessageFromDiscordId(
            user.id,
          );
          const messageDB = await this.appService.findCommentFromDiscordId(
            messageId,
          );

          return res.json({ success: true, data:{author: [userDB], comment}});
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
            // return res.json({ success: true, like });
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
  
  // @Delete('/api/comments?messageId')
  // async deleteComment(@Param('index') index: string, @Res() res: Response) {
  //   const deletedComment = await this.appService.deleteComment(index);
  //   return res.json({ comment: deletedComment });
  // }

  @Get('/api/reactions')
  async getReactions(@Req() req: Request, @Res() res: Response) {
    const { messageId, emoji } = req.query;
    const reactions = await this.appService.getReactions(messageId as string, emoji as string);
    return res.json({ reactions });
  }

  @Get('/api/notifications')
  async getNotifications(@Req() req: Request, @Res() res: Response) {
    const { messageId } = req.query;
    const list = await this.appService.findMessageAuthorId(
      messageId as string,
    );
    let notifications : any = [];
    for(let i= 0; i< list.length; i++){
      let notification: any = await this.appService.getNotifications(
        list[i].messageId as string,
        messageId as string,
      );
      notifications = notifications.concat(notification);
    }
    return res.json({ notifications });
  }
}


