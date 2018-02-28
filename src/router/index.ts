import Vue, { Component } from 'vue'
import Router, { RouterOptions, Route } from 'vue-router'

import LoginComponent from '../components/login/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: LoginComponent
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
