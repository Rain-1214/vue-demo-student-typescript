import Vue, { Component } from 'vue'
import Router from 'vue-router'
declare const require: any

const LoginComponent = r => require.ensure([], () => r(require('../components/login/Login.vue')), 'login')
const RegisterComponent = r => require.ensure([], () => r(require('../components/register/Register.vue')), 'register')
const ForgetPassComponent = r => require.ensure([], () => r(require('../components/forgetPass/ForgetPass.vue')), 'forgetPass')
const StudentComponent = r => require.ensure([], () => r(require('../components/student/Student.vue')), 'student')
const UserComponent = r => require.ensure([], () => r(require('../components/user/User.vue')), 'user')

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
      path: '/forgetPass',
      component: ForgetPassComponent
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
      path: '/user',
      component: UserComponent
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
