<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useEventStore } from '@/stores/event'
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { injectTelegram } from '@/stores/utils/injectTelegram'
import { datesString } from '@/datesString'
import TgMainButton from '@/components/TgMainButton.vue'

const route = useRoute()
const telegram = injectTelegram()

const { id } = route.params as { id: string }

const eventStore = useEventStore()

onMounted(() => {
  eventStore.fetchEvent(id)
})

const { event, showOrganizer, organizerName, isLoading } = storeToRefs(eventStore)

const dates = computed(() =>
  event.value ? datesString(event.value.startDate, event.value.endDate) : null
)

const navigateToOrganizer = () => {
  const username = event.value?.organizer?.telegramUsername
  if (username == null) return
  telegram.openTelegramLink(`https://t.me/${username}`)
}

const openLink = () => {
  const link = event.value?.link
  if (link == null) return
  if (link.startsWith('https://t.me')) {
    telegram.openTelegramLink(link)
  } else {
    telegram.openLink(link)
  }
}
</script>

<template>
  <div class="event">
    <div class="event-content">
      <h1 class="h">{{ event?.title }}</h1>
      <div class="dates event-attr">
        <Icon name="ri-time-fill" />
        {{ dates }}
      </div>
      <div role="button" class="organizer" v-if="showOrganizer" @click="navigateToOrganizer">
        <img class="avatar" :src="event?.organizer?.photoUrl" alt="avatar" />
        <div>
          <span>{{ organizerName }}</span>
        </div>
      </div>
      <div v-if="event?.link != null" class="event-attr" role="button" @click="openLink">
        <Icon name="ri-external-link-fill" />
        <span>{{ event?.link }}</span>
      </div>
      <div v-if="event?.location != null" class="event-attr">
        <Icon name="ri-map-pin-2-fill" />
        <span>{{ event?.location }}</span>
      </div>
      <div>
        {{ event?.description }}
      </div>
    </div>
    <div v-if="event?.participantsLimitExceeded && !event?.joined" class="participation-info">
      <div class="participation-info-message">
        <Icon name="ri-error-warning-fill" />
        <span>Participants limit exceeded</span>
      </div>
    </div>
    <div v-if="event?.joined" class="participation-info">
      <div class="participation-info-message">
        <Icon name="ri-checkbox-circle-fill" />
        <span>You joined this event</span>
      </div>
      <button class="cancel" @click="eventStore.cancelParticipation">cancel</button>
    </div>
    <TgMainButton
      v-if="event != null && !event?.participantsLimitExceeded && !event?.joined"
      :showLoading="isLoading"
      @click="eventStore.participate"
      text="Join"
    />
  </div>
</template>

<style scoped>
.event {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.event-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.h {
  font-size: 1.2em;
  font-weight: 600;
}

.organizer {
  cursor: pointer;
  display: flex;
  gap: 24px;
  padding: 8px;
  background: var(--color-background-secondary);
  border-radius: 8px;
}

.organizer:active {
  transform: scale(0.98);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: block;
}

.event-attr {
  display: flex;
  gap: 8px;
  align-items: center;
}

.event-attr[role='button'] {
  cursor: pointer;
}

.event-attr[role='button']:active {
  transform: scale(0.98);
}

.cancel {
  background: none;
  border: none;
  font-size: 1em;
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
}

.participation-info-message {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.participation-info {
  position: sticky;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  bottom: 0;
  padding: 8px 16px;
  background: var(--color-background-secondary);
  font-size: 1em;
  text-align: center;
}
</style>
