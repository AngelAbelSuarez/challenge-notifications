import { Injectable } from '@nestjs/common';
import { ChannelType } from '../enums/channel-type.enum';
import { NotificationProvider } from '../interfaces/notification-provider.interface';
import { EmailProvider } from './email.provider';
import { SmsProvider } from './sms.provider';
import { PushProvider } from './push.provider';

@Injectable()
export class NotificationProviderFactory {
  private readonly providers = new Map<ChannelType, NotificationProvider>();

  //Factory/map
  constructor(
    private readonly emailProvider: EmailProvider,
    private readonly smsProvider: SmsProvider,
    private readonly pushProvider: PushProvider,
  ) {
    this.providers.set(ChannelType.EMAIL, this.emailProvider);
    this.providers.set(ChannelType.SMS, this.smsProvider);
    this.providers.set(ChannelType.PUSH, this.pushProvider);
  }

  getProvider(channel: ChannelType): NotificationProvider {
    const provider = this.providers.get(channel);
    if (!provider) {
      throw new Error(`Channel ${channel} not supported`);
    }
    return provider;
  }
}
