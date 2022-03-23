import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReactionDocument = Reaction & Document;

@Schema({ collection: 'komu_bwlreactions' })
export class Reaction {
  @Prop()
  id: number;

  @Prop()
  channelId: string;

  @Prop()
  guildId: string;

  @Prop()
  messageId: string;

  @Prop()
  authorId: string;

  @Prop()
  emoji: string;

  @Prop()
  count: number;

  @Prop()
  createdTimestamp: number;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
