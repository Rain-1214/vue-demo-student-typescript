<template>
  <div id="student">
    student
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component
export default class StudentComponent extends Vue {
  @State('User') userRole

  mounted () {
    console.log(this.userRole)
  }
}
</script>
