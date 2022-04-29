import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ collection: 'komu_bwlnotifications' })
export class Notification {
  @Prop()
  id: number;

  @Prop()
  messageId: string;

  @Prop()
  authorId: string;

  @Prop()
  content: string;

  @Prop()
  status: number;

  @Prop()
  authorUser: string;

  @Prop()
  authorAvatar: string;

  @Prop()
  createdTimestamp: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
