import { createRouter, createWebHistory } from 'vue-router'
import DefaultVue from '@/views/DefaultVue.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DefaultVue
    },
  ]
})

export default router
