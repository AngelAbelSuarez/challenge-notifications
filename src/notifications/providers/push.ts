import { Injectable } from "@nestjs/common";
import { NotificationProvider, SendResult } from "../interfaces/notification-provider.interface";
import { ChannelType } from "../enums/channel-type.enum";

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
                message: 'Invalid phone number format'
            }
        }

        const formattedContent = this.formatContent(content);

        console.log(`[SMS] Sending to: ${recipient}`);
        console.log(`[SMS] Content length: ${formattedContent.length} characters`);
        console.log(`[SMS] Sending...`);

        return {
            success: true,
            message: 'SMS sent successfully',
            metadata: {
                recipient,
                templat: formattedContent,
                sentAt: new Date()
            }
        }
    }

}