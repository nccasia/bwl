/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Channel, ChannelDocument } from './Channel/channel.schema';
import { Comment, CommentDocument } from './Comment/comment.schema';
import { emojis } from './constants';
import { KomuUsers, KomuUsersDocument } from './Komu_users/komu_users.schema';
import { Like, LikeDocument } from './Like/like.schema';
import { Message, MessageDocument } from './Message/message.schema';
import {
  Notification,
  NotificationDocument,
} from './Notification/notification.schema';
import { Reaction, ReactionDocument } from './Reaction/reaction.schema';

@Injectable()
export class AppService {
  commentModel: any;
  constructor(
    @InjectModel(Channel.name)
    private readonly komuChannel: Model<ChannelDocument>,
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
    @InjectModel(KomuUsers.name)
    private readonly komuUser: Model<KomuUsersDocument>,
  ) {
    this.checkForChanges();
  }

  private setTime = 0;
  private checkForChanges() {
    const checkChanges = async (index: number) => {
      const channelList = await this.komuChannel.find({}).exec();
      const currentTime = index;
      const channelIdArray = channelList.map((channel) => channel.id);
      const aggregatorOpts = [
        {
          $match: {
            channelId: { $in: channelIdArray },
            createdTimestamp: { $gt: currentTime },
          },
        },
        { $sort: { _id: -1 } },
      ];
      const newRecord = await this.komuMessage
        .aggregate(aggregatorOpts as any)
        .exec();
      let list: any = [];
      if (newRecord?.length > 0) {
        for (const item of newRecord) {
          const test = await this.getPostsOne(item.messageId, null);
          list = [...list, ...test];
        }
        this.addEvent({ data: { list, posts: 'add' } });
        this.setTime = Number(newRecord[0]?.createdTimestamp);
      }
    };
    const findTime = async () => {
      const result = await this.komuMessage.aggregate([
        {
          $group: {
            _id: null,
            maxCreatedTimestamp: { $max: '$createdTimestamp' },
          },
        },
        {
          $project: {
            _id: 0,
            maxCreatedTimestamp: 1,
          },
        },
      ]);
      if (result?.length > 0) {
        return result[0]?.maxCreatedTimestamp;
      }
    };
    const foo = async () => {
      if (this.setTime === 0) {
        this.setTime = Number(await findTime());
      }
      setInterval(() => checkChanges(this.setTime), 5000);
    };
    foo();
  }
  async findLikeFromDiscordId(
    authorId: string,
    messageId: string,
  ): Promise<any> {
    return await this.komuLike.findOne({
      authorId: authorId,
      messageId: messageId,
    });
  }
  async findLikeMessageFromDiscordId(messageId: string): Promise<any> {
    return await this.komuLike.find({ messageId: messageId });
  }
  async findMessageAuthorId(authorId: string): Promise<any> {
    return await this.komuMessage.find({
      authorId: authorId,
    });
  }
  async findCommentFromDiscordId(messageId: string): Promise<any> {
    return await this.komuMessage.find({
      messageId: messageId,
    });
  }
  async findCommentMessageFromDiscordId(id: string): Promise<any> {
    return await this.komuUser.findOne({ id: id });
  }
  async findLikeId(messageId: string): Promise<any> {
    return await this.komuMessage.find({
      messageId: messageId,
    });
  }
  async findLikeMessageId(id: string): Promise<any> {
    return await this.komuMessage.findOne({ id: id });
  }
  async findLengthMessage(channel1: string): Promise<any> {
    const count = await this.komuMessage
      .countDocuments({ channelId: channel1, links: { $ne: [] } })
      .exec();
    return count;
  }

  private events = new Subject<MessageEvent>();

