/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction, ReactionDocument } from './Reaction/reaction.schema';
import { emojis } from './constants';
import { Message, MessageDocument } from './Message/message.schema';
import { Comment, CommentDocument } from './Comment/comment.schema';
import { Like, LikeDocument } from './Like/like.schema';
import { Notification, NotificationDocument} from './Notification/notification.schema';
import { Observable, Subject } from 'rxjs';
import { KomuUsers, KomuUsersDocument } from './Komu_users/komu_users.schema';
import {channel, guild} from "./Channel"
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  commentModel: any;
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
    @InjectModel(KomuUsers.name)
    private readonly komuUser: Model<KomuUsersDocument>,
  ) {
    this.checkForChanges();
  }

  private setTime=0;
  private checkForChanges () {
    const checkChanges = async(index: number)=> {
      const currentTime = index;
      const aggregatorOpts = [
        { 
          $match: {
            channelId: channel, 
            createdTimestamp: {$gt: currentTime },
          } 
        },
        { $sort: { _id: -1 } },
      ]
      const newRecord= await this.komuMessage.aggregate(aggregatorOpts as any).exec();
      let list : any =[];
      if (newRecord?.length > 0) {
        for (const item of newRecord) {
          const test= await this.getPostsOne(item.messageId, null);
          list = [...list,...test];
        }
        this.addEvent({ data: {list, posts: "add" } });
        this.setTime=Number(newRecord[0]?.createdTimestamp);
      }
    };
    const findTime = async()=>{
      const result= await this.komuMessage.aggregate([
        { 
          $match: {
            channelId: channel, 
          } 
        },
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
    }
    const foo = async() => {
      if(this.setTime===0){
        this.setTime=Number(await findTime());
      }
      setInterval(()=> checkChanges(this.setTime), 5000);
    }
    foo();
  }
  async findLikeFromDiscordId( authorId: string,messageId: string): Promise<any> {
    return await this.komuLike.findOne({ authorId: authorId, messageId: messageId });
  }
  async findLikeMessageFromDiscordId(messageId: string): Promise<any> {
    return await this.komuLike.find({ messageId: messageId });
  }
  async findMessageAuthorId(authorId: string): Promise<any> {
    return await this.komuMessage.find({ 
      authorId: authorId,
      channelId: channel,
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
  async findLengthMessage(): Promise<any> {
    const count = await this.komuMessage.countDocuments({ channelId: channel }).exec();
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

  async getComments(messageId: string, page: number, size: number) {
    return await this.komuComment
      .aggregate([
        {
          $match: {
            messageId,
          },
        },
        {$sort: {_id: -1,}},
        { $skip: (page - 1) * size },
        { $limit: size },
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
  async comment({ messageId, content, authorId}) {
    const comments: any = new this.komuComment({
      messageId,
      authorId,
      content,
      createdTimestamp: Date.now(),
      onEdit: false
    });
    const createdTimestamp = new Date().getTime();
    const onComment = " thêm ";
    const notification = new this.komuNotification({
      messageId,
      authorId,
      content,
      onComment,
      createdTimestamp,
    });

    await comments.save();
    await notification.save();
    const message = await this.komuMessage.find({ messageId }).exec();
    const commentAuthor = await this.komuUser.findOne({ id: authorId }).exec();
    this.addEvent({ data: { 
      ...comments.toObject(), 
      comment: "add", 
      author: [commentAuthor], 
      authorNotifi: message[0]?.authorId, 
      authorNotifi2: authorId,
      notification: {...notification.toObject(), ...{message: message}, ...{author: [commentAuthor]} },
    } });
    return true;
  }
  async deleteComment(id: string, messageId: string) {
    const deleteComment = await this.komuComment.findOneAndDelete({
      _id: id,
      authorId: messageId,
    }).exec();
    
    const createdTimestamp = new Date().getTime();
    const onComment = " xóa ";
    const notification = new this.komuNotification({
      messageId: deleteComment?.messageId,
      authorId: messageId,
      onComment,
      content: deleteComment?.content,
      createdTimestamp,
    });
    await notification.save();
    const message = await this.komuMessage.find({ messageId: deleteComment?.messageId }).exec();
    const author = await this.komuUser.find({ id: messageId }).exec();
    this.addEvent({ data: { 
      comment: "delete", 
      id, 
      messageId: deleteComment?.messageId , 
      authorNotifi: message[0]?.authorId, 
      authorNotifi2: messageId,
      notification: {...notification.toObject(), ...{message: message}, ...{author: author} },
    } });
    return true;
  }
  async editComment(_id: string, newContent: string,  messageId: string) {
    const oldComment : any= await this.komuComment.find({ _id: _id }).exec();
    const createdTimestamp = new Date().getTime();
    const updatedComment = await this.komuComment.findByIdAndUpdate(
      _id,
      { content: newContent, onEdit: true, createdTimestamp },
      { new: true }
    ).exec();
    const onComment = " sửa ";
    const notification = new this.komuNotification({
      messageId: updatedComment?.messageId,
      authorId: updatedComment?.authorId,
      onComment,
      content: oldComment[0]?.content + " => " + newContent,
      createdTimestamp,
    });
    await notification.save();
    const message = await this.komuMessage.find({ messageId: updatedComment?.messageId }).exec();
    const author = await this.komuUser.find({ id: messageId }).exec();
    this.addEvent({ data: { 
      comment: "edit", 
      id: _id, 
      input: newContent, 
      messageId: updatedComment?.messageId , 
      authorNotifi: message[0]?.authorId, 
      authorNotifi2: updatedComment?.authorId,
      createdTimestamp,
      onEdit: true,
      notification: {...notification.toObject(), ...{message: message}, ...{author: author} },
    } });
    return true;
  }
  async getLikes(messageId: string) {
    return await this.komuLike
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
  async getReactions(messageId: string, emoji: string) {
    return this.komuReaction
      .aggregate([
        {
          $match: {
            messageId,
            emoji
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
    const onLike = true;
    const createdTimestamp = new Date().getTime();
    const notification =  new this.komuNotification({
      messageId,
      authorId,
      onLike,
      createdTimestamp,
    });

    await like.save();
    const message = await this.komuMessage.find({ messageId }).exec();
    const author = await this.komuUser.find({ id:authorId }).exec();
    await notification.save();
    this.addEvent({ data: { 
      like: "true", 
      messageId, 
      authorNotifi: message[0]?.authorId, 
      authorNotifi2: authorId, 
      notification: {...notification.toObject(), ...{message: message}, ...{author: author} }
    } });
    return like;
  }
  async unlike({ messageId, authorId }) {
    await this.komuLike
      .deleteOne({
        messageId,
        authorId,
      })
      .exec();
    const onLike = false;
    const createdTimestamp = new Date().getTime();
    const notification =  new this.komuNotification({
      messageId,
      authorId,
      onLike,
      createdTimestamp,
    });
    const message = await this.komuMessage.find({ messageId }).exec();
    const author = await this.komuUser.find({ id:authorId }).exec();
    await notification.save();
    this.addEvent({ data: { 
      like: "false", 
      messageId, 
      authorNotifi: message[0]?.authorId, 
      authorNotifi2: authorId,
      notification: {...notification.toObject(), ...{message: message}, ...{author: author} },
    } });
    return true;
  }
  async getNotifications(authorId: string, page: number, size: number) {
    const messageIds = await this.komuMessage
      .aggregate([
        {
          $match: {
            authorId: authorId,
            channelId: channel,
          }
        },
        {
          $project: {
            messageId: 1
          }
        }
      ])
      .exec();
  
    const messageIdsArray = messageIds.map((message: any) => message.messageId);
  
    return await this.komuNotification
      .aggregate([
        {
          $match: {
            messageId: {
              $in: messageIdsArray
            },
            authorId: { $ne: authorId },
          }
        },
        {$sort: {_id: -1} },
        { $skip: (page - 1) * size },
        { $limit: size },
        {
          $lookup: {
            from: 'komu_bwls',
            localField: 'messageId',
            foreignField: 'messageId',
            as: 'message'
          }
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
  async getNotificationsSize(messageId: string, authorId: string) {
    return this.komuNotification
      .aggregate([
        {
          $match: {
            messageId,
            authorId: { $ne: authorId },
          },
        },
      ])
      .exec();
  }
  async getPostsOne(messageId: string, authorId: string | null) {
    const aggregatorOpts = [
      { $match: { 
          channelId: channel,
          messageId, 
        } 
      },
      { $sort: { _id: -1 } },
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
          totalComment: { $size: "$comments" },
          totalLike: { $size: "$likes" },
        }
      },      
      {
        $unset: authorId ? ['comments'] : ['comments', 'likes'],
      },
    ];
    // eslint-disable-next-line prefer-const
    let data = await this.komuMessage.aggregate(aggregatorOpts as any).exec();
    data.forEach((item : any) => {
      item.reactions = item.reactions?.reduce((result: any, reaction: any) => {
        const exists = result.find((e: any) => e.name === reaction.emoji);
        const emojiWithId = emojis.find((e: any) => e.name === reaction.emoji);
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
      item.likes = item.likes?.filter((e: any) => e.authorId === authorId).length >0 ? true : false;
    })
    return data;
  }
  async postNotification(messageId: string) {
    const notification: any = await this.komuNotification.updateMany(
      { messageId: messageId, onLabel: true },
      { $set: { onLabel: false } }
    ).exec();
    return notification;
  }
  async getHotPosts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const now = new Date();
    const aggregatorOpts = [
      {
        $match: {
          channelId: channel,
          createdTimestamp: { $gte: sevenDaysAgo.getTime(), $lte: now.getTime() },
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
      {
        $unwind: '$author',
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
        $addFields: {
          totalComment: { $size: '$comments' },
          totalLike: { $size: '$likes' },
        },
      },
      {
        $sort: {
          totalLike: -1,
          totalComment: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $unset: ['comments', 'likes']
      },
    ]; 
    const data = await this.komuMessage.aggregate(aggregatorOpts as any).exec();
    return data;
  }  
  async getAll(page: number, size: number, authorId: string | null) {
    const aggregatorOpts = [
      { $match: { channelId: channel } },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * size },
      { $limit: size },
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
          totalComment: { $size: "$comments" },
          totalLike: { $size: "$likes" },
        }
      },      
      {
        $unset: authorId ? ['comments'] : ['comments', 'likes'],
      },
    ];
    // eslint-disable-next-line prefer-const
    let data = await this.komuMessage.aggregate(aggregatorOpts as any).exec();
    data.forEach((item : any) => {
      item.reactions = item.reactions?.reduce((result: any, reaction: any) => {
        const exists = result.find((e: any) => e.name === reaction.emoji);
        const emojiWithId = emojis.find((e: any) => e.name === reaction.emoji);
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
      item.likes = item.likes?.filter((e: any) => e.authorId === authorId).length >0 ? true : false;
    })
    return data;
  }

  async deletePost(id: string, messageId: string) {
    const deletePost = await this.komuMessage.findOneAndDelete({
      _id: id,
      authorId: messageId,
    }).exec();

    this.addEvent({ data: { 
      posts: "delete", 
      id, 
    } });
    return deletePost;
  }

  async editPost(id: string, messageId: string) {
    const editPost = await this.komuMessage.find({
      _id: id,
      authorId: messageId,
    }).exec();
    return editPost;
  }
  async updatePost(id: string, link: string) {
    const updatePost = await this.komuMessage.findByIdAndUpdate(
      {_id: id},
      {links: [link], source: true}, 
    ).exec();
    this.addEvent({ data: { 
      id,
      posts: "edit", 
      link: link, 
    } });
    return updatePost;
  }
  async isMessageIdExists(messageId: string): Promise<boolean> {
    const count = await this.komuMessage.countDocuments({ messageId });
    return count > 0;
  }
  async addPost(authorId: string, links: string) {
    let messageId: string;
    let isMessageIdExists1: boolean;

    do {
      messageId = uuidv4();
      isMessageIdExists1 = await this.isMessageIdExists(messageId);
    } while (isMessageIdExists1);

    const addPost =  new this.komuMessage({
      links:[links],
      channelId:channel,
      guildId: guild,
      createdTimestamp: new Date().getTime(),
      authorId:authorId,
      messageId,
      source: true,
    });
    await addPost.save();
    return addPost;
  }
}

