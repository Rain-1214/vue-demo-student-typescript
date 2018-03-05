import Vue, { Component } from 'vue'
import Router from 'vue-router'

const LoginComponent = () => import('../components/login/Login.vue')
const RegisterComponent = () => import('../components/register/Register.vue')
const StudentComponent = () => import('../components/student/Student.vue')

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
      path: '/register',
      component: RegisterComponent
    },
    {
      path: '/student',
      component: StudentComponent
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
