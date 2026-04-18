import { Injectable } from "@nestjs/common";
import { NotificationProvider, SendResult } from "../interfaces/notification-provider.interface";
import { ChannelType } from "../enums/channel-type.enum";
import { isPhoneNumber } from "class-validator";


@Injectable()
export class SmsProvider implements NotificationProvider {

    public readonly channel: ChannelType.SMS;
    private readonly MAX_SMS_LENGTH = 160;

    validateRecipient(recipient: string): boolean {
        return isPhoneNumber(recipient);
    }

    formatContent(content: string): string {
        if (content.length > this.MAX_SMS_LENGTH) {
            return content.substring(0, this.MAX_SMS_LENGTH ) + '...';
        }
        return content;
    }

    async send(recipient: string, content: string): Promise<SendResult> {
        if (!this.validateRecipient(recipient)) {
            return {
                success: false,
                message: 'Invalid device token'
            }
        }

        const payload = this.formatContent(content)

        console.log(`[PUSH] Sending to: ${recipient}`);
        console.log(`[PUSH] Payload: ${payload}`);
        console.log(`[PUSH] Sending...`);

        return {
            success: true,
            message: 'Push notification sent successfully',
            metadata: {
                recipient,
                payload: JSON.stringify(payload),
                sentAt: new Date()
            }             
        }
    }

}