import Vue from 'vue'
import VueRouter from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Registration from '../views/Registration.vue'
import Dashboard from '../views/Dashboard.vue'
import Food from '../views/Food.vue'
import Diagram from '../views/Diagram.vue'
import Data from '../views/Data.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/foodList',
    name: 'Food',
    component: Food
  },
  {
    path: '/diagrams',
    name: 'Diagram',
    component: Diagram
  },
  {
    path: '/data',
    name: 'Data',
    component: Data
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
