import { Body, Controller, Post } from '@nestjs/common';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}
  @Post('send')
  async sendMessage(
    @Body('channel') channel: string,
    @Body('message') message: string,
  ): Promise<string> {
    await this.slackService.sendMessage(channel, message);
    return 'message send to slack';
  }
}
