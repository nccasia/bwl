import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { KomuUsers, KomuUsersDocument } from './Komu_users/komu_users.schema';
import { Model } from 'mongoose';
import { Reaction, ReactionDocument } from './Reaction/reaction.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Reaction.name)
    private readonly komuReaction: Model<ReactionDocument>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAll(page: number) {
    const aggregatorOpts = [
      {
        $group: {
          _id: '$messageId',
          totalReact: { $addToSet: '$authorId' },
          emoji: { $push: '$emoji' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      // {
      //   $project: {
      //     _id: 0,
      //     messageId: '$_id',
      //     totalReact: {
      //       $size: '$totalReact',
      //     },
      //     emoji: 1,
      //   },
      // },
      {
        $lookup: {
          from: 'komu_bwls',
          localField: '_id',
          foreignField: 'messageId',
          as: 'author_message',
        },
      },
      {
        $unwind: '$author_message',
      },
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
      {
        $lookup: {
          from: 'komu_users',
          localField: 'author_message.authorId',
          foreignField: 'id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
      {
        $project: {
          _id: 0,
          author: 1,
          message: '$author_message',
          totalReact: 1,
          emojis: '$emoji',
        },
      },
    ];
    let data = await this.komuReaction.aggregate(aggregatorOpts as any).exec();

    data = data.map((item) => {
      item.emojis = item.emojis.reduce((result, emoji) => {
        const exists = result.find((e) => e.name === emoji);
        if (exists) {
          exists.count++;
        } else {
          result.push({ name: emoji, count: 1 });
        }
        return result;
      }, []);
      return {
        ...item,
        message: {
          ...item.message,
          comments: [],
        },
      };
    });
    return data;
  }
}
