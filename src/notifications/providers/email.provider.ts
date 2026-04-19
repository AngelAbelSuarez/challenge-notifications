import { Injectable } from '@nestjs/common';
import {
  NotificationProvider,
  SendResult,
} from '../interfaces/notification-provider.interface';
import { ChannelType } from '../enums/channel-type.enum';
import { isEmail } from 'class-validator';

@Injectable()
export class EmailProvider implements NotificationProvider {
  public readonly channel: ChannelType.EMAIL;

  validateRecipient(recipient: string): boolean {
    return isEmail(recipient);
  }

  formatContent(content: string): string {
    return `
            <html>
                <body>
                    <h2>Notificación</h2>
                    <p>${content}</p>
                </body>
            </html>
        `;
  }

  async send(recipient: string, content: string): Promise<SendResult> {
    if (!this.validateRecipient(recipient)) {
      return {
        success: false,
        message: 'Invalid email format',
      };
    }

    const formattedContent = this.formatContent(content);

    console.log(`[EMAIL] Sending to: ${recipient}`);
    console.log(`[EMAIL] Template generated`);
    console.log(`[EMAIL] Sending...`);

    return {
      success: true,
      message: 'Email sent successfully',
      metadata: {
        recipient,
        template: formattedContent,
        sentAt: new Date(),
      },
    };
  }
}
