import { Getter, GetterTree, MutationTree } from 'vuex'
import { Types } from '../mutation-types'


interface UserState {
  userRole: string,
  username: string
}

const state: UserState = {
  userRole: 'test',
  username: 'testpass'
}


const getters: GetterTree<UserState, null> = {
  getUserRole: (state) => state.userRole,
  getUsername: (state) => state.username
}

const actions = {

}

const mutations: MutationTree<UserState> = {
  [Types.UPDATE_USER_ROLE] (state: UserState, { userRole }: { userRole: string }) {
    state.userRole = userRole
  },
  [Types.UPDATE_USERNAME] (state: UserState, { username }: { username: string }) {
    state.username = username
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}


