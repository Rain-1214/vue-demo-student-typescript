<template>
  <div id="student">
    <p class="header">
      用户 {{ username }} 身份 {{ userRole }}
    </p>
    <iv-row>
      <iv-col span="16">
        <grade-select></grade-select>
      </iv-col>
    </iv-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import GradeSelectComponent from './children/GradeSelect.vue'

@Component({
  components: {
    'grade-select': GradeSelectComponent
  }
})
export default class StudentComponent extends Vue {
  name = 'student'

  @Getter('getUsername') username
  @Getter('getUserRole') userRole

  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.header{
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>
