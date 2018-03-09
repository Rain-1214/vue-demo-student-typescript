import { Student } from '../../entity/student'
import { Grade } from '../../entity/grade'
import { ClassNum } from '../../entity/class'
import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex'
import { Types } from '../mutation-types'
import { StudentService } from '../../api/studentService'
import { RootState } from '..'

export interface StudentState {
  gradeArray: Grade[],
}

const state: StudentState = {
  gradeArray: []
}

const getters: GetterTree<StudentState, RootState> = {
  getgradeArray: async (state) => {
    if (state.gradeArray.length === 0) {
      const grades = await StudentService.getGrade()
      if (grades) {
        state.gradeArray = grades
      }
    }
    return state.gradeArray
  }
}

const actions: ActionTree<StudentState, RootState> = {

}

const mutations: MutationTree<StudentState> = {
  [Types.UPDATE_GRADEARRAY] (state, { grades }: { grades: Grade[] }) {
    state.gradeArray = grades
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
