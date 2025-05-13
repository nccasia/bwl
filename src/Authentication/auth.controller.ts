/* eslint-disable prettier/prettier */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('mezon')
  @UseGuards(AuthGuard('mezon'))
  async getUserFromDiscordLogin(@Req() req): Promise<any> {
    return req.user;
  }
}
