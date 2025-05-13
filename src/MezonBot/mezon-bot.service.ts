import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChannelMessage, MezonClient } from 'mezon-sdk';
import { Model } from 'mongoose';
import { AuthService } from 'src/Authentication/auth.service';
import { AppService } from '../app.service';
import { Channel, ChannelDocument } from '../Channel/channel.schema';
@Injectable()
export class MezonBotService {
  private _mezonClient: MezonClient;

  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    @InjectModel(Channel.name)
    private readonly channelModel: Model<ChannelDocument>,
  ) {
    this._mezonClient = new MezonClient(process.env.MEZON_BOT_TOKEN);
    this._mezonClient.login().then(() => {
      console.log('Mezon bot is ready!');
    });
    this._mezonClient.onChannelMessage(this.listenChanelMessages);
  }

  public listenChanelMessages = async (event: ChannelMessage) => {
    // Handle the channel message event here
    const channel = this._mezonClient.channels.get(event.channel_id);
    if (event.attachments && event.attachments.length > 0) {
      const existsChannel = await this.channelModel.findOne({ id: channel.id });
      const existsAuthor = await this.authService.findUser(event.username);
      if (!existsChannel) {
        const newChannel = new this.channelModel({
          id: channel.id,
          name: channel.name,
          type: channel.channel_type,
          title: channel?.category_name,
        });
        await newChannel.save();
      }
      if (!existsAuthor) {
        await this.authService.saveUser(
          event.username,
          event.username,
          event.avatar,
          event.display_name,
          true,
        );
      }
      const imageAttachments = event.attachments.filter(
        (attachment) =>
          attachment.filetype === 'image/png' ||
          attachment.filetype === 'image/jpeg' ||
          attachment.filetype === 'image/gif',
      );
      const imageLinks = imageAttachments.map((attachment) => attachment.url);
      if (imageLinks.length > 0) {
        await this.appService.addPost(
          event.username,
          imageLinks,
          event.channel_id,
          true,
        );
      }
    }
  };
}
