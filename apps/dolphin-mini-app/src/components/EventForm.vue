<script setup lang="ts">
import TgMainButton from '@/components/TgMainButton.vue'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import CustomInput from '@/components/CustomInput.vue'
import { useEventFormStore } from '@/stores/eventForm'

const eventFormStore = useEventFormStore()
const {
  title,
  description,
  startDate,
  startTime,
  endDate,
  endTime,
  link,
  location,
  maxParticipants,
  isLoading
} = storeToRefs(eventFormStore)

const props = defineProps<{
  eventId?: string
}>()

onMounted(() => {
  eventFormStore.init(props.eventId)
})
</script>

<template>
  <div class="editor">
    <form class="form" @submit.prevent="">
      <label class="label">
        <span>Title</span>
        <CustomInput v-model="title.value" :invalid="title.invalid" />
      </label>
      <label class="label">
        <span>Description</span>
        <CustomInput textarea rows="4" v-model="description.value" :invalid="description.invalid" />
      </label>
      <label class="label">
        <span>Date and time</span>
        <span class="date">
          <CustomInput type="date" v-model="startDate.value" :invalid="startDate.invalid" />
          <CustomInput type="time" v-model="startTime.value" :invalid="startTime.invalid" />
        </span>
        <span class="date">
          <CustomInput type="date" v-model="endDate.value" :invalid="endDate.invalid" />
          <CustomInput type="time" v-model="endTime.value" :invalid="endTime.invalid" />
        </span>
      </label>
      <label class="label">
        <span>Link</span>
        <CustomInput v-model="link.value" :invalid="link.invalid" />
      </label>
      <label class="label">
        <span>Location</span>
        <CustomInput v-model="location.value" :invalid="location.invalid" />
      </label>
      <label class="label">
        <span>Participants limit</span>
        <CustomInput
          v-model="maxParticipants.value"
          :invalid="maxParticipants.invalid"
          type="number"
        />
      </label>
    </form>
    <TgMainButton text="Save and attach" :showLoading="isLoading" @click="eventFormStore.submit" />
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.editor {
  padding: 16px;
}

.label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label span {
  font-weight: 500;
}

.date {
  display: flex;
  gap: 8px;
}
</style>
