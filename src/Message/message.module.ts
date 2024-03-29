/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],

  exports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
})
export class MessageModule {}
