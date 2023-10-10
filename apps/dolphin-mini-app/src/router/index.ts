import DefaultVue from '@/views/DefaultView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultVue
    },
    {
      path: '/attach',
      component: () => import('@/views/AttachView.vue')
    },
    {
      path: '/edit/:eventId',
      component: () => import('@/views/EditEventView.vue'),
      props: route => ({ eventId: route.params.eventId })
    },
    {
      path: '/attach/:eventId',
      component: () => import('@/views/EditEventView.vue'),
      props: route => ({ eventId: route.params.eventId, attach: true })
    },
    {
      path: '/event/:id',
      component: () => import('@/views/EventView.vue')
    }
  ]
})

export default router
