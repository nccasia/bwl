/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KomuUsers, KomuUsersDocument } from '../Komu_users/komu_users.schema';
import { KomuUsersService } from '../Komu_users/komu_users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userservice: KomuUsersService,
    @InjectModel(KomuUsers.name)
    private readonly komuUserModel: Model<KomuUsersDocument>,
  ) { }

  async findUserFromDiscordId(id: string): Promise<any> {
    const user = await this.userservice.findUpdate(id);
    return user;
  }

  async findUser(username: string): Promise<any> {
    return await this.komuUserModel.findOne({ username: username });
  }

  async saveUser(
    id: string,
    username: string,
    avatar: string,
    display_name: string,
    online: boolean,
  ) {
    const newUser = new this.komuUserModel({
      id,
      display_name,
      avatar,
      username,
      online,
    });
    await newUser.save();
    return newUser;
  }
}
