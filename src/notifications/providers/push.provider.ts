import { Injectable } from '@nestjs/common';
import {
  NotificationProvider,
  SendResult,
} from '../interfaces/notification-provider.interface';
import { ChannelType } from '../enums/channel-type.enum';

@Injectable()
export class PushProvider implements NotificationProvider {
  public readonly channel: ChannelType.PUSH;

  validateRecipient(recipient: string): boolean {
    return recipient.length >= 32 && /^[a-f0-9]+$/.test(recipient);
  }

  formatContent(content: string): string {
    return JSON.stringify({
      notification: { body: content },
      data: { timestamp: Date.now() },
    });
  }

  async send(recipient: string, content: string): Promise<SendResult> {
    if (!this.validateRecipient(recipient)) {
      return {
        success: false,
        message: 'Invalid device token',
      };
    }

    const payload = this.formatContent(content);

    console.log(`[PUSH] Sending to: ${recipient}`);
    console.log(`[PUSH] Payload: ${payload}`);
    console.log(`[PUSH] Sending...`);

    return {
      success: true,
      message: 'Push notification sent successfully',
      metadata: {
        recipient,
        payload: JSON.stringify(payload),
        sentAt: new Date(),
      },
    };
  }
}
