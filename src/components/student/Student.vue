<template>
  <div id="student">
    <p class="header">
      用户 {{ username }} 身份 {{ userRole }}
      <iv-button type="error" @click="logOut()" size="small">登出</iv-button>
      <iv-button type="default" v-if="userRole === '超级管理员'" size="small"><router-link to="/user">管理用户</router-link></iv-button>
      <iv-button type="primary" size="small" @click="leaveUp()">提升权限</iv-button>
    </p>
    <iv-row class="set-tb-padding" :gutter="15">
      <iv-col span="12">
        <grade-select
          :col="12"
          @select-grade-id="receiveGid($event)" @select-class-id="receiveCid($event)"></grade-select>
      </iv-col>
      <iv-col span="12">
        <iv-button type="primary" @click="getStudentByGidCid()">查找</iv-button>
        <iv-button type="error" @click="deleteFlag = true" v-show="!deleteFlag">勾选删除</iv-button>
        <iv-button type="primary" @click="deleteFlag = false" v-show="deleteFlag">取消勾选删除</iv-button>
        <iv-button type="error" @click="deleteConfirm = true" v-show="deleteFlag">删除</iv-button>
      </iv-col>
    </iv-row>
    <iv-row class="set-tb-padding" :gutter="15">
      <iv-col span="8"
        v-for="(v) in students" :key="v.id">
        <student-wrapper :student="v" :selectVisible='deleteFlag'
          @emit-student-id="receiveDeleteId($event)"></student-wrapper>
      </iv-col>
    </iv-row>
    <iv-row class="set-tb-padding">
      <iv-col span="16">
        <iv-button type="success" @click="addEmptyStudent()">添加学生</iv-button>
        <template v-if="addStudents.length !== 0">
          <iv-button type="primary" @click="addFlag = true" v-show="!addFlag">勾选添加</iv-button>
          <iv-button type="primary" @click="addFlag = false" v-show="addFlag">取消勾选添加</iv-button>
          <iv-button type="success" @click="addSelectStudent()" v-show="addFlag">提交勾选的学生</iv-button>
          <iv-button type="error" @click="deleteAllAddStudent()">删除所有要添加的学生</iv-button>
        </template>
      </iv-col>
      <iv-col class="text-right" span="8">
        <iv-page :total="studentCountNum" :page-size="6" @on-change="currentPageChange($event)"></iv-page>
      </iv-col>
    </iv-row>
    <iv-row class="set-tb-padding" :gutter="15" v-if="addStudents.lenght !== 0">
      <iv-col span="8"
        v-for="(v, i) in addStudents" :key="i">
        <student-wrapper :student.sync="v" :selectVisible='addFlag' :model="'add'" :arrayIndex='i'
          @emit-add-student="receiveAddStudent($event)"
          @emit-student-id="receiveSelectAddStu($event)"
          @delete-add-student="deleteAddStu($event)"
          @add-single-student="addSingleStudent($event)"></student-wrapper>
      </iv-col>
    </iv-row>
    <div>
      {{addStudents}}
    </div>
    <iv-modal title="确认删除" v-model="deleteConfirm" @on-ok="deleteStudent()">
      是否确认删除所勾选的所有人
    </iv-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { Grade } from '../../entity/grade'
import { StudentService } from '../../api/studentService'
import { Student } from '../../entity/student'
import { Message } from 'iview'
import { ToolBase } from '../../tool/ToolBase'
import { Route } from 'vue-router'
import { UserService } from '../../api/userService'
import { Types } from '../../store/mutation-types'
import store from '../../store/'
import GradeSelectComponent from './children/GradeSelect.vue'
import StudentWrapperComponent, { AddStuMessage, SelectStuMessage } from './children/studentWrapper.vue'

@Component({
  components: {
    'grade-select': GradeSelectComponent,
    'student-wrapper': StudentWrapperComponent
  },
  beforeRouteEnter (to: Route, from: Route, next: (path?: string) => void) {
    if (store.state.user.username === '') {
      next('/login')
    }
    next()
  }
})
export default class StudentComponent extends Vue {
  name = 'student'

  students: Student[] = []
  studentCountNum: number = null

  gradeArray: Grade[] = []

  currentGradeId: number = null
  currentClassId: number = null

  deleteFlag = false
  deleteConfirm = false
  deleteStuIds: Set<number> = new Set()

  addFlag = false
  addConfirm = false
  addStudents: Student[] = []
  selectedAddStudent: Map<number, Student> = new Map()

  privateCurrentPage = 1
  get currentPage () {
    return this.privateCurrentPage
  }

  set currentPage (page: number) {
    this.privateCurrentPage = page
    this.loadStudent()
  }

