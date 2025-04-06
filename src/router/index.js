import Vue from 'vue'
import VueRouter from 'vue-router'
import HeroView from '@/views/HeroesView.vue'
import OrganisationView from '@/views/OrgsView.vue'
import TeamsView from '@/views/TeamsView.vue'
import HomeView from "@/views/HomeView.vue";
import orgsTeamsView from "@/views/OrgsTeamsView.vue";

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
    component: OrganisationView
  },
  {
    path: '/orgs/:orgId/teams',
    name: 'OrgTeams',
    component: orgsTeamsView,
    meta: { requiresAuth: true }
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
