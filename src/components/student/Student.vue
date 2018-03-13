<template>
  <div id="student">
    <p class="header">
      用户 {{ username }} 身份 {{ userRole }}
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
        <iv-button type="error" @click="deleteStudent()" v-show="deleteFlag">删除</iv-button>
      </iv-col>
    </iv-row>
    <iv-row class="set-tb-padding" :gutter="15">
      <iv-col span="8"
        v-for="(v, i) in students" :key="i">
        <student-wrapper :student="v" :deleteVisible='deleteFlag'
          @emit-delete-student-id="receiveDeleteId($event)"></student-wrapper>
      </iv-col>
    </iv-row>
    <iv-row>
      <iv-col span="12">
        <iv-button type="success"></iv-button>
      </iv-col>
      <iv-col class="text-right" span="12">
        <iv-page :total="studentCountNum" @on-change="currentPageChange($event)"></iv-page>
      </iv-col>
    </iv-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import GradeSelectComponent from './children/GradeSelect.vue'
import { Grade } from '../../entity/grade'
import { StudentService } from '../../api/studentService'
import { Student } from '../../entity/student'
import StudentWrapperComponent, { DeleteStuMessage } from './children/studentWrapper.vue'

@Component({
  components: {
    'grade-select': GradeSelectComponent,
    'student-wrapper': StudentWrapperComponent
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
  deleteStuIds: Set<number> = new Set()

  privateCurrentPage = 1
  get currentPage () {
    return this.privateCurrentPage
  }

  set currentPage (page: number) {
    this.privateCurrentPage = page
    this.loadStudent(page)
  }

  @Getter('getUsername') username
  @Getter('getUserRole') userRole
  @Getter('getgradeArray') getGradeArray

  async created () {
    this.gradeArray = await this.getGradeArray
    await this.loadStudent(this.currentPage)
  }

  mounted () {
  }

  receiveGid (id: number) {
    this.currentGradeId = id
  }

  receiveCid (id: number) {
    this.currentClassId = id
  }

  receiveDeleteId (deleteStuMessage: DeleteStuMessage) {
    if (deleteStuMessage.flag) {
      this.deleteStuIds.add(deleteStuMessage.studentId)
    } else {
      this.deleteStuIds.delete(deleteStuMessage.studentId)
    }
  }

  async loadStudent (page: number) {
    const res = await StudentService.getStudent(page)
    if (res) {
      this.students = res.students
      this.studentCountNum = res.countNum
    }
  }

  getStudentByGidCid () {

  }

  currentPageChange (pageNumber: number) {
    this.currentPage = pageNumber
  }

  async deleteStudent () {
    const ids = Array.from(this.deleteStuIds)
    const res = await StudentService.deleteStudent(ids)
    if (res) {
      await this.loadStudent(this.currentPage)
    }
  }

  destoryed () {

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
