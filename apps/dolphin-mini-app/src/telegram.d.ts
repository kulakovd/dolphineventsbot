/**
 * Types for Telegram Web App.
 * This interface describes the API of the Telegram Web App partially including only the methods that are used in the app.
 * See full API here: https://core.telegram.org/bots/webapps#initializing-mini-apps
 */
interface TelegramWebApp {
  initData: string
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
  }
  MainButton: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    setText: (text: string) => void
    showProgress: () => void
    hideProgress: () => void
  }
  close: () => void
  openLink: (url: string) => void
  openTelegramLink: (url: string) => void
}
