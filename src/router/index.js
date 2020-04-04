import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Dashboard from '@/views/Dashboard'
import ChartView from '@/views/ChartView'
import Examples from '@/views/Examples'
// import LandingPage from '@/views/LandingPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next({ name: 'dashboard', params: { lang: 'en' } })
        return
      } else {
        next({ name: 'login', params: { lang: 'en' } })
      }
    },
  },
  {
    path: '/:lang',
    name: 'home',
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next({ name: 'dashboard' })
        return
      } else {
        next({ name: 'login', params: { lang: 'en' } })
      }
    },
  },
  {
    path: '/:lang/login',
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
    path: '/:lang/register',
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
    path: '/:lang/dashboard',
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
    path: '/:lang/chart-view',
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
    path: '/:lang/examples',
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
