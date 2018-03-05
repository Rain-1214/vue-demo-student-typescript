<template>
  <div id="register">
    <div class="center">
      <h1 class="text-center">注册</h1>
      <iv-alert v-show="errorMessage !== ''">{{ errorMessage }}</iv-alert>
      <iv-form ref="registerForm" :model="registerForm">

      </iv-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class RegisterComponent extends Vue {
  name = 'register'

  errorMessage = ''
  registerForm = {
    username: '',
    password: '',
    passwordAgain: '',
    email: '',
    code: ''
  }
  registerFormRolue = {
    username: [
      { require: true }
    ]
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/sass/_variable.scss';
@import '../../assets/sass/_mixin.scss';

#register{
  width: 100vw;
  height: 100vh;
  background: $bg-color-blue;
  .center{
    width: 400px;
    padding: 20px;
    background: $bg-color-white;
    border-radius: 15px;
    box-shadow: 0 0 30px rgba(0,0,0,0.3);
    @include all-center(absolute);
  }
}
</style>
