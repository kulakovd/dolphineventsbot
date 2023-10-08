import { defineStore } from 'pinia'
import { ref } from 'vue'
import { injectTelegram } from '@/stores/utils/injectTelegram'

export const useAuthStore = defineStore('auth', () => {
  const telegram = injectTelegram()
  const isAuthorized = ref(false)

  async function authWithTelegram() {
    const data = telegram.initData

    const response = await fetch('/api/auth/telegram', {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return
    }

    const { token } = (await response.json()) as { token: string }
    sessionStorage.setItem('token', token)
    isAuthorized.value = true
  }

  return {
    authWithTelegram,
    isAuthorized
  }
})
