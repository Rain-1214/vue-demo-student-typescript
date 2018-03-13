// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'

import './iview.config'

import 'iview/dist/styles/iview.css'
import './assets/sass/common.scss'

Vue.config.productionTip = false

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
