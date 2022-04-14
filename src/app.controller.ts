import { Controller, Get, Res, Query, Render, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { AuthService } from './Authentication/auth.service';
import { first, map, switchMap } from 'rxjs';
const tokenURL = 'https://discord.com/api/oauth2/token';
const apiURLBase = 'https://discord.com/api/users/@me';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
    private authService: AuthService,
  ) {}

  @Get('')
  async index(@Query() query: any, @Req() req: Request, @Res() res: Response) {
    if (req.cookies['token']) {
      try {
        return this.httpService
          .get(apiURLBase, {
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
              const posts = await this.appService.getAll(1);
              return res.render('index', { posts, user });
            }),
            first(),
          );
      } catch (error) {
        throw new error();
      }
    } else if (query.code) {
      const tokenData = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'client_credentials',
        code: query.code,
        redirect_uri: process.env.REDIRECT_URI,
        scope: 'identify',
      };

      try {
        const body = `client_id=${tokenData.client_id}&client_secret=${tokenData.client_secret}&code=${query.code}&grant_type=${tokenData.grant_type}&scope=${tokenData.scope}`;
        return this.httpService
          .post(tokenURL, body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          })
          .pipe(
            switchMap((response) => {
              res.cookie('token', response.data.access_token);
              return this.httpService.get(apiURLBase, {
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
              const posts = await this.appService.getAll(1);
              return res.render('index', { posts, user });
            }),
            first(),
          );
      } catch (error) {
        throw new error();
      }
    } else {
      return res.redirect('/login');
    }
  }

  @Get('/login')
  @Render('login')
  root() {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${
      process.env.CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      process.env.REDIRECT_INDEX,
    )}&response_type=code&scope=identify`;
    return { url };
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    res.redirect('/login');
  }

  @Get('/getAllPaging')
  getAllPaging(@Query('page') page = 1) {
    return this.appService.getAll(page <= 0 ? 1 : page);
  }
}
