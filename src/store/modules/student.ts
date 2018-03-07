import { Student } from '../../entity/student'
import { Grade } from '../../entity/grade'
import { ClassNum } from '../../entity/class'
import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex'
import { Types } from '../mutation-types'
import { StudentService } from '../../api/studentService'

interface StudentState {
  gradeArray: Grade[],
}

const state: StudentState = {
  gradeArray: []
}

const getters: GetterTree<StudentState, null> = {
  getgradeArray: (state) => {
    if (!state.gradeArray) {
      
    }
  }
}

const actions: ActionTree<StudentState, null> = {
  async getGradeArrayFromServer (context) {
    const grades = await StudentService.getGrade()
    if (grades) {
      context.commit(Types.UPDATE_GRADEARRAY, { grades })
    }
  }
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
