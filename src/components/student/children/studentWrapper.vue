<template>
  <div id="stuentWrapper">
    <iv-form ref="updateForm" :model="updateForm" :label-width="50">
      <iv-form-item label="姓名" :prop="updateForm.name">
        <iv-input v-model="updateForm.name" v-if="updateFlag"></iv-input>
        <template v-else>{{ student.name }}</template>
      </iv-form-item>
      <iv-form-item label="性别" :prop="updateForm.name">
        <iv-select v-model="updateForm.sex" clearable v-if="updateFlag">
          <iv-option :value="0">男</iv-option>
          <iv-option :value="1">女</iv-option>
        </iv-select>
        <template v-else>{{ student.sex === 1 ? '女' : '男' }}</template>
      </iv-form-item>
      <iv-form-item label="性别" :prop="updateForm.name">
        <iv-select v-model="updateForm.sex" clearable v-if="updateFlag">
          <iv-option :value="0">男</iv-option>
          <iv-option :value="1">女</iv-option>
        </iv-select>
        <template v-else>{{ student.sex === 1 ? '女' : '男' }}</template>
      </iv-form-item>
    </iv-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class StudentWrapperComponent extends Vue {
  name = 'StudentWrapper'

  updateFlag = true
  updateForm = {
    name: '',
    sex: 0,
    studentNumber: null,
    gradeId: null,
    classId: null
  }

  updateFormRules = {
    name: [
      { required: true }
    ]
  }

  @Prop([Object]) student

  created () {
    this.updateForm = Object.assign(this.updateForm, this.student)
  }
}
</script>
<style lang="scss" scoped>
#stuentWrapper{
  box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.3);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
}
</style>
