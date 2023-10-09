import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Event } from '../domain/event';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

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

  private buildEventUrl(eventId: string): string {
    const appLink = this.configService.get('telegramMiniAppLink');
    return `https://${appLink}?startapp=event-${eventId}`;
  }

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
      //.replace(/([+()\[\]!*.\\=-])/g, '\\$1')
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

    const response = await firstValueFrom(
      this.httpService.post(url, body).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response?.status);
          console.log(JSON.stringify(error.response?.data, null, 2));
          throw 'An error happened!';
        }),
      ),
    );

    console.log(JSON.stringify(response?.data, null, 2));
  }
}
