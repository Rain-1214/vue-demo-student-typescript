<template>
  <div id="gradeSelect">
    <iv-col :span="col">
      <iv-select v-model="selectGrade" clearable>
        <iv-option v-for="(item, i) in gradeArray" :value="item.id" :key="i">{{ item.gradeName }}</iv-option>
      </iv-select>
    </iv-col>
    <iv-col :span="col">
      <iv-select v-model="selectClass" clearable>
        <iv-option v-for="(item, i) in classArray" :value="item.id" :key="i">{{ item.className }}</iv-option>
      </iv-select>
    </iv-col>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Grade } from '../../../entity/grade'
import { ClassNum } from '../../../entity/class'

@Component
export default class GradeSelectComponent extends Vue {
  name = 'gradeSelect'

  gradeArray: Grade[] = []
  classArray: ClassNum[] = []
  selectGrade: number = null
  selectClass: number = null

  @Prop({ default: 6 }) col: number
  @Getter('getgradeArray') getGradeArray
  @Emit()
  selectGradeId (id: number) {}
  @Emit()
  selectClassId (id: number) {}

  async created () {
    this.gradeArray = await this.getGradeArray
  }

  @Watch('selectGrade')
  setClassArray () {
    if (this.selectGrade) {
      this.selectGradeId(this.selectGrade)
      this.classArray = this.gradeArray.filter(e => e.id === this.selectGrade)[0].classes
    } else {
      this.classArray = []
    }
  }

  @Watch('selectClass')
  EmitClassId () {
    this.selectClassId(this.selectClass)
  }
}
</script>
<style lang="scss" scoped>

</style>
