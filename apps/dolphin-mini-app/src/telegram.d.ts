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
