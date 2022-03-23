import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from './reaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
  ],

  exports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
  ],
})
export class ReactionModule {}
