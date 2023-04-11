/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Authentication/auth.module';
import { KomuUsersModule } from './Komu_users/komu_users.module';
import { ReactionModule } from './Reaction/reaction.module';
import { HttpModule } from '@nestjs/axios';
import { MessageModule } from './Message/message.module';
import { CommentModule } from './Comment/comment.module';
import { LikeModule } from './Like/like.module';
import { NotificationModule } from './Notification/notification.module';

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
    AuthModule,
    KomuUsersModule,
    ReactionModule,
    MessageModule,
    CommentModule,
    LikeModule,
    NotificationModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
