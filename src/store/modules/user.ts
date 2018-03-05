import { Getter, GetterTree, MutationTree } from 'vuex'
import { UPDATE_USER_ROLE, UPDATE_USERNAME } from '../mutation-types'


interface UserState {
  userRole: string,
  username: string
}

interface UserGetters {
  getUserRole: Getter<UserState, null>,
  getUsername: Getter<UserState, null>,
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
  [UPDATE_USER_ROLE] (state: UserState, { userRole }: { userRole: string }) {
    state.userRole = userRole
  },
  [UPDATE_USERNAME] (state: UserState, { username }: { username: string }) {
    state.username = username
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}


