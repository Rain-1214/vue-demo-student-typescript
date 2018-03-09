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
      </iv-col>
    </iv-row>
    <iv-row class="set-tb-padding student-wrapper" :gutter="15">
      <iv-col span="8"
        v-for="(v, i) in students" :key="i">
        <student-wrapper :student="v"></student-wrapper>
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
import StudentWrapperComponent from './children/studentWrapper.vue'

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

  @Getter('getUsername') username
  @Getter('getUserRole') userRole
  @Getter('getgradeArray') getGradeArray

  async created () {
    this.gradeArray = await this.getGradeArray
    await this.loadStudent(1)
  }

  mounted () {
  }

  receiveGid (id: number) {
    this.currentGradeId = id
  }

  receiveCid (id: number) {
    this.currentClassId = id
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
  padding-top: 10px;
  padding-bottom: 10px;
}
.student-wrapper{
  padding-left: 10px;
}
</style>
