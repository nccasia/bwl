/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KomuUsersDocument = KomuUsers & Document;

@Schema({ collection: 'komu_users' })
export class KomuUsers {
  @Prop({ unique: true })
  id: string;

  @Prop()
  username: string;

  @Prop()
  display_name?: string | null;

  @Prop()
  avatar?: string | null;

  @Prop()
  online: boolean | null;
}

export const KomuUsersSchema = SchemaFactory.createForClass(KomuUsers);

export interface IKomuUsers {
  id: string;
  username: string;
  display_name?: string | null;
  avatar?: string | null;
}