  addEvent(event: any) {
    this.events.next(event);
  }
  sendEvents(): Observable<MessageEvent> {
    return this.events.asObservable();
  }
  getHello(): string {
    return 'Hello World!';
  }
  async getComments(
    messageId: string,
    id: string | null,
    page: number,
    size: number,
  ) {
    const aggregatorOpts = [
      {
        $match: {
          messageId,
          item: null,
        },
      },
      { $sort: { onPin: -1, _id: -1 } },
      { $skip: (page - 1) * 5 },
      { $limit: 5 },
      {
        $lookup: {
          from: 'komu_users',
          localField: 'authorId',
          foreignField: 'id',
          as: 'author1',
        },
      },
      {
        $addFields: {
          length: 0,
          likeComment: 0,
          dislikeComment: 0,
          authorLike: null,
        },
      },
      {
        $project: {
          content: 1,
          onEdit: 1,
          createdTimestamp: 1,
          length: 1,
          onPin: 1,
          likeComment: 1,
          dislikeComment: 1,
          authorLike: id ? 1 : 0,
          messageId: 1,
          author: [
            {
              username: { $arrayElemAt: ['$author1.username', 0] },
              avatar: { $arrayElemAt: ['$author1.avatar', 0] },
              id: { $arrayElemAt: ['$author1.id', 0] },
            },
          ],
        },
      },
    ];
    let data = await this.komuComment.aggregate(aggregatorOpts as any).exec();
    if (data?.length < size && size !== 5) {
      data.splice(0, 5 - size);
    } else {
      data = data.slice(-size);
    }
    for (const item of data) {
      const testLength: any = await this.getCommentsItemLength(
        String(item?._id),
        String(item?.messageId),
      );
      const likeLength: any = await this.getLikesComment(
        String(item?._id),
        true,
      );
      const dislikeLength: any = await this.getLikesComment(
        String(item?._id),
        false,
      );
      if (id) {
        const testAuthor: any = await this.testLikesComment(
          String(item?._id),
          null,
          String(id),
          String(item?.messageId),
        );
        item.authorLike =
          testAuthor?.length === 0 ? null : testAuthor[0]?.onLike;
      }
      item.length = testLength?.length;
      item.likeComment = likeLength?.length;
      item.dislikeComment = dislikeLength?.length;
    }
    return data;
  }
  async comment({ messageId, content, authorId, id }) {
    const comments: any = new this.komuComment({
      messageId,
      authorId,
      content,
      createdTimestamp: Date.now(),
      onEdit: false,
      item: id ? id : null,
    });
    await comments.save();
    const message = await this.komuMessage.find({ messageId }).exec();
    await this.komuMessage.findOneAndUpdate(
      { messageId },
      {
        $set: {
          totalComment: message[0]?.totalComment
            ? message[0]?.totalComment + 1
            : 1,
        },
      },
      { new: true },
    );
    const commentAuthor = await this.komuUser.findOne({ id: authorId }).exec();
    const author = {
      username: commentAuthor?.username,
      avatar: commentAuthor?.avatar,
      id: commentAuthor?.id,
    };
    const messageNoti = [
      {
        links: message[0]?.links,
        source: message[0]?.source,
      },
    ];
    if (id) {
      const createdTimestamp = new Date().getTime();
      const onItem = ' thêm ';
      const contentItem = await this.komuComment.find({ _id: id });
      if (contentItem[0]?.authorId === authorId) {
        this.addEvent({
          data: {
            ...comments.toObject(),
            comment: 'addItem',
            author: [author],
          },
        });
      } else {
        const notification = new this.komuNotification({
          messageId,
          authorId,
          content,
          onItem,
          contentItem: contentItem[0]?.content,
          authorItem: contentItem[0]?.authorId,
          authorNotifi: contentItem[0]?.authorId,
          createdTimestamp,
        });
        await notification.save();
        this.addEvent({
          data: {
            ...comments.toObject(),
            comment: 'addItem',
            author: [author],
            authorNotifi: message[0]?.authorId,
            authorNotifi2: authorId,
            notification: {
              ...notification.toObject(),
              ...{ message: messageNoti },
              ...{ author: [author] },
            },
          },
        });
      }
    } else {
      if (message[0]?.authorId !== authorId) {
        const createdTimestamp = new Date().getTime();
        const onComment = ' thêm ';
        const notification = new this.komuNotification({
          messageId,
          authorId,
          content,
          onComment,
          createdTimestamp,
          authorNotifi: message[0]?.authorId,
        });
        await notification.save();
        this.addEvent({
          data: {
            ...comments.toObject(),
            comment: 'add',
            author: [author],
            authorNotifi: message[0]?.authorId,
            authorNotifi2: authorId,
            notification: {
              ...notification.toObject(),
              ...{ message: messageNoti },
              ...{ author: [author] },
            },
          },
        });
      } else {
        this.addEvent({
          data: {
            ...comments.toObject(),
            comment: 'add',
            author: [author],
          },
        });
      }
    }
    return true;
  }
  async deleteComment(id: string, messageId: string) {
    const deleteComment = await this.komuComment
      .findOneAndDelete({
        _id: id,
        authorId: messageId,
      })
      .exec();
    const deleteItem: any = await this.komuComment.find({ item: id }).exec();
    await this.komuComment.deleteMany({ item: id }).exec();
    const message = await this.komuMessage
      .find({ messageId: deleteComment?.messageId })
      .exec();

    await this.komuMessage.findOneAndUpdate(
      { messageId: deleteComment?.messageId },
      {
        $set: {
          totalComment: deleteComment?.item
            ? Number(message[0]?.totalComment - 1)
            : Number(message[0]?.totalComment - 1 - deleteItem?.length),
        },
      },
      { new: true },
    );
    if (deleteComment?.item) {
      const contentItem = await this.komuComment.find({
        _id: deleteComment?.item,
      });
      if (contentItem[0]?.authorId === messageId) {
        this.addEvent({
          data: {
            comment: 'deleteItem',
            lengthItem: deleteItem?.length,
            id,
            messageId: deleteComment?.messageId,
            item: deleteComment?.item,
          },
        });
      } else {
        const createdTimestamp = new Date().getTime();
        const onItem = ' xóa ';
        const notification = new this.komuNotification({
          messageId: deleteComment?.messageId,
          authorId: messageId,
          onItem,
          contentItem: contentItem[0]?.content,
          content: deleteComment?.content,
          authorItem: contentItem[0]?.authorId,
          authorNotifi: contentItem[0]?.authorId,
          createdTimestamp,
        });
        await notification.save();
        const author = await this.komuUser.find({ id: messageId }).exec();
        this.addEvent({
          data: {
            comment: 'deleteItem',
            lengthItem: deleteItem?.length,
            id,
            messageId: deleteComment?.messageId,
            item: deleteComment?.item,
            authorNotifi: message[0]?.authorId,
            authorNotifi2: messageId,
            notification: {
              ...notification.toObject(),
              ...{ message: message },
              ...{ author: author },
            },
          },
        });
      }
    } else {
      if (message[0]?.authorId !== messageId) {
        const createdTimestamp = new Date().getTime();
        const onComment = ' xóa ';
        const notification = new this.komuNotification({
          messageId: deleteComment?.messageId,
          authorId: messageId,
          onComment,
          content: deleteComment?.content,
          createdTimestamp,
          authorNotifi: message[0]?.authorId,
        });
        await notification.save();
        const author = await this.komuUser.find({ id: messageId }).exec();
        this.addEvent({
          data: {
            comment: 'delete',
            lengthItem: deleteItem?.length,
            id,
            messageId: deleteComment?.messageId,
            item: deleteComment?.item,
            authorNotifi: message[0]?.authorId,
            authorNotifi2: messageId,
            notification: {
              ...notification.toObject(),
              ...{ message: message },
              ...{ author: author },
            },
          },
        });
      } else {
        this.addEvent({
          data: {
            comment: 'delete',
            lengthItem: deleteItem?.length,
            id,
            messageId: deleteComment?.messageId,
            item: deleteComment?.item,
          },
        });
      }
    }
    return true;
  }
  async editComment(_id: string, newContent: string, messageId: string) {
    const oldComment: any = await this.komuComment.find({ _id: _id }).exec();
    const createdTimestamp = new Date().getTime();
    const updatedComment = await this.komuComment
      .findByIdAndUpdate(
        _id,
        { content: newContent, onEdit: true, createdTimestamp },
        { new: true },
      )
      .exec();
    const message = await this.komuMessage
      .find({ messageId: updatedComment?.messageId })
      .exec();
    if (updatedComment?.item) {
      const contentItem = await this.komuComment.find({
        _id: updatedComment.item,
      });
      if (contentItem[0]?.authorId === messageId) {
        this.addEvent({
          data: {
            comment: 'editItem',
            id: _id,
            input: newContent,
            item: updatedComment?.item,
            messageId: updatedComment?.messageId,
            createdTimestamp,
            onEdit: true,
          },
        });
      } else {
        const onItem = ' sửa ';
        const notification = new this.komuNotification({
          messageId: updatedComment?.messageId,
          authorId: updatedComment?.authorId,
          content: oldComment[0]?.content + ' => ' + newContent,
          onItem,
          contentItem: contentItem[0]?.content,
          authorItem: contentItem[0]?.authorId,
          authorNotifi: contentItem[0]?.authorId,
          createdTimestamp,
        });
        await notification.save();
        const author = await this.komuUser.find({ id: messageId }).exec();
        this.addEvent({
          data: {
            comment: 'editItem',
            id: _id,
            input: newContent,
            item: updatedComment?.item,
            messageId: updatedComment?.messageId,
            authorNotifi: message[0]?.authorId,
            authorNotifi2: updatedComment?.authorId,
            createdTimestamp,
            onEdit: true,
            notification: {
              ...notification.toObject(),
              ...{ message: message },
              ...{ author: author },
            },
          },
        });
      }
    } else {
      if (message[0]?.authorId !== messageId) {
        const onComment = ' sửa ';
        const notification = new this.komuNotification({
          messageId: updatedComment?.messageId,
          authorId: updatedComment?.authorId,
          onComment,
          content: oldComment[0]?.content + ' => ' + newContent,
          createdTimestamp,
          authorNotifi: message[0]?.authorId,
        });
        await notification.save();
        const author = await this.komuUser.find({ id: messageId }).exec();
        this.addEvent({
          data: {
            comment: 'edit',
            id: _id,
            input: newContent,
            item: updatedComment?.item,
            messageId: updatedComment?.messageId,
            authorNotifi: message[0]?.authorId,
            authorNotifi2: updatedComment?.authorId,
            createdTimestamp,
            onEdit: true,
            notification: {
              ...notification.toObject(),
              ...{ message: message },
              ...{ author: author },
            },
          },
        });
      } else {
        this.addEvent({
          data: {
            comment: 'edit',
            id: _id,
            input: newContent,
            item: updatedComment?.item,
            messageId: updatedComment?.messageId,
            createdTimestamp,
            onEdit: true,
          },
        });
      }
    }
    return true;
  }
  async getLikes(messageId: string, size: string, page: number) {
    return await this.komuLike
      .aggregate([
        {
          $match: {
            messageId,
            commentId: null,
          },
        },
        { $skip: (page - 1) * 5 },
        { $limit: size ? 5 : 3 },
        {
          $lookup: {
            from: 'komu_users',
            localField: 'authorId',
            foreignField: 'id',
            as: 'author1',
          },
        },
        {
          $project:
            size === 'true'
              ? {
                  author: [
                    {
                      username: { $arrayElemAt: ['$author1.username', 0] },
                      avatar: { $arrayElemAt: ['$author1.avatar', 0] },
                      id: { $arrayElemAt: ['$author1.id', 0] },
                    },
                  ],
                }
              : {
                  author: [
                    {
                      username: { $arrayElemAt: ['$author1.username', 0] },
                    },
                  ],
                },
        },
      ])
      .exec();
  }
  async getLikesLength(messageId: string) {
    return this.komuLike
      .aggregate([
        {
          $match: {
            messageId,
            commentId: null,
          },
        },
      ])
      .exec();
  }
  async getReactions(
    messageId: string,
    emoji: string,
    size: string,
    page: number,
  ) {
    return this.komuReaction
      .aggregate([
        {
          $match: {
            messageId,
            emoji,
          },
        },
        { $skip: (page - 1) * 5 },
        { $limit: size ? 5 : 3 },
        {
          $lookup: {
            from: 'komu_users',
            localField: 'authorId',
            foreignField: 'id',
            as: 'author1',
          },
        },
        {
          $project:
            size === 'true'
              ? {
                  author: [
                    {
                      username: { $arrayElemAt: ['$author1.username', 0] },
                      avatar: { $arrayElemAt: ['$author1.avatar', 0] },
                      id: { $arrayElemAt: ['$author1.id', 0] },
                    },
                  ],
                  emoji: 1,
                }
              : {
                  author: [
                    {
                      username: { $arrayElemAt: ['$author1.username', 0] },
                    },
                  ],
                },
        },
      ])
      .exec();
  }
  async getReactionsLength(messageId: string, emoji: string) {
    return this.komuReaction
      .aggregate([
        {
          $match: {
            messageId,
            emoji,
          },
        },
      ])
      .exec();
  }
  async findLikePosts(messageId: string, authorId: string) {
    const findLikePosts=this.komuLike.find({
      messageId,
      authorId,
      commentId: null,
    })
    return findLikePosts;
  }
  async like(messageId: string, authorId: string, onLike: boolean) {
    const test = await this.findLikePosts(messageId, authorId)
    if(test?.length ===0){
      const like = new this.komuLike({
        messageId,
        authorId,
        createdTimestamp: Date.now(),
        commentId: null,
        onLike,
      });
      await like.save();
      const message = await this.komuMessage.find({ messageId });
      await this.komuMessage.findOneAndUpdate(
        { messageId },
        {
          $set: {
            totalLike: message[0]?.totalLike ? message[0]?.totalLike + 1 : 1,
          },
        },
        { new: true },
      );
      if (message[0]?.authorId !== authorId) {
        const onLike = true;
        const createdTimestamp = new Date().getTime();
        const notification = new this.komuNotification({
          messageId,
          authorId,
          onLike,
          createdTimestamp,
          authorNotifi: message[0]?.authorId,
        });
        const author = await this.komuUser.find({ id: authorId }).exec();
        await notification.save();
        this.addEvent({
          data: {
            like: 'true',
            messageId,
            authorNotifi: message[0]?.authorId,
            authorNotifi2: authorId,
            notification: {
              ...notification.toObject(),
              ...{ message: message },
              ...{ author: author },
            },
          },
        });
      } else {
        this.addEvent({
          data: {
            like: 'true',
            messageId,
          },
        });
      }
      return like;
    }
  }
  async unlike(messageId: string, authorId: string) {
    const test = await this.findLikePosts(messageId, authorId)
    if(test?.length === 1){
      await this.komuLike
        .deleteOne({
          messageId,
          authorId,
          commentId: null,
          onLike: true,
        })
        .exec();
      const message = await this.komuMessage.find({ messageId });
      await this.komuMessage.findOneAndUpdate(
        { messageId },
        { $set: { totalLike: message[0]?.totalLike - 1 } },
        { new: true },
      );
      if (message[0]?.authorId !== authorId) {
        const onLike = false;
        const createdTimestamp = new Date().getTime();
        const notification = new this.komuNotification({
          messageId,
          authorId,
          onLike,
          createdTimestamp,
          authorNotifi: message[0]?.authorId,
        });
        const author = await this.komuUser.find({ id: authorId }).exec();
        await notification.save();
        this.addEvent({
          data: {
            like: 'false',
            messageId,
            authorNotifi: message[0]?.authorId,
            authorNotifi2: authorId,
            notification: {
              ...notification.toObject(),
              ...{ message: message },
              ...{ author: author },
            },
          },
        });
      } else {
        this.addEvent({
          data: {
            like: 'false',
            messageId,
          },
        });
      }
      return true;
    }
  }
  async getNotifications(authorId: string, page: number, size: number) {
    return await this.komuNotification
      .aggregate([
        {
          $match: {
            authorNotifi: authorId,
            authorId: { $ne: authorId },
          },
        },
        { $sort: { createdTimestamp: -1 } },
        { $skip: (page - 1) * size },
        { $limit: size },
        {
          $lookup: {
            from: 'komu_bwls',
            localField: 'messageId',
            foreignField: 'messageId',
            as: 'message1',
          },
        },
        {
          $unwind: '$message1',
        },
        {
          $lookup: {
            from: 'komu_users',
            localField: 'authorId',
            foreignField: 'id',
            as: 'author1',
          },
        },
        {
          $project: {
            content: 1,
            createdTimestamp: 1,
            onComment: 1,
            onLabel: 1,
            onLike: 1,
            messageId: 1,
            onLikeItem: 1,
            onItem: 1,
            contentItem: 1,
            authorItem: 1,
            author: [
              {
                username: { $arrayElemAt: ['$author1.username', 0] },
                avatar: { $arrayElemAt: ['$author1.avatar', 0] },
                id: { $arrayElemAt: ['$author1.id', 0] },
              },
            ],
            message: [
              {
                links: '$message1.links',
                source: '$message1.source',
              },
            ],
          },
        },
      ])
      .exec();
  }
  async getNotificationsSize(authorId: string) {
    return this.komuNotification
      .aggregate([
        {
          $match: {
            authorNotifi: authorId,
            authorId: { $ne: authorId },
          },
        },
      ])
      .exec();
  }
  async getPostsOne(messageId: string, authorId: string | null) {
    const aggregatorOpts = [
      {
        $match: {
          messageId,
        },
      },
      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: 'komu_users',
          localField: 'authorId',
          foreignField: 'id',
          as: 'author1',
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
          localField: 'messageId',
          foreignField: 'messageId',
          as: 'likes',
        },
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
        $addFields: {
          reactions: {
            $map: {
              input: '$reactions',
              as: 'reaction',
              in: {
                emoji: '$$reaction.emoji',
              },
            },
          },
          author: {
            username: { $arrayElemAt: ['$author1.username', 0] },
            avatar: { $arrayElemAt: ['$author1.avatar', 0] },
            id: { $arrayElemAt: ['$author1.id', 0] },
          },
          totalComment: { $size: '$comments' },
          totalLike: {
            $size: {
              $filter: {
                input: '$likes',
                as: 'like',
                cond: {
                  $or: [
                    { $eq: ['$$like.commentId', null] },
                    { $not: '$$like.commentId' },
                  ],
                },
              },
            },
          },
          likes: {
            $filter: {
              input: '$likes',
              as: 'like',
              cond: { $eq: ['$$like.commentId', null] },
            },
          },
        },
      },
      {
        $unset: authorId
          ? ['author1', 'comments']
          : ['author1', 'comments', 'likes'],
      },
      {
        $project: {
          messageId: 1,
          channelId: 1,
          links: 1,
          createdTimestamp: 1,
          source: 1,
          author: 1,
          reactions: 1,
          totalComment: 1,
          totalLike: 1,
          likes: 1,
        },
      },
    ];
    // eslint-disable-next-line prefer-const
    let data = await this.komuMessage.aggregate(aggregatorOpts as any).exec();
    for (const item of data) {
      item.reactions = this.reduceReactions(item.reactions);
      item.likes =
        item.likes?.filter((e: any) => e.authorId === authorId).length > 0
          ? true
          : false;
    }
    return data;
  }
  async postNotification(authorId: string) {
    const notification: any = await this.komuNotification
      .updateMany(
        { authorNotifi: authorId, onLabel: true },
        { $set: { onLabel: false } },
      )
      .exec();
    return notification;
  }
  async getHotPosts(
    authorId: string,
    page: number,
    size: number,
    channel1: string,
  ) {
    const aggregatorOpts = [
      {
        $match: {
          channelId: channel1,
          links: { $ne: [] },
        },
      },
      { $sort: { totalLike: -1, totalComment: -1, _id: -1 } },
      { $skip: (page - 1) * 5 },
      { $limit: 5 },
      {
        $lookup: {
          from: 'komu_users',
          localField: 'authorId',
          foreignField: 'id',
          as: 'author1',
        },
      },
      {
        $lookup: {
          from: 'komu_bwllikes',
          localField: 'messageId',
          foreignField: 'messageId',
          as: 'likes',
        },
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
        $addFields: {
          reactions: {
            $map: {
              input: '$reactions',
              as: 'reaction',
              in: {
                emoji: '$$reaction.emoji',
              },
            },
          },
          author: {
            username: { $arrayElemAt: ['$author1.username', 0] },
            avatar: { $arrayElemAt: ['$author1.avatar', 0] },
            id: { $arrayElemAt: ['$author1.id', 0] },
          },
          likes: {
            $filter: {
              input: '$likes',
              as: 'like',
              cond: { $eq: ['$$like.commentId', null] },
            },
          },
        },
      },
      {
        $project: {
          messageId: 1,
          links: 1,
          createdTimestamp: 1,
          source: 1,
          author: 1,
          reactions: 1,
          totalComment: 1,
          totalLike: 1,
          likes: 1,
        },
      },
    ];
    let data = await this.komuMessage.aggregate(aggregatorOpts as any).exec();
    if (data?.length < size && size !== 5) {
      data.splice(0, 5 - size);
    } else {
      data = data.slice(-size);
    }
    for (const item of data) {
      item.reactions = this.reduceReactions(item.reactions);
      item.likes =
        item.likes?.filter((e: any) => e.authorId === authorId).length > 0
          ? true
          : false;
    }
    return data;
  }
  async getAll(
    page: number,
    size: number,
    authorId: string | null,
    channel1: string,
  ) {
    const aggregatorOpts = [
      {
        $match: {
          channelId: channel1,
          links: { $ne: [] },
        },
      },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * 5 },
      { $limit: 5 },
      {
        $lookup: {
          from: 'komu_users',
          localField: 'authorId',
          foreignField: 'id',
          as: 'author1',
        },
      },
      {
        $lookup: {
          from: 'komu_bwllikes',
          localField: 'messageId',
          foreignField: 'messageId',
          as: 'likes',
        },
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
        $addFields: {
          reactions: {
            $map: {
              input: '$reactions',
              as: 'reaction',
              in: {
                emoji: '$$reaction.emoji',
              },
            },
          },
          author: {
            username: { $arrayElemAt: ['$author1.username', 0] },
            avatar: { $arrayElemAt: ['$author1.avatar', 0] },
            id: { $arrayElemAt: ['$author1.id', 0] },
          },
          likes: {
            $filter: {
              input: '$likes',
              as: 'like',
              cond: { $eq: ['$$like.commentId', null] },
            },
          },
        },
      },
      {
        $project: {
          messageId: 1,
          links: 1,
          createdTimestamp: 1,
          source: 1,
          author: 1,
          reactions: 1,
          totalComment: 1,
          totalLike: 1,
          likes: 1,
        },
      },
    ];
    // eslint-disable-next-line prefer-const
    let data = await this.komuMessage.aggregate(aggregatorOpts as any).exec();
    if (data?.length < size && size !== 5) {
      data.splice(0, 5 - size);
    } else {
      data = data.slice(-size);
    }
    for (const item of data) {
      item.reactions = this.reduceReactions(item.reactions);
      item.likes =
        item.likes?.filter((e: any) => e.authorId === authorId).length > 0
          ? true
          : false;
    }
    return data;
  }
  reduceReactions(reactions: any) {
    if (!reactions) {
      return reactions;
    }

    const reducedReactions = [];
    const emojiMap = {};

    for (const reaction of reactions) {
      const exists = emojiMap[reaction.emoji];
      const emojiWithId = emojis.find((e) => e.name === reaction.emoji);
      if (exists) {
        exists.count++;
      } else {
        const newReaction = {
          ...reaction,
          count: 1,
          ...(emojiWithId ? { id: emojiWithId.id } : {}),
        };
        reducedReactions.push(newReaction);
        emojiMap[reaction.emoji] = newReaction;
      }
    }

    return reducedReactions;
  }
  async deletePost(id: string, messageId: string) {
    const deletePost = await this.komuMessage
      .findOneAndDelete({
        _id: id,
        authorId: messageId,
      })
      .exec();

    this.addEvent({
      data: {
        posts: 'delete',
        id,
        channelId: deletePost?.channelId,
      },
    });
    return deletePost;
  }
  async editPost(id: string, messageId: string) {
    const editPost = await this.komuMessage
      .find({
        _id: id,
        authorId: messageId,
      })
      .exec();
    return editPost;
  }
  async updatePost(id: string, link: string) {
    const updatePost = await this.komuMessage
      .findByIdAndUpdate({ _id: id }, { links: [link], source: true })
      .exec();
    this.addEvent({
      data: {
        id,
        posts: 'edit',
        link: link,
      },
    });
    return updatePost;
  }
  async isMessageIdExists(messageId: string): Promise<boolean> {
    const count = await this.komuMessage.countDocuments({ messageId });
    return count > 0;
  }
  async addPost(authorId: string, links: string[], channelId: string, source?: boolean) {
    let messageId: string;
    let isMessageIdExists1: boolean;

    do {
      messageId = uuidv4();
      isMessageIdExists1 = await this.isMessageIdExists(messageId);
    } while (isMessageIdExists1);

    const addPost = new this.komuMessage({
      links: links,
      channelId: channelId,
      createdTimestamp: new Date().getTime(),
      authorId: authorId,
      messageId,
      source: source ? source : false,
    });
    await addPost.save();
    return addPost;
  }
  async getCommentsItemLength(id: string | null, messageId: string) {
    return await this.komuComment
      .aggregate([
        {
          $match: {
            item: id,
            messageId,
          },
        },
      ])
      .exec();
  }
  async getCommentsItem(
    id: string,
    commentId: string,
    messageId: string,
    page: number,
    size: number,
  ) {
    let data = await this.komuComment
      .aggregate([
        {
          $match: {
            item: commentId,
            messageId,
          },
        },
        {
          $sort: {
            onPin: -1,
            _id: -1,
          },
        },
        { $skip: (page - 1) * 5 },
        { $limit: 5 },
        {
          $lookup: {
            from: 'komu_users',
            localField: 'authorId',
            foreignField: 'id',
            as: 'author1',
          },
        },
        {
          $unwind: '$author1',
        },
        {
          $addFields: {
            length: 0,
            likeComment: 0,
            dislikeComment: 0,
            authorLike: null,
          },
        },
        {
          $project: {
            content: 1,
            onEdit: 1,
            createdTimestamp: 1,
            length: 1,
            likeComment: 1,
            dislikeComment: 1,
            onPin: 1,
            authorLike: id ? 1 : 0,
            messageId: 1,
            author: [
              {
                username: '$author1.username',
                avatar: '$author1.avatar',
                id: '$author1.id',
              },
            ],
          },
        },
      ])
      .exec();
    if (data?.length < size && size !== 5) {
      data.splice(0, 5 - size);
    } else {
      data = data.slice(-size);
    }
    for (const item of data) {
      const testLength: any = await this.getCommentsItemLength(
        String(item?._id),
        String(item?.messageId),
      );
      const likeLength: any = await this.getLikesComment(
        String(item?._id),
        true,
      );
      const dislikeLength: any = await this.getLikesComment(
        String(item?._id),
        false,
      );
      if (id) {
        const testAuthor: any = await this.testLikesComment(
          String(item?._id),
          null,
          String(id),
          String(item?.messageId),
        );
        item.authorLike =
          testAuthor?.length === 0 ? null : testAuthor[0]?.onLike;
      }
      item.length = testLength?.length;
      item.likeComment = likeLength?.length;
      item.dislikeComment = dislikeLength?.length;
    }
    return data;
  }
  async getLikesComment(commentId: string, onLike: boolean) {
    return await this.komuLike
      .aggregate([
        {
          $match: {
            commentId,
            onLike,
          },
        },
      ])
      .exec();
  }
  async postLikeComment(
    messageId: string,
    authorId: string,
    onLike: boolean | null,
    commentId: string,
  ) {
    const test = await this.testLikesComment(
      commentId,
      null,
      authorId,
      messageId,
    );
    const testItem = await this.komuComment.find({ _id: commentId });
    const createdTimestamp = new Date().getTime();

    const message = await this.komuMessage.find({ messageId }).exec();
    const commentAuthor = await this.komuUser.findOne({ id: authorId }).exec();
    const author = {
      username: commentAuthor?.username,
      avatar: commentAuthor?.avatar,
      id: commentAuthor?.id,
    };
    const messageNoti = [
      {
        links: message[0]?.links,
        source: message[0]?.source,
      },
    ];
    if (test?.length === 1) {
      if (test[0]?.onLike === onLike) {
        await this.komuLike
          .deleteMany({ commentId, authorId, messageId })
          .exec();
        const notification = new this.komuNotification({
          messageId,
          authorId,
          createdTimestamp,
          onLikeItem: 'null',
          contentItem: testItem[0]?.content,
          authorNotifi: testItem[0]?.authorId,
        });
        await notification.save();
        this.addEvent({
          data: {
            comment: testItem[0]?.item ? 'commentLikeItem' : 'commentLike',
            messageId,
            authorId,
            onLikeComment: null,
            item: testItem[0]?.item,
            commentId,
            authorNotifi: message[0]?.authorId,
            authorNotifi2: authorId,
            notification: {
              ...notification.toObject(),
              ...{ message: messageNoti },
              ...{ author: author },
            },
          },
        });
        return 'You are indifferent to this comment.';
      } else {
        const _id = test[0]?._id;
        await this.komuLike.findByIdAndUpdate(_id, { onLike: onLike }).exec();

        const notification = new this.komuNotification({
          messageId,
          authorId,
          createdTimestamp,
          onLikeItem: onLike ? 'true' : 'false',
          contentItem: testItem[0]?.content,
          authorNotifi: testItem[0]?.authorId,
        });
        await notification.save();

        this.addEvent({
          data: {
            comment: testItem[0]?.item ? 'commentLikeItem' : 'commentLike',
            messageId,
            authorId,
            onLikeComment: onLike,
            test: true,
            commentId,
            item: testItem[0]?.item,
            authorNotifi: message[0]?.authorId,
            authorNotifi2: authorId,
            notification: {
              ...notification.toObject(),
              ...{ message: messageNoti },
              ...{ author: author },
            },
          },
        });
        return onLike
          ? 'You like this comment.'
          : 'You do not like this comment.';
      }
    } else {
      const createdTimestamp = new Date().getTime();
      const like = new this.komuLike({
        messageId,
        authorId,
        createdTimestamp: createdTimestamp,
        onLike,
        commentId,
      });
      await like.save();
      const notification = new this.komuNotification({
        messageId,
        authorId,
        createdTimestamp,
        onLikeItem: onLike ? 'true' : 'false',
        contentItem: testItem[0]?.content,
        authorNotifi: testItem[0]?.authorId,
      });
      this.addEvent({
        data: {
          comment: testItem[0]?.item ? 'commentLikeItem' : 'commentLike',
          item: testItem[0]?.item,
          messageId,
          authorId,
          onLikeComment: onLike,
          commentId,
          authorNotifi: message[0]?.authorId,
          authorNotifi2: authorId,
          notification: {
            ...notification.toObject(),
            ...{ message: messageNoti },
            ...{ author: author },
          },
        },
      });
      await notification.save();
      return onLike
        ? 'You like this comment.'
        : 'You do not like this comment.';
    }
  }
  async testLikesComment(
    commentId: string,
    onLike: boolean | null,
    authorId: string,
    messageId: string,
  ) {
    const aggregatorOpts = [
      {
        $match:
          onLike !== null
            ? {
                commentId,
                onLike,
                authorId,
                messageId,
              }
            : {
                commentId,
                authorId,
                messageId,
              },
      },
    ];
    return await this.komuLike.aggregate(aggregatorOpts as any).exec();
  }
  async pinComment(id: string, onPin: boolean | null) {
    const pinComment = await this.komuComment
      .findByIdAndUpdate({ _id: id }, { onPin: onPin })
      .exec();
    this.addEvent({
      data: {
        comment: pinComment?.item ? 'pinCommentItem' : 'pinComment',
        id,
        onPin,
        messageId: pinComment?.messageId,
        item: pinComment?.item,
      },
    });
  }
  async onlineUser(id: string, online: boolean) {
    return await this.komuUser
      .findOneAndUpdate({ id: id }, { online: online })
      .exec();
  }
  async getChannelTotal() {
    const listChannel = await this.komuChannel.find()
    if (!listChannel || listChannel.length === 0) {
      return null;
    }
    const list = await Promise.all(
      listChannel?.map(async (item) => {
        const length = await this.findLengthMessage(item?.id);
        return {
          id: item?.id,
          name: item?.name,
          title: item?.title,
          type: item?.type,
          ...{ total: length } };
      }),
    );
    return list;
  }
  async searchByName(name: string, page: number, channelId: string) {
    return await this.komuUser
      .aggregate([
        {
          $match: {
            username: { $regex: name, $options: 'i' },
          },
        },
        {
          $lookup: {
            from: 'komu_bwls',
            localField: 'id',
            foreignField: 'authorId',
            as: 'messages',
          },
        },
        {
          $addFields: {
            total: {
              $size: {
                $filter: {
                  input: '$messages',
                  as: 'message',
                  cond: {
                    $and: [
                      { $eq: ['$$message.channelId', channelId] },
                      { $ne: ['$$message.links', []] },
                    ],
                  },
                },
              },
            },
          },
        },
        { $sort: { total: -1, username: 1 } },
        { $skip: (page - 1) * 10 },
        { $limit: 10 },
        {
          $project: {
            total: 1,
            id: 1,
            email: 1,
            avatar: 1,
            online: 1,
            username: 1,
          },
        },
      ])
      .exec();
  }
  async searchByLength(name: string) {
    return await this.komuUser
      .aggregate([
        {
          $match: {
            username: { $regex: name, $options: 'i' },
          },
        },
      ])
      .exec();
  }
  async searchPosts(id: string, page: number, channelId: string) {
    return await this.komuMessage
      .aggregate([
        {
          $match: {
            channelId: channelId,
            authorId: id,
            links: { $ne: [] },
          },
        },
        { $sort: { _id: -1 } },
        { $skip: (page - 1) * 10 },
        { $limit: 10 },
        {
          $project: {
            messageId: 1,
            source: 1,
            links: 1,
            createdTimestamp: 1,
          },
        },
      ])
      .exec();
  }
  async searchTimePosts(
    start: number,
    end: number,
    page: number,
    channelId: string,
  ) {
    return await this.komuMessage
      .aggregate([
        {
          $match: {
            channelId: channelId,
            links: { $ne: [] },
            createdTimestamp: { $gte: start, $lt: end },
          },
        },
        { $sort: { _id: -1 } },
        { $skip: (page - 1) * 10 },
        { $limit: 10 },
        {
          $project: {
            messageId: 1,
            source: 1,
            links: 1,
            createdTimestamp: 1,
          },
        },
      ])
      .exec();
  }
  async searchPostsLength(id: string, channeld: string) {
    return await this.komuMessage
      .aggregate([
        {
          $match: {
            channelId: channeld,
            authorId: id,
            links: { $ne: [] },
          },
        },
      ])
      .exec();
  }
  async searchTimePostsLength(start: number, end: number, channelId: string) {
    return await this.komuMessage
      .aggregate([
        {
          $match: {
            channelId: channelId,
            links: { $ne: [] },
            createdTimestamp: { $gte: start, $lt: end },
          },
        },
      ])
      .exec();
  }
  async deleteStart() {
    // await this.komuMessage.deleteMany({authorId: "1027051170650406913"});
    //await this.komuUser.deleteMany({username: "9694"});
    // await this.komuLike.deleteMany({authorId: "1027051170650406913"});
    // await this.komuComment.deleteMany({authorId: "1027051170650406913"});
    //await this.komuComment.deleteMany({item: "1027051170650406913"});
    //await this.komuUser.deleteMany({email: "9694"});
    //await this.komuLike.deleteMany();
    //this.komuMessage.find({channelId: channel});
    //await this.komuUser.deleteMany({id: "1027051170650406913"})
    //await this.komuMessage.find({channelId: channel}).sort({ _id: -1 });
    const test = 0;
    return test;
  }
}
