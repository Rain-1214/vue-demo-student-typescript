<template>
  <div id="gradeSelect">
    <iv-select v-model="selectGrade" clearable>
      <iv-option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</iv-option>
    </iv-select>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class GradeSelectComponent extends Vue {
  name = 'gradeSelect'

  @Prop() selectGrade
  @Prop() selectClass
}
</script>
<style lang="scss" scoped>

</style>
