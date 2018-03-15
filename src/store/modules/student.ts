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
  async getgradeArray (state) {
    if (state.gradeArray.length === 0) {
      const grades = await StudentService.getGrade()
      if (grades) {
        state.gradeArray = grades
      }
    }
    return state.gradeArray
  },
  getGradeNameClassNameByGidCid (state, getters) {
    return async (gradeId: number, classId: number) => {
      if (state.gradeArray.length === 0) {
        await getters.getgradeArray()
      }
      let result = ''
      state.gradeArray.forEach(e => {
        if (e.id === gradeId) {
          result += e.gradeName
          e.classes.forEach((item) => {
            if (item.id === classId) {
              result += item.className
            }
          })
        }
      })
      return result
    }
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
