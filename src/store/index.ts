import Vue from 'vue'
import Vuex from 'vuex'

import user, { UserState } from './modules/user'
import student, { StudentState } from './modules/student'

Vue.use(Vuex)

export interface RootState {
  user: UserState,
  student: StudentState
}

export default new Vuex.Store({
  modules: {
    user,
    student
  }
})

