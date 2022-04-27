import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction, ReactionDocument } from './Reaction/reaction.schema';
import { emojis } from './constants';
import { Message, MessageDocument } from './Message/message.schema';
import { Comment, CommentDocument } from './Comment/comment.schema';
import { Like, LikeDocument } from './Like/like.schema';
import {
  Notification,
  NotificationDocument,
} from './Notification/notification.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Reaction.name)
    private readonly komuReaction: Model<ReactionDocument>,
    @InjectModel(Message.name)
    private readonly komuMessage: Model<MessageDocument>,
    @InjectModel(Comment.name)
    private readonly komuComment: Model<CommentDocument>,
    @InjectModel(Like.name)
    private readonly komuLike: Model<LikeDocument>,
    @InjectModel(Notification.name)
    private readonly komuNotification: Model<NotificationDocument>,
  ) {}

  async findLikeFromDiscordId(
    authorId: string,
    messageId: string,
  ): Promise<any> {
    return this.komuLike.findOne({ authorId: authorId, messageId: messageId });
  }
  async findLikeMessageFromDiscordId(messageId: string): Promise<any> {
    return this.komuLike.find({ messageId: messageId });
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getAll(page: number) {
    const aggregatorOpts = [
      { $match: { channelId: '924543969357099018' } },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
      {
        $lookup: {
          from: 'komu_users',
          localField: 'authorId',
          foreignField: 'id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
      {
        $lookup: {
          from: 'komu_bwlreactions',
          localField: 'messageId',
          foreignField: 'messageId',
          as: 'reactions',
        },
      },
      {
        $lookup: {
          from: 'komu_bwlcomments',
          localField: 'messageId',
          foreignField: 'messageId',
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'komu_bwllikes',
          localField: 'authorId',
          foreignField: 'authorId',
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'komu_bwlnotifications',
          localField: 'authorId',
          foreignField: 'authorId',
          as: 'notifications',
        },
      },
    ];
    const data = await this.komuMessage.aggregate(aggregatorOpts as any).exec();

    for (const item of data) {
      item.reactions = item.reactions.reduce((result, reaction) => {
        const exists = result.find((e) => e.name === reaction.emoji);
        const emojiWithId = emojis.find((e) => e.name === reaction.emoji);
        if (exists) {
          exists.count++;
        } else {
          result.push({
            ...reaction,
            name: reaction.emoji,
            count: 1,
            ...(emojiWithId ? { id: emojiWithId.id } : {}),
          });
        }
        return result;
      }, []);
      item.totalComment = await this.komuComment
        .count({
          messageId: item.messageId,
        })
        .exec();

      item.totalLike = await this.komuLike
        .count({
          messageId: item.messageId,
        })
        .exec();
      item.totalNotification = await this.komuNotification
        .count({
          messageId: item.messageId,
        })
        .exec();
    }
    return data;
  }

  async getComments(messageId: string) {
    return this.komuComment
      .aggregate([
        {
          $match: {
            messageId,
          },
        },
        {
          $lookup: {
            from: 'komu_users',
            localField: 'authorId',
            foreignField: 'id',
            as: 'author',
          },
        },
      ])
      .exec();
  }

  async comment({ messageId, content, authorId, authorUser, authorAvatar }) {
    const comment = new this.komuComment({
      messageId,
      authorId,
      content,
      authorUser,
      authorAvatar,
      createdTimestamp: Date.now(),
    });
    const notification = new this.komuNotification({
      messageId,
      authorId,
      content,
      authorUser,
      authorAvatar,
      createdTimestamp: Date.now(),
    })
    return comment.save(), notification.save();
  }

  async getLikes(messageId: string) {
    return this.komuLike
      .aggregate([
        {
          $match: {
            messageId,
          },
        },
        {
          $lookup: {
            from: 'komu_users',
            localField: 'authorId',
            foreignField: 'id',
            as: 'author',
          },
        },
      ])
      .exec();
  }

  async like({ messageId, authorId }) {
    const like = new this.komuLike({
      messageId,
      authorId,
      createdTimestamp: Date.now(),
    });

    const notification = new this.komuNotification({
      messageId,
      authorId, 
      createTimestamp: Date.now(),
    })

    return like.save(), notification.save();
  }

  async unlike({ messageId, authorId }) {
    const dislike = await this.komuLike
      .remove({
        messageId,
        authorId,
      })
      .exec();
    return true;
  }

  // async getNotifications(messageId: string) {
  //   return this.komuNotification
  //     .aggregate([
  //         {
  //           $match: {
  //             messageId,
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: 'komu_users',
  //             localField: 'authorId',
  //             foreignField: 'id',
  //             as: 'author',
  //           },
  //         },
  //       ])
  //       .exec();
    
  // }

  async notification({ messageId, content, authorId, status }) {
    const notification = new this.komuNotification({
      messageId,
      authorId,
      content,
      status,
      createdTimestamp: Date.now(),
    });
    return notification.save();
  }
}
