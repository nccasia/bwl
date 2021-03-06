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
}

export const MessageSchema = SchemaFactory.createForClass(Message);
