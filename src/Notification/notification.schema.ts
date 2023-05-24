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

  @Prop({ default: Date.now() })
  createdTimestamp: number;

  @Prop()
  onLike: boolean;

  @Prop({ default: true })
  onLabel: boolean;
}

export const NotificationSchema: any = SchemaFactory.createForClass(Notification);
