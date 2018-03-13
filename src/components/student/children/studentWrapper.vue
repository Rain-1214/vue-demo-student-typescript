<template>
  <div id="stuentWrapper">
    <div v-show='deleteVisible'>
      <iv-checkbox v-model="deleteFlag">{{ deleteFlag ? '已选择' : '选择此人' }}</iv-checkbox>
    </div>
    <iv-form class="small-error hidden-error-icon" ref="updateForm" :model="updateForm" :rules="updateFormRules" :label-width="50">
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
      <div class="button-group">
        <iv-button type="primary" @click="updateFlag = true" v-show="!updateFlag" size="small">修改</iv-button>
        <iv-button type="default" @click="cancleUpdate()" v-show="updateFlag" size="small">取消修改</iv-button>
        <iv-button type="primary" @click="confirmUpdate()" v-show="updateFlag" size="small">提交修改</iv-button>
      </div>
    </iv-form>
    <iv-modal
      title="确认修改"
      v-model="updateConfirmFlag"
      :loading="submitUpdateLoading"
      @on-ok="submitUpdate()">
      <iv-row class="confirm-update" type="flex">
        <iv-col span="10">
          <ul>
            <li><span>姓名</span>{{ student.name }}</li>
            <li><span>性别</span>{{ student.sex === 1 ? '男' : '女' }}</li>
            <li><span>学号</span>{{ student.studentNumber }}</li>
            <li><span>班级</span>{{ fullGradeName }}</li>
          </ul>
        </iv-col>
        <iv-col class="icon" span="2">
          <iv-icon type="arrow-right-a"></iv-icon>
        </iv-col>
        <iv-col span="10">
          <ul>
            <li><span>姓名</span>{{ updateForm.name }}</li>
            <li><span>性别</span>{{ updateForm.sex === 1 ? '男' : '女' }}</li>
            <li><span>学号</span>{{ updateForm.studentNumber }}</li>
            <li><span>班级</span>{{ fullGradeName }}</li>
          </ul>
        </iv-col>
      </iv-row>
    </iv-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Grade } from '../../../entity/grade'
import { Student } from '../../../entity/student'
import { StudentService } from '../../../api/studentService'
import { Message } from 'iview'
import GradeSelectComponent from './GradeSelect.vue'
import { Equal } from '../../../tool/Equal'

export interface DeleteStuMessage {
  flag: boolean,
  studentId: number
}

@Component({
  components: {
    'grade-select': GradeSelectComponent
  }
})
export default class StudentWrapperComponent extends Vue {
  name = 'StudentWrapper'

  updateFlag = false
  updateForm: Student = {
    id: null,
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
      { validator: this.checkNumber, trigger: 'blur' }
    ],
    grade: [
      { validator: this.checkGrade, trigger: 'change' }
    ]
  }

  submitUpdateLoading = false
  updateConfirmFlag = false
  deleteFlag = false

  fullGradeName: string = ''
  modifyGradeName: string = ''
  gradeArray: Grade[]

  @Prop() deleteVisible: boolean
  @Prop([Object]) student: Student
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

  confirmUpdate () {
    this.$refs.updateForm['validate'](async (valid) => {
      if (valid) {
        this.modifyGradeName = await this.getFullGradeName(this.updateForm.gradeId, this.updateForm.classId)
        this.updateConfirmFlag = true
      }
    })
  }

  async submitUpdate () {
    if (Equal.deepEqual(this.student, this.updateForm)) {
      Message.warning({
        content: '没有任何属性变动'
      })
      return
    }
    this.submitUpdateLoading = true
    const res = await StudentService.updateStudent(this.updateForm)
    if (res) {
      this.submitUpdateLoading = false
      Message.success({
        content: '修改成功'
      })
      Object.assign(this.student, this.updateForm)
    }
  }

  cancleUpdate () {
    this.updateFlag = false
    this.updateForm = Object.assign(this.updateForm, this.student)
  }

  checkNumber (rule, value, callback) {
    if (!/^[0-9]+$/.test(value)) {
      callback(new Error('学号必须是数字'))
    }
    callback()
  }

  checkGrade (rule, value, callback) {
    if (!this.updateForm.gradeId || !this.updateForm.classId) {
      callback(new Error('grade is required'))
    } else {
      callback()
    }
  }

  @Watch('deleteVisible')
  onDeleteVisibleChange () {
    this.deleteFlag = false
  }

  @Watch('deleteFlag')
  onDeleteFlagChange () {
    this.emitDeleteStudentId({flag: this.deleteFlag, studentId: this.student.id})
  }

  @Emit()
  emitDeleteStudentId (deleteStuMessage: DeleteStuMessage) {
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
  .button-group {
    padding-top: 5px;
  }
}
.confirm-update {
  span {
    display: inline-block;
    width: 30px;
  }
}

.icon{
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
