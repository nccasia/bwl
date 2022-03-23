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
          emoji: { $addToSet: '$emoji' },
          count: { $addToSet: '$count' },
        },
      },
      {
        $project: {
          _id: 0,
          messageId: '$_id',
          totalReact: {
            $size: '$totalReact',
          },
          emoji: 1,
          count: 1,
        },
      },
      {
        $lookup: {
          from: 'komu_bwls',
          localField: 'messageId',
          foreignField: 'messageId',
          as: 'author_message',
        },
      },
      {
        $unwind: '$author_message',
      },
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
        $sort: { totalReact: -1 },
      },
      {
        $group: {
          _id: '$author.id',
          author: { $first: '$author' },
          message: { $first: '$author_message' },
          totalReact: { $first: '$totalReact' },
          emojis: { $addToSet: '$emoji' },
        },
      },

      {
        $sort: { totalReact: 1 },
      },
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
    ];
    // const data = await this.komuReaction.aggregate(aggregatorOpts as any);
    const commentsFake = [
      {
        links: ['d86f40c5-ba12-4f02-8f72-049a191eba3c_unknown.png'],
        user: {
          id: '921585573901254727',
          username: 'huu.daohoang',
          avatar: 'd127c6f6c932b5d80f1a6f1914e962de',
        },
        comment: 'abcada',
      },
    ];
    const data = await (
      await this.komuReaction.aggregate(aggregatorOpts as any)
    ).map((item) => {
      return {
        ...item,
        message: {
          ...item.message,
          comments: commentsFake,
        },
      };
    });
    return { data };
  }
}
