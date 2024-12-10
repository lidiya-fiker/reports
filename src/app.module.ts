import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseModule } from './response/response.module';
import { AppDataSource } from 'db/data-source';
import { SlackModule } from './slack/slack.module';
import { SlackService } from './slack/slack.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    QuestionModule,
    ResponseModule,
    SlackModule,
  ],
  providers: [SlackService],
})
export class AppModule {}
