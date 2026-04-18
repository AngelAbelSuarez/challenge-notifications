import { ChannelType } from '../enums/channel-type.enum';

export interface SendResult {
  success: boolean;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationProvider {
  readonly channel: ChannelType;
  validateRecipient(recipient: string): boolean;
  formatContent(content: string): string;
  send(recipient: string, content: string): Promise<SendResult>;
}