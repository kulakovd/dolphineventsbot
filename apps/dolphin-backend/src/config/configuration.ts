import * as process from 'process';

export default () => ({
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? 'secret',
  telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME,
  telegramMiniAppIdentifier: process.env.TELEGRAM_MINI_APP_IDENTIFIER,
  telegramTestEnvironment: process.env.TELEGRAM_TEST_ENVIRONMENT === 'true',
});
