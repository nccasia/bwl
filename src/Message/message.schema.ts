/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ collection: 'komu_bwls' })
export class Message {
  @Prop()
  id: string;

  @Prop()
  links: string[];

  @Prop()
  channelId: string;

  @Prop()
  guildId: string;

  @Prop()
  createdTimestamp: number;

  @Prop()
  messageId: string;

  @Prop()
  authorId: string;

  @Prop()
  source: boolean ;

  @Prop({ default: 0 })
  totalLike: number;

  @Prop({ default: 0 })
  totalComment: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
