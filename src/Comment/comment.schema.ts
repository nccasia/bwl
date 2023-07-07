/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ collection: 'komu_bwlcomments' })
export class Comment {
  @Prop()
  messageId: string;

  @Prop()
  authorId: string;

  @Prop()
  content: string;

  @Prop()
  count: number;

  @Prop()
  onEdit: boolean;

  @Prop()
  createdTimestamp: number;

  @Prop({ default: false })
  onPin: boolean;

  @Prop()
  item: string | null;

}

export const CommentSchema = SchemaFactory.createForClass(Comment);
