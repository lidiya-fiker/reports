import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackService {
  private slackClient: WebClient;

  constructor() {
    this.slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  async sendMessage(channel: string, message: string): Promise<void> {
    try {
      await this.slackClient.chat.postMessage({
        channel,
        text: message,
      });
    } catch (error) {
      throw new Error('Failed to send message to Slack.');
    }
  }
}
