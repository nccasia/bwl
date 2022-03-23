import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { KomuUsers, KomuUsersDocument } from 'src/Komu_users/komu_users.schema';
import { KomuUsersService } from 'src/Komu_users/komu_users.service';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userservice: KomuUsersService,
    @InjectModel(KomuUsers.name)
    private readonly komuUserModel: Model<KomuUsersDocument>,
  ) {}

  async findUserFromDiscordId(id: string): Promise<any> {
    const user = await this.userservice.findOne(id);
    return user;
  }

  async saveUser(
    id: string,
    discriminator: string,
    avatar: string,
    username: string,
  ) {
    const newUser = new this.komuUserModel({
      id,
      discriminator,
      avatar,
      username,
    });
    await newUser.save();
  }
}
