import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ collection: 'komu_comments' })
export class Comment {
  @Prop()
  messageId: string;

  @Prop()
  authorId: string;

  @Prop()
  content: string;

  @Prop()
  createdTimestamp: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
