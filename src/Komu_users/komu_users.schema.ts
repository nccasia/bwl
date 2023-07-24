/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KomuUsersDocument = KomuUsers & Document;

@Schema({ collection: 'komu_users' })
export class KomuUsers {
  @Prop()
  id: string;

  @Prop()
  username: string;

  @Prop()
  discriminator: string;

  @Prop()
  avatar: string;

  @Prop()
  online: boolean | null;
}

export const KomuUsersSchema = SchemaFactory.createForClass(KomuUsers);

export interface IKomuUsers {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
}
