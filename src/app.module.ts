/* eslint-disable prettier/prettier */
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Authentication/auth.module';
import { ChannelModule } from './Channel/channel.module';
import { CommentModule } from './Comment/comment.module';
import { KomuUsersModule } from './Komu_users/komu_users.module';
import { LikeModule } from './Like/like.module';
import { MessageModule } from './Message/message.module';
import { MezonBotModule } from './MezonBot/mezon-bot.module';
import { NotificationModule } from './Notification/notification.module';
import { ReactionModule } from './Reaction/reaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MezonBotModule,
    AuthModule,
    KomuUsersModule,
    ReactionModule,
    MessageModule,
    ChannelModule,
    CommentModule,
    LikeModule,
    NotificationModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [
    AppService,
  ],
})
export class AppModule { }