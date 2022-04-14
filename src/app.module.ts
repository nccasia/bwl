import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Authentication/auth.module';
import { KomuUsersModule } from './Komu_users/komu_users.module';
import { ReactionModule } from './Reaction/reaction.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://172.16.100.114:27017/komubot'),
    AuthModule,
    KomuUsersModule,
    ReactionModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
