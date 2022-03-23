import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KomuUsers, KomuUsersSchema } from './komu_users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KomuUsers.name, schema: KomuUsersSchema },
    ]),
  ],
  // controllers: [KomuUsersController],
  // providers: [KomuUsersService],
  exports: [
    MongooseModule.forFeature([
      { name: KomuUsers.name, schema: KomuUsersSchema },
    ]),
  ],
})
export class KomuUsersModule {}
