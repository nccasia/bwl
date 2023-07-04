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
  async getComments(messageId: string, id: string | null, page: number, size: number) {
    const aggregatorOpts =[
        {
          $match: {
            messageId,
            item: null,
          },
        },
        {$sort: {_id: -1,}},
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
            likeComment:0,
            dislikeComment:0,
            authorLike: null, 
          }
        },
        {
          $project: {
            content: 1,
            onEdit: 1,
            createdTimestamp: 1,
            length:1,
            likeComment:1,
            dislikeComment:1,
            authorLike: id ? 1 : 0,
            messageId: 1,
            author: [{
              username: "$author1.username",
              avatar: "$author1.avatar",
              id: "$author1.id",
            }],
          }
        },
      ];
    let data = await this.komuComment.aggregate(aggregatorOpts as any).exec();
    if(data?.length <  size && size !==5){
      data.splice(0, 5-size);
    } else{
      data= data.slice(-size);
    }
    for (const item of data) {
      const testLength: any = await this.getCommentsItemLength(String(item?._id), String(item?.messageId));
      const likeLength: any = await this.getLikesComment(String(item?._id), true);
      const dislikeLength: any = await this.getLikesComment(String(item?._id), false);
      if(id){
        const testAuthor : any = await this.testLikesComment(String(item?._id), null, String(id), String(item?.messageId));
        item.authorLike= testAuthor?.length ===0 ? null : testAuthor[0]?.onLike;
      }
      item.length = testLength?.length;
      item.likeComment= likeLength?.length;
      item.dislikeComment=dislikeLength?.length;  
    }
    return data;
  }
  async comment({ messageId, content, authorId, id}) {
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
    const commentAuthor = await this.komuUser.findOne({ id: authorId }).exec();
    if(message[0]?.authorId !==authorId){
      const createdTimestamp = new Date().getTime();
      const onComment = " thêm ";
      const notification = new this.komuNotification({
        messageId,
        authorId,
        content,
        onComment,
        createdTimestamp,
      });
      await notification.save();
      this.addEvent({ data: { 
        ...comments.toObject(), 
        comment: id ? "addItem": "add", 
        author: [commentAuthor], 
        authorNotifi: message[0]?.authorId, 
        authorNotifi2: authorId,
        notification: {...notification.toObject(), ...{message: message}, ...{author: [commentAuthor]} },
      } });
    } else {
      this.addEvent({ data: { 
        ...comments.toObject(), 
        comment: id ? "addItem": "add", 
        author: [commentAuthor], 
        authorNotifi: message[0]?.authorId, 
        authorNotifi2: authorId,
      } });
    }
    return true;
  }
  async deleteComment(id: string, messageId: string) {
    const deleteComment = await this.komuComment.findOneAndDelete({
      _id: id,
      authorId: messageId,
    }).exec();
    const message = await this.komuMessage.find({ messageId: deleteComment?.messageId }).exec();
    if(message[0]?.authorId !==messageId){
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
      const author = await this.komuUser.find({ id: messageId }).exec();
      this.addEvent({ data: { 
        comment: deleteComment?.item ? "deleteItem" : "delete", 
        id, 
        messageId: deleteComment?.messageId,
        item: deleteComment?.item,
        authorNotifi: message[0]?.authorId, 
        authorNotifi2: messageId,
        notification: {...notification.toObject(), ...{message: message}, ...{author: author} },
      } });
    } else{
      this.addEvent({ data: { 
        comment: deleteComment?.item ? "deleteItem" : "delete", 
        id, 
        messageId: deleteComment?.messageId,
        item: deleteComment?.item,
        authorNotifi: message[0]?.authorId, 
        authorNotifi2: messageId,
      } });
    }
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
    const message = await this.komuMessage.find({ messageId: updatedComment?.messageId }).exec();
    if(message[0]?.authorId !==messageId){
      const onComment = " sửa ";
      const notification = new this.komuNotification({
        messageId: updatedComment?.messageId,
        authorId: updatedComment?.authorId,
        onComment,
        content: oldComment[0]?.content + " => " + newContent,
        createdTimestamp,
      });
      await notification.save();
      const author = await this.komuUser.find({ id: messageId }).exec();
      this.addEvent({ data: { 
        comment: updatedComment?.item ? "editItem" : "edit", 
        id: _id, 
        input: newContent, 
        item: updatedComment?.item,
        messageId: updatedComment?.messageId , 
        authorNotifi: message[0]?.authorId, 
        authorNotifi2: updatedComment?.authorId,
        createdTimestamp,
        onEdit: true,
        notification: {...notification.toObject(), ...{message: message}, ...{author: author} },
      } });
    } else{
      this.addEvent({ data: { 
        comment: updatedComment?.item ? "editItem" : "edit", 
        id: _id, 
        input: newContent, 
        item: updatedComment?.item,
        messageId: updatedComment?.messageId , 
        authorNotifi: message[0]?.authorId, 
        authorNotifi2: updatedComment?.authorId,
        createdTimestamp,
        onEdit: true,
      } });
    }
    return true;
  }
  async getLikes(messageId: string, size: string, page: number) {
    return await this.komuLike
      .aggregate([
        {
          $match: {
            messageId,
          },
        },
        { $skip: (page - 1) * 5 },
        { $limit: size ? 5: 3 },
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
          $project: size === "true" ? 
          {
            author: [{
              username: "$author1.username",
              avatar: "$author1.avatar",
              id: "$author1.id",
            }],
          }
          : 
          {
            author: [{
              username: "$author1.username",
            }],
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
          },
        },
      ])
      .exec();
  }
  async getReactions(messageId: string, emoji: string, size: string, page: number) {
    return this.komuReaction
      .aggregate([
        {
          $match: {
            messageId,
            emoji,
          },
        },
        { $skip: (page - 1) * 5 },
        { $limit: size ? 5: 3 },
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
          $project: size === "true" ? 
          {
            author: [{
              username: "$author1.username",
              avatar: "$author1.avatar",
              id: "$author1.id",
            }],
            emoji:1,
          }
          : 
          {
            author: [{
              username: "$author1.username",
            }],
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
  async like({ messageId, authorId }) {
    const like = new this.komuLike({
      messageId,
      authorId,
      createdTimestamp: Date.now(),
    });
    await like.save();
    const message = await this.komuMessage.find({ messageId }).exec();
    if(message[0]?.authorId !==authorId){
      const onLike = true;
      const createdTimestamp = new Date().getTime();
      const notification =  new this.komuNotification({
        messageId,
        authorId,
        onLike,
        createdTimestamp,
      });
      const author = await this.komuUser.find({ id:authorId }).exec();
      await notification.save();
      this.addEvent({ data: { 
        like: "true", 
        messageId, 
        authorNotifi: message[0]?.authorId, 
        authorNotifi2: authorId, 
        notification: {...notification.toObject(), ...{message: message}, ...{author: author} }
      } });
    } else{
      this.addEvent({ data: { 
        like: "true", 
        messageId, 
        authorNotifi: message[0]?.authorId, 
        authorNotifi2: authorId, 
      } });
    }
    return like;
  }
  async unlike({ messageId, authorId }) {
    await this.komuLike
      .deleteOne({
        messageId,
        authorId,
      })
      .exec();
    const message = await this.komuMessage.find({ messageId }).exec();
    if(message[0]?.authorId !==authorId){
      const onLike = false;
      const createdTimestamp = new Date().getTime();
      const notification =  new this.komuNotification({
        messageId,
        authorId,
        onLike,
        createdTimestamp,
      });
      const author = await this.komuUser.find({ id:authorId }).exec();
      await notification.save();
      this.addEvent({ data: { 
        like: "false", 
        messageId, 
        authorNotifi: message[0]?.authorId, 
        authorNotifi2: authorId,
        notification: {...notification.toObject(), ...{message: message}, ...{author: author} },
      } });
    } else{
      this.addEvent({ data: { 
        like: "false", 
        messageId, 
        authorNotifi: message[0]?.authorId, 
        authorNotifi2: authorId,
      } });
    }
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
            messageId: 1,
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
            as: 'message1'
          }
        },
        {
          $unwind: '$message1' ,
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
          $unwind: '$author1',
        },
        {
          $project: {
            content:1,
            createdTimestamp:1,
            onComment: 1,
            onLabel:1,
            onLike:1,
            messageId:1,
            author: [{
              username: "$author1.username",
              avatar: "$author1.avatar",
              id: "$author1.id",
            }],
            message: [{
              links: "$message1.links",
              source: "$message1.source",
            }]
          }
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
          as: 'author1',
        },
      },
      {
        $unwind: '$author1',
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
          'reactions': {
            $map: {
              input: '$reactions',
              as: 'reaction',
              in: {
                emoji: '$$reaction.emoji'
              }
            }
          },
          author: {
            username: "$author1.username",
            avatar: "$author1.avatar",
            id: "$author1.id",
          },
          totalComment: { $size: "$comments" },
          totalLike: { $size: "$likes" },
          likes: "$likes",
        }
      },      
      {
        $unset: authorId ? ['author1', 'comments'] : ['author1', 'comments', 'likes'],
      },
      {
        $project: {
          messageId: 1,
          links: 1,
          createdTimestamp: 1,
          source:1,
          author: 1,
          reactions: 1,
          totalComment: 1,
          totalLike: 1,
          likes: 1,
        }
      }
    ];
    // eslint-disable-next-line prefer-const
    let data = await this.komuMessage.aggregate(aggregatorOpts as any).exec();
    for (const item of data) {
      item.reactions = this.reduceReactions(item.reactions);
      item.likes = item.likes?.filter((e: any) => e.authorId === authorId).length > 0 ? true : false;
    }
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
          as: 'author1',
        },
      },
      {
        $unwind: '$author1',
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
          author: {
            username: "$author1.username",
            avatar: "$author1.avatar",
            id: "$author1.id",
          },
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
        $unset: ['author1','comments', 'likes']
      },
      {
        $project: {
          messageId: 1,
          links: 1,
          createdTimestamp: 1,
          source:1,
          author: 1,
          totalComment: 1,
          totalLike: 1
        }
      },
    ]; 
    const data = await this.komuMessage.aggregate(aggregatorOpts as any).exec();
    return data;
  }  
  async getAll(page: number, size: number, authorId: string | null) {
    const aggregatorOpts = [
      { $match: { channelId: channel } },
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
        $unwind: '$author1',
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
          'reactions': {
            $map: {
              input: '$reactions',
              as: 'reaction',
              in: {
                emoji: '$$reaction.emoji'
              }
            }
          },
          author: {
            username: "$author1.username",
            avatar: "$author1.avatar",
            id: "$author1.id",
          },
          totalComment: { $size: "$comments" },
          totalLike: { $size: "$likes" },
          likes: "$likes",
        }
      },      
      {
        $unset: authorId ? ['author1', 'comments'] : ['author1', 'comments', 'likes'],
      },
      {
        $project: {
          messageId: 1,
          links: 1,
          createdTimestamp: 1,
          source:1,
          author: 1,
          reactions: 1,
          totalComment: 1,
          totalLike: 1,
          likes: 1,
        }
      }
    ];
    // eslint-disable-next-line prefer-const
    let data = await this.komuMessage.aggregate(aggregatorOpts as any).exec();
    if(data?.length <  size && size !==5){
      data.splice(0, 5-size);
    } else{
      data= data.slice(-size);
    }
    for (const item of data) {
      item.reactions = this.reduceReactions(item.reactions);
      item.likes = item.likes?.filter((e: any) => e.authorId === authorId).length > 0 ? true : false;

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
  async getCommentsItem(id: string,commentId: string, messageId: string, page: number, size: number) {
    let data = await this.komuComment
      .aggregate([
        {
          $match: {
            item: commentId,
            messageId,
          },
        },
        {$sort: {_id: -1,}},
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
            likeComment:0,
            dislikeComment:0,
            authorLike: null, 
          }
        },
        {
          $project: {
            content: 1,
            onEdit: 1,
            createdTimestamp: 1,
            length:1,
            likeComment:1,
            dislikeComment:1,
            authorLike: id ? 1 : 0,
            messageId: 1,
            author: [{
              username: "$author1.username",
              avatar: "$author1.avatar",
              id: "$author1.id",
            }],
          }
        },
      ])
      .exec();
    if(data?.length <  size && size !==5){
      data.splice(0, 5-size);
    } else{
      data= data.slice(-size);
    }
    for (const item of data) {
      const testLength: any = await this.getCommentsItemLength(String(item?._id), String(item?.messageId));
      const likeLength: any = await this.getLikesComment(String(item?._id), true);
      const dislikeLength: any = await this.getLikesComment(String(item?._id), false);
      if(id){
        const testAuthor : any = await this.testLikesComment(String(item?._id), null, String(id), String(item?.messageId));;
        item.authorLike= testAuthor?.length ===0 ? null : testAuthor[0]?.onLike;
      }
      item.length = testLength?.length;
      item.likeComment= likeLength?.length;
      item.dislikeComment=dislikeLength?.length; 
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
  async postLikeComment(messageId: string, authorId: string, onLike: boolean | null, commentId: string ) {
    const test = await this.testLikesComment(commentId, null, authorId, messageId);
    const testItem = await this.komuComment.find({_id: commentId});
    if(test?.length===1){
      if(test[0]?.onLike === onLike){
        this.addEvent({ data: { 
          comment: testItem[0]?.item ? "commentLikeItem" : "commentLike",
          messageId,
          authorId,
          onLikeComment: null,
          item: testItem[0]?.item,
          commentId,
        } });
        await this.komuLike.deleteMany({commentId, authorId, messageId}).exec();
      }
      else{
        this.addEvent({ data: { 
          comment: testItem[0]?.item ? "commentLikeItem" : "commentLike",
          messageId,
          authorId,
          onLikeComment: onLike,
          test: true,
          commentId,
          item: testItem[0]?.item,
        } });
        const _id = test[0]?._id;
        await this.komuLike.findByIdAndUpdate(
          _id,
          {onLike: onLike}, 
        ).exec();
      }
    } else{
      this.addEvent({ data: { 
        comment: testItem[0]?.item ? "commentLikeItem" : "commentLike",
        item: testItem[0]?.item,
        messageId,
        authorId,
        onLikeComment: onLike,
        commentId,
      } });
      const createdTimestamp = new Date().getTime();
      const like = new this.komuLike({
        messageId,
        authorId,
        createdTimestamp: createdTimestamp,
        onLike,
        commentId,
      });
      await like.save();
      return true;
    }
  }
  async testLikesComment(commentId: string, onLike: boolean | null, authorId: string, messageId: string) {  
    const aggregatorOpts = [
        {
          $match: onLike !== null ? 
          {
            commentId,
            onLike,
            authorId,
            messageId,
          }
          :
          {
            commentId,
            authorId,
            messageId,
          }
        },
      ];
      return await this.komuLike.aggregate(aggregatorOpts as any).exec();
  }
}