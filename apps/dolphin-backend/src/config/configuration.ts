import * as process from 'process';

export default () => ({
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? 'secret',
  telegramMiniAppLink: process.env.TELEGRAM_MINI_APP_LINK,
  telegramTestEnvironment: process.env.TELEGRAM_TEST_ENVIRONMENT === 'true',
  miniAppUrl: process.env.MINI_APP_URL ?? 'https://dolphin.dmku.local',
});
