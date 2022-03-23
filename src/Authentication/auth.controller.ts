import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async getUserFromDiscordLogin(@Req() req): Promise<any> {
    return req.user;
  }
}
