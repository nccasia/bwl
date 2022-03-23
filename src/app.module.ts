import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Authentication/auth.module';
import { KomuUsersModule } from './Komu_users/komu_users.module';
import { ReactionModule } from './Reaction/reaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/bwl'),
    AuthModule,
    KomuUsersModule,
    ReactionModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
