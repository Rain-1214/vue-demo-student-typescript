import { Getter, GetterTree, MutationTree } from 'vuex'
import { Types } from '../mutation-types'
import { User } from '../../entity/User'


interface UserState {
  userRole: string,
  username: string
}

const state: UserState = {
  userRole: '',
  username: ''
}

const getters: GetterTree<UserState, null> = {
  getUserRole: (state) => state.userRole,
  getUsername: (state) => state.username
}

const actions = {

}

const mutations: MutationTree<UserState> = {
  [Types.UPDATE_USER_ROLE] (state: UserState, { userRole }: { userRole: string }) {
    state.userRole = User.translationUserRole(userRole)
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


