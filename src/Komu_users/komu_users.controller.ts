/* eslint-disable prettier/prettier */
import { Controller, Get, Render } from '@nestjs/common';
import { KomuUsersService } from './komu_users.service';

@Controller('login')
export class KomuUsersController {
  constructor(private komuUserService: KomuUsersService) {}
  @Get('')
  @Render('login')
  root() {
    return {};
  }

  // @Get('')
  // @Render('all')
  // async getAll() {
  //   return await this.komuUserService.getAll();
  // }
}
