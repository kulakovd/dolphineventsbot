import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Event } from '../domain/event';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

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

@Injectable()
export class BotService {
  private logger = new Logger(BotService.name);

  private readonly apiBase: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const token = configService.get('telegramBotToken');
    const isTest = configService.get('telegramTestEnvironment');
    this.apiBase = `https://api.telegram.org/bot${token}/${
      isTest ? 'test/' : ''
    }`;
  }

  /**
   * Creates a link to the event in the Telegram mini app.
   * @param eventId
   * @private
   */
  private buildEventUrl(eventId: string): string {
    const appLink = this.configService.get('telegramMiniAppLink');
    return `https://${appLink}?startapp=event-${eventId}`;
  }

  /**
   * Sends a message to the chat which app is opened from.
   * @param queryId
   * @param event
   * @param lang
   */
  async answerWebAppQuery(queryId: string, event: Event, lang: string) {
    const url = `${this.apiBase}answerWebAppQuery`;
    const appLink = this.buildEventUrl(event.id);

    const dates = `${formatDate(event.startDate, lang)} — ${formatDate(
      event.endDate,
      lang,
    )}`;

    const message = `
      *${escapeMarkdown(event.title)}*
      
      ${escapeMarkdown(dates)}
      
      ${escapeMarkdown(event.description)}${
        event.description ? '\n\n' : ''
      }[Show event](${appLink})
    `
      .replace(/ {2,}/g, '')
      .trim();

    const body = {
      web_app_query_id: queryId,
      result: {
        type: 'article',
        id: event.id,
        title: event.title,
        input_message_content: {
          message_text: message,
          parse_mode: 'MarkdownV2',
        },
        reply_markup: {
          // Inline keyboard with a single button that opens the event in the app.
          inline_keyboard: [
            [
              {
                text: 'Show event',
                url: appLink,
              },
            ],
          ],
        },
      },
    };

    await firstValueFrom(
      this.httpService.post(url, body).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.toJSON());
          throw new Error('An error happened during sending a message');
        }),
      ),
    );
  }
}
