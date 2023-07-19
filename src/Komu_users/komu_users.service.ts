/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IKomuUsers, KomuUsers } from './komu_users.schema';
import { Model } from 'mongoose';

@Injectable()
export class KomuUsersService {
  findOneAndUpdate(arg0: { id: string; }, arg1: { online: boolean; }) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(KomuUsers.name)
    private readonly komuUserModel: Model<IKomuUsers>,
  ) {}

  async findOne(id: string) {
    return this.komuUserModel.findOne({ id: id });
  }

  async findUpdate(id: string) {
    return this.komuUserModel.find({ id: id });
  }
}
