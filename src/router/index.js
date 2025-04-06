import Vue from 'vue'
import VueRouter from 'vue-router'
import HeroView from '@/views/HeroesView.vue'
import OranisationView from '@/views/OrgsView.vue'
import TeamsView from '@/views/TeamsView.vue'
import HomeView from "@/views/HomeView.vue";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/heroes',
    name: 'hero',
    component: HeroView
  },
  {
    path: '/teams',
    name: 'teams',
    component: TeamsView
  },

  {
    path: '/orgs',
    name: 'organisations',
    component: OranisationView
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
