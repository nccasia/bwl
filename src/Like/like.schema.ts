import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LikeDocument = Like & Document;

@Schema({ collection: 'komu_likes' })
export class Like {
  @Prop()
  messageId: string;

  @Prop()
  authorId: string;

  @Prop()
  createdTimestamp: number;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
