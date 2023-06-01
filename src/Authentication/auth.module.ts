/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { KomuUsersModule } from '../Komu_users/komu_users.module';
import { KomuUsersService } from '../Komu_users/komu_users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [KomuUsersModule, HttpModule],
  providers: [KomuUsersService, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
