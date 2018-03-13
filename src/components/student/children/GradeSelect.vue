<template>
  <iv-row id="gradeSelect" type="flex">
    <iv-col class="clear-padding-left" :span="col" :style="{'paddingRight': selectBetween / 2 + 'px'}">
      <iv-select v-model="selectGrade" clearable :size="size">
        <iv-option v-for="(item, i) in gradeArray" :value="item.id" :key="i">{{ item.gradeName }}</iv-option>
      </iv-select>
    </iv-col>
    <iv-col class="clear-padding-right" :span="col" :style="{'paddingLeft': selectBetween / 2 + 'px'}">
      <iv-select v-model="selectClass" clearable :size="size">
        <iv-option v-for="(item, i) in classArray" :value="item.id" :key="i">{{ item.className }}</iv-option>
      </iv-select>
    </iv-col>
  </iv-row>
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

  @Prop([String]) size: string
  @Prop({ default: 15, type: [Number] }) selectBetween: number
  @Prop({ default: 6 }) col: number
  @Prop([Number, String]) defaultGrade: number
  @Prop([Number, String]) defaultClass: number
  @Getter('getgradeArray') getGradeArray
  @Emit()
  selectGradeId (id: number) {}
  @Emit()
  selectClassId (id: number) {}

  async created () {
    this.gradeArray = await this.getGradeArray
    if (this.defaultGrade && this.defaultClass) {
      this.selectGrade = this.defaultGrade
      this.$nextTick(() => {
        this.selectClass = this.defaultClass
      })
    }
  }

  @Watch('selectGrade')
  setClassArray () {
    this.selectGradeId(this.selectGrade)
    this.selectClass = null
    this.classArray = this.selectGrade ? this.gradeArray.filter(e => e.id === this.selectGrade)[0].classes : []
  }

  @Watch('selectClass')
  EmitClassId () {
    this.selectClassId(this.selectClass)
  }
}
</script>
<style lang="scss" scoped>
.clear-padding-left {
  padding-left: 0 !important;
}
.clear-padding-right {
  padding-right: 0 !important;
}
</style>
