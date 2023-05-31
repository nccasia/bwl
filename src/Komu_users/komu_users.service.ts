/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IKomuUsers, KomuUsers } from './komu_users.schema';
import { Model } from 'mongoose';

@Injectable()
export class KomuUsersService {
  constructor(
    @InjectModel(KomuUsers.name)
    private readonly komuUserModel: Model<IKomuUsers>,
  ) {}

  async findOne(id: string) {
    return this.komuUserModel.findOne({ id: id });
  }
}
