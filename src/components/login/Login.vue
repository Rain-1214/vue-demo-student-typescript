<template>
  <div id="login">
    <div class="center">
      <h1 class="text-center">登录</h1>
      <iv-alert v-if="errorMessage != ''" type="error">{{ errorMessage }}</iv-alert>
      <iv-form ref="loginForm" :model="loginForm" :rules="loginFormRule" :label-width="80">
        <iv-form-item label="Username" prop="username">
            <iv-input type="text" v-model="loginForm.username" />
        </iv-form-item>
        <iv-form-item label="Password" prop="password">
            <iv-input type="password" v-model="loginForm.password" />
        </iv-form-item>
        <iv-form-item>
            <iv-button type="primary" @click="handleSubmit('loginForm')">Submit</iv-button>
            <iv-button type="ghost" @click="handleReset('loginForm')" style="margin-left: 8px">Reset</iv-button>
        </iv-form-item>
      </iv-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserService as userService } from '../../api/user'

@Component
export default class LoginComponent extends Vue {
  name = 'login';
  errorMessage = '';
  loginForm = {
    password: '',
    username: ''
  };
  loginFormRule = {
    username: [
      { required: true, message: 'username username', trigger: 'blur' }
    ],
    password: [
      { required: true, message: 'password required', trigger: 'blur' }
    ]
  };

  mounted () {
    userService.logout()
  }

  handleSubmit (formName): void {
    this.$refs[formName]['validate']((valid) => {
      console.log(valid)
    })
  }

  handleReset (formName): void {
    this.$refs[formName]['resetFields']()
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/sass/_variable.scss';
  @import '../../assets/sass/_mixin.scss';

  #login{
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
