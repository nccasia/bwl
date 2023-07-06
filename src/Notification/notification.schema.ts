/* eslint-disable prettier/prettier */
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
  count: number;

  @Prop()
  createdTimestamp: number;

  @Prop()
  onLike: boolean;

  @Prop()
  onComment: string;

  @Prop()
  onItem: string;

  @Prop()
  onLikeItem: string;

  @Prop()
  contentItem: string;

  @Prop({ default: true })
  onLabel: boolean;
}

export const NotificationSchema: any = SchemaFactory.createForClass(Notification);
