/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from '../app.service';
import { AuthModule } from '../Authentication/auth.module';
import { ChannelModule } from '../Channel/channel.module';
import { Channel, ChannelSchema } from '../Channel/channel.schema';
import { Comment, CommentSchema } from '../Comment/comment.schema';
import { KomuUsers, KomuUsersSchema } from '../Komu_users/komu_users.schema';
import { Like, LikeSchema } from '../Like/like.schema';
import { Message, MessageSchema } from '../Message/message.schema';
import { Notification, NotificationSchema } from '../Notification/notification.schema';
import { Reaction, ReactionSchema } from '../Reaction/reaction.schema';
import { MezonBotService } from './mezon-bot.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Reaction.name, schema: ReactionSchema },
            { name: Channel.name, schema: ChannelSchema },
            { name: Message.name, schema: MessageSchema },
            { name: Comment.name, schema: CommentSchema },
            { name: Like.name, schema: LikeSchema },
            { name: Notification.name, schema: NotificationSchema },
            { name: KomuUsers.name, schema: KomuUsersSchema },
        ]),
        AuthModule,
        ChannelModule,
    ],
    controllers: [],
    providers: [MezonBotService, AppService],
    exports: [MezonBotService],
})
export class MezonBotModule { }