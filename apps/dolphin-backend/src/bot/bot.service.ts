import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Event } from '../domain/event';
import { Telegraf } from 'telegraf';
import { EventService } from '../event/event.service';
import { InlineQueryResultArticle } from '@telegraf/types/inline';
import { UserService } from '../user/user.service';
import type { User as ContextUser } from '@telegraf/types/manage';
import { FmtString } from 'telegraf/format';

/**
 * Escapes the special characters in the text so that it can be used in a Markdown message.
 * @param text
 */
function escapeMarkdown(text?: string): string {
  return text?.replace(/([+()\[\]!*.\\=-])/g, '\\$1') ?? '';
}

function formatDate(date: Date, lang: string) {
  return new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

function dates(event: Event, lang: string) {
  return `${formatDate(event.startDate, lang)} — ${formatDate(
    event.endDate,
    lang,
  )}`;
}

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  private readonly bot: Telegraf;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {
    const token = configService.get('telegramBotToken');
    const isTest = configService.get('telegramTestEnvironment');

    this.bot = new Telegraf(token, {
      telegram: {
        testEnv: isTest,
      },
    });

    this.launchBot();

    eventService.onAttachEventToChat((queryId, eventId, lang) => {
      this.answerWebAppQuery(queryId, eventId, lang ?? 'en');
    })

    eventService.onParticipantAdded((event, participantId, lang) => {
      this.notifyParticipant(event, participantId, lang ?? 'en');
    })
  }

  private getMiniAppUrl(): string {
    return this.configService.get('miniAppUrl')!;
  }

  private getAppLink(): string {
    return this.configService.get('telegramMiniAppLink')!;
  }

  /**
   * Creates a link to the event in the Telegram mini app.
   * @param eventId
   * @private
   */
  private buildEventUrl(eventId: string): string {
    return `https://${this.getAppLink()}?startapp=event-${eventId}`;
  }

  private async launchBot() {
    this.bot.start((ctx) => {
      ctx.reply(
        {
          entities: [{ type: 'bold', offset: 0, length: 6 }],
          text: 'Hello! I am a bot for managing events. You can use me to create events and share them.\n\nUse button below to menage your events.',
        },
        {
          reply_markup: {
            // On start, we send a button to open the mini app.
            inline_keyboard: [[{ text: 'Manage events', web_app: { url: this.getMiniAppUrl() } }]],
          },
        },
      );
    })

    this.bot.on('inline_query', async (ctx) => {
      const lang = ctx.from.language_code;
      const user = await this.syncUser(ctx.from);

      const searchQuery = ctx.inlineQuery?.query ?? '';

      const events = await this.eventService.findManyByOrganizerIdAndSearch(user.id, searchQuery);
      const mapEvent = (event: Event): InlineQueryResultArticle => this.createInlineEventMessage(event, lang ?? 'en');

      try {
        await ctx.answerInlineQuery(events.map(mapEvent));
      } catch (e) {
        this.logger.error(e);
      }
    });

    this.bot.launch();
  }

  private syncUser(from: ContextUser) {
    return this.userService.syncUserWithTg({
      telegramId: from.id,
      firstName: from.first_name,
      lastName: from.last_name,
      telegramUsername: from.username,
    });
  }

  /**
   * Creates a message for the event when a user wants to share it.
   *
   * @param event
   * @param lang
   * @param prefix
   * @private
   */
  private createEventMessageContent(event: Event, lang: string, prefix?: string) {
    const appLink = this.buildEventUrl(event.id);

    const messagePrefix = prefix ? `${prefix}\n\n` : '';
    const eventDates = dates(event, lang);
    const description = event.description ? `${escapeMarkdown(event.description)}\n\n` : '';
    const location = event.location ? `📍 ${escapeMarkdown(event.location)}\n` : '';
    const link = event.link ? `🔗 [Link](${event.link})\n` : '';
    const locationAndLink = (location || link) ? `${location}${link}\n` : '';

    const message = `
      ${messagePrefix}*${escapeMarkdown(event.title)}*
      
      ${escapeMarkdown(eventDates)}
      
      ${description}${locationAndLink}[Show event](${appLink})
    `
      .replace(/ {2,}/g, '')
      .trim();

    return {
      text: message,
      parse_mode: 'MarkdownV2' as const,
    };
  }

  private createInlineMarkup(eventId: string) {
    const appLink = this.buildEventUrl(eventId);
    return {
      // Inline keyboard with a single button that opens the event in the app.
      inline_keyboard: [[{ text: 'Show event', url: appLink }]],
    };
  }

  private createInlineEventMessage(event: Event, lang: string, prefix?: string): InlineQueryResultArticle {

    const content = this.createEventMessageContent(event, lang, prefix);

    return {
      type: 'article',
      id: event.id,
      title: event.title,
      input_message_content: {
        message_text: content.text,
        parse_mode: content.parse_mode,
      },
      reply_markup: this.createInlineMarkup(event.id),
    };
  }

  /**
   * Sends a message to the chat which app is opened from.
   * @param queryId
   * @param event
   * @param lang
   */
  answerWebAppQuery(queryId: string, event: Event, lang?: string) {
    const message = this.createInlineEventMessage(event, lang ?? 'en');
    this.bot.telegram.answerWebAppQuery(queryId, message);
  }

  /**
   * Sends a message to the participant when he is added to the event.
   */
  async notifyParticipant(event: Event, participantId: string, lang: string) {
    const message = this.createEventMessageContent(event, lang, 'You have been added to the event:');
    const user = await this.userService.findById(participantId);

    if (user == null) {
      return;
    }

    try {
      await this.bot.telegram.sendMessage(
        user.telegramId,
        message as unknown as FmtString,
        {
          reply_markup: this.createInlineMarkup(event.id),
        }
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
