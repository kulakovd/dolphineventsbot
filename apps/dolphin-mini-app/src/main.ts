import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { createApi } from '@/api/apiClient'

import { addIcons, OhVueIcon } from 'oh-vue-icons'
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiExternalLinkFill,
  RiTimeFill,
  RiMapPin2Fill
} from 'oh-vue-icons/icons/ri'

addIcons(RiCheckboxCircleFill, RiErrorWarningFill, RiExternalLinkFill, RiTimeFill, RiMapPin2Fill)

const telegram = (window as unknown as { Telegram: { WebApp: TelegramWebApp } }).Telegram.WebApp

const app = createApp(App)

app.component('Icon', OhVueIcon)

// provide the ApiClient and TelegramWebApp instances to the app, so they can be injected into stores and components.
app.provide('api', createApi().client)
app.provide('telegram', telegram)

app.use(createPinia())

// Connect the BackButton to the router.
telegram.BackButton.onClick(() => {
  router.back()
})

router.isReady().then(() => {
  // Update the BackButton state when the route changes.
  router.afterEach(() => {
    // Thanks to vue-router, we can use history.state.back to determine if the current page is the first page.
    if (history.state.back != null) {
      telegram.BackButton.show()
    } else {
      telegram.BackButton.hide()
    }
  })

  // Take the startParam from the URL and redirect to the event page. The startParam is passed from the Telegram app.
  const startParam = new URL(location.href).searchParams.get('tgWebAppStartParam')
  // If startParam starts with 'event-', we show the event page.
  if (startParam?.includes('event-')) {
    router.replace(`/event/${startParam.slice('event-'.length)}`)
  }
})

app.use(router)

app.mount('#app')
