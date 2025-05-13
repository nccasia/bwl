/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChannelDocument = Channel & Document;

@Schema({ collection: 'komu_bwlChannels' })
export class Channel {
    @Prop()
    id: string;
    @Prop()
    name: string;
    @Prop()
    title?: string | null;
    @Prop()
    type?: number | null;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
