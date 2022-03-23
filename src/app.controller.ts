import {
  Controller,
  Get,
  Request,
  Res,
  Render,
  Param,
  Query,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppService } from './app.service';
import { Response } from 'express';
import { AuthService } from './Authentication/auth.service';
const tokenURL = 'https://discord.com/api/oauth2/token';
const apiURLBase = 'https://discord.com/api/users/@me';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
    private authService: AuthService,
  ) {}

  @Get('/login')
  @Render('login')
  root() {
    return {};
  }

  @Get('')
  @Render('index')
  async index(@Query() query: any, @Res() res: Response) {
    if (!query.code) {
      return res.redirect('/login');
    }
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
      const accessTokenData = await this.httpService
        .post(tokenURL, body, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .toPromise();

      const userData = await this.httpService
        .get(apiURLBase, {
          headers: {
            Authorization: `Bearer ${accessTokenData.data.access_token}`,
          },
        })
        .toPromise();
      const user = await this.authService.findUserFromDiscordId(
        userData.data.id,
      );

      if (!user) {
        await this.authService.saveUser(
          userData.data.id,
          userData.data.username,
          userData.data.avatar,
          userData.data.discriminator,
        );
      }
    } catch (error) {
      throw new error();
    }
    return this.appService.getAll(1);
  }

  @Get('/getAllPaging')
  getAllPaging(@Param('page') page: number = 1) {
    return this.appService.getAll(page <= 0 ? 1 : page);
  }
}
