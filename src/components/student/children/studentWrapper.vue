<template>
  <div id="stuentWrapper">
    <iv-form ref="updateForm" :model="updateForm" :rules="updateFormRules" :label-width="50">
      <iv-form-item label="姓名" prop="name">
        <iv-input v-model="updateForm.name" v-if="updateFlag" size="small"></iv-input>
        <template v-else>{{ student.name }}</template>
      </iv-form-item>
      <iv-form-item label="性别" prop="sex">
        <iv-select v-model="updateForm.sex" clearable v-if="updateFlag" size="small">
          <iv-option :value="1">男</iv-option>
          <iv-option :value="2">女</iv-option>
        </iv-select>
        <template v-else>{{ student.sex === 1 ? '男' : '女' }}</template>
      </iv-form-item>
      <iv-form-item label="学号" prop="studentNumber">
        <iv-input v-model="updateForm.studentNumber" v-if="updateFlag" size="small"></iv-input>
        <template v-else>{{ student.studentNumber }}</template>
      </iv-form-item>
      <iv-form-item label="班级" prop="grade">
        <grade-select :col="12" size='small' v-if="updateFlag"
          :default-grade="updateForm.gradeId" :default-class="updateForm.classId"
          @select-grade-id="receiveGid($event)" @select-class-id="receiveCid($event)"></grade-select>
        <template v-else>{{ fullGradeName }}</template>
      </iv-form-item>
      <div>
        <iv-button type="primary" @click="updateFlag = true" v-show="!updateFlag">修改</iv-button>
        <iv-button type="default" @click="updateFlag = false" v-show="updateFlag">取消修改</iv-button>
        <iv-button type="primary" @click="updateFlag = false" v-show="updateFlag">提交修改</iv-button>
      </div>
    </iv-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import GradeSelectComponent from './GradeSelect.vue'
import { Getter } from 'vuex-class'
import { Grade } from '../../../entity/grade'

@Component({
  components: {
    'grade-select': GradeSelectComponent
  }
})
export default class StudentWrapperComponent extends Vue {
  name = 'StudentWrapper'

  updateFlag = false
  updateForm = {
    name: '',
    sex: 0,
    studentNumber: null,
    gradeId: null,
    classId: null
  }

  updateFormRules = {
    name: [
      { required: true, message: 'name is required', trigger: 'blur' }
    ],
    sex: [
      { required: true, type: 'number', message: 'sex is required', trigger: 'change' }
    ],
    studentNumber: [
      { required: true, message: 'studentNumber is required', trigger: 'blur' }
    ],
    grade: [
      { validator: this.checkGrade, message: '', trigger: 'change' }
    ]
  }

  fullGradeName: string = ''
  gradeArray: Grade[]

  @Prop([Object]) student
  @Getter('getGradeNameClassNameByGidCid') getFullGradeName

  created () {
    this.updateForm = Object.assign(this.updateForm, this.student)
    this.loadGradeName()
  }

  async loadGradeName () {
    this.fullGradeName = await this.getFullGradeName(this.updateForm.gradeId, this.updateForm.classId)
  }

  receiveGid (gradeId: number) {
    this.updateForm.gradeId = gradeId
    this.$refs.updateForm['validateField']('grade')
  }

  receiveCid (classId: number) {
    this.updateForm.classId = classId
    this.$refs.updateForm['validateField']('grade')
  }

  checkGrade (rule, value, callback) {
    if (!this.updateForm.gradeId || !this.updateForm.classId) {
      callback(new Error('grade is required'))
    } else {
      callback()
    }
  }
}
</script>
<style lang="scss" scoped>
#stuentWrapper{
  box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.3);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  .ivu-form-item{
    margin-bottom: 14px;
  }
  .ivu-form-item-error-tip{
    padding-top: 2px;
  }
}
</style>
