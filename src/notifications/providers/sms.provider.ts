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