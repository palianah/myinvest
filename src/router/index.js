import Vue from 'vue'
import VueRouter from 'vue-router'
import LandingPage from '@/views/LandingPage'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Dashboard from '@/views/Dashboard'
import ChartView from '@/views/ChartView'
import Examples from '@/views/Examples'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingPage,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next({ name: 'dashboard' })
        return
      }
      next()
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next({ name: 'home' })
        return
      }
      next()
    },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next({ name: 'home' })
        return
      }
      next()
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('token')) {
        next({ name: 'home' })
        return
      }
      next()
    },
  },
  {
    path: '/chart-view',
    name: 'chart-view',
    component: ChartView,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('token')) {
        next({ name: 'home' })
        return
      }
      next()
    },
  },
  {
    path: '/examples',
    name: 'examples',
    component: Examples,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('token')) {
        next({ name: 'home' })
        return
      }
      next()
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
