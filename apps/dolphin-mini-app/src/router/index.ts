import DefaultVue from '@/views/DefaultView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DefaultVue
    },
    {
      path: '/attach',
      name: 'attach',
      component: () => import('@/views/AttachView.vue')
    },
    {
      path: '/attach/new',
      name: 'attach-new',
      component: () => import('@/views/AttachNewEventView.vue')
    },
    {
      path: '/attach/:id',
      name: 'attach-event',
      component: () => import('@/views/AttachEventView.vue')
    }
  ]
})

export default router
