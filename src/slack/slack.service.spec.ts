import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackService {
  private readonly slackClient: WebClient;
  constructor() {
    this.slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
  }
  async sendMessage(channel: string, message: string): Promise<void> {
    try {
      await this.slackClient.chat.postMessage({
        channel,
        text: message,
      });
      console.log('message send to slack successfully');
    } catch (error) {
      console.error('error details:', error.data || error);
      throw new Error('faild to send message to slack');
    }
  }
}