  @Getter('getUsername') username
  @Getter('getUserRole') userRole
  @Getter('getgradeArray') getGradeArray
  @Mutation(Types.UPDATE_USER_ROLE) updateUserRole

  async created () {
    this.gradeArray = await this.getGradeArray
    await this.loadStudent()
  }

  mounted () {
  }

  receiveGid (id: number) {
    this.currentGradeId = id
  }

  receiveCid (id: number) {
    this.currentClassId = id
  }

  receiveDeleteId (deleteStuMessage: SelectStuMessage) {
    if (deleteStuMessage.flag) {
      this.deleteStuIds.add(deleteStuMessage.studentId)
    } else {
      this.deleteStuIds.delete(deleteStuMessage.studentId)
    }
  }

  async loadStudent () {
    if (this.currentPage) {
      const res = await StudentService.getStudent(this.currentPage)
      if (res) {
        this.students = res.students
        this.studentCountNum = res.countNum
      }
    } else {
      await this.getStudentByGidCid()
    }
  }

  async getStudentByGidCid () {
    if (this.currentGradeId && this.currentClassId) {
      const res = await StudentService.getStuByGidCid(this.currentGradeId, this.currentClassId)
      // eslint-disable-next-line
      this.students = res ? res : this.students
    } else {
      Message.info({
        content: '必须选好班级才能提交'
      })
    }
  }

  currentPageChange (pageNumber: number) {
    this.currentPage = pageNumber
  }

  async deleteStudent () {
    if (this.deleteStuIds.size <= 0) {
      Message.warning({
        content: '没有选择任何人'
      })
      return
    }
    const ids = Array.from(this.deleteStuIds)
    const res = await StudentService.deleteStudent(ids)
    if (res) {
      Message.success({
        content: '删除成功'
      })
      await this.loadStudent()
    }
  }

  addEmptyStudent () {
    if (this.currentGradeId && this.currentClassId) {
      this.addStudents.push(new Student(null, null, null, null, this.currentClassId, this.currentGradeId))
    } else {
      this.addStudents.push(new Student())
    }
  }

  receiveAddStudent (addStuMessage: AddStuMessage) {
    Object.assign(this.addStudents[addStuMessage.index], addStuMessage.student)
  }

  receiveSelectAddStu (selectStuMessage: SelectStuMessage) {
    if (selectStuMessage.flag) {
      this.selectedAddStudent.set(selectStuMessage.index, this.addStudents[selectStuMessage.index])
    } else {
      this.selectedAddStudent.delete(selectStuMessage.index)
    }
  }

  deleteAddStu (arrayIndex: number) {
    if (this.selectedAddStudent.has(arrayIndex)) {
      this.selectedAddStudent.delete(arrayIndex)
    }
    this.addStudents.splice(arrayIndex, 1)
  }

  deleteAllAddStudent () {
    this.selectedAddStudent.clear()
    this.addStudents.splice(0)
  }

  async addSelectStudent () {
    const students = Array.from(this.selectedAddStudent.values())
    const res = await this.addStudent(students)
    if (res) {
      const indexs = Array.from(this.selectedAddStudent.keys()).sort((a, b) => b - a)
      indexs.forEach(e => this.addStudents.splice(e, 1))
    }
  }

  async addSingleStudent (arrayIndex: number) {
    const students = [this.addStudents[arrayIndex]]
    const res = await this.addStudent(students)
    if (res) {
      if (this.selectedAddStudent.has(arrayIndex)) this.selectedAddStudent.delete(arrayIndex)
      this.addStudents.splice(arrayIndex, 1)
    }
  }

  async addStudent (students: Student[]): Promise<boolean> {
    if (students.length === 0) {
      Message.warning({
        content: '没有选择任何人'
      })
      return
    }
    if (!ToolBase.checkEmptyProperty(students, ['name', 'sex', 'studentNumber', 'gradeId', 'classId'])) {
      Message.warning({
        content: '请填写好所有信息再提交'
      })
      return
    }
    const res = await StudentService.addStudent(students)
    if (res) {
      Message.success({
        content: '添加成功'
      })
      this.loadStudent()
      return true
    }
    return false
  }

  async logOut () {
    const res = await UserService.logout()
    if (res) {
      Message.success({
        content: '登出成功'
      })
      this.$router.push('/login')
    }
  }

  async leaveUp () {
    const res = await UserService.leaveUpUser()
    if (res) {
      Message.success({
        content: '提升成功'
      })
      this.updateUserRole({ userRole: res.newAuth })
    }
  }
}
</script>
<style lang="scss" scoped>
#student{
  max-width: 800px;
}
.header{
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.set-tb-padding{
  padding: 10px 0 10px 10px;
}
</style>
