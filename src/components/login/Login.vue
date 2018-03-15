<template>
  <div id="login" class="user-layout">
    <div class="center">
      <h1 class="text-center">登录</h1>
      <iv-alert v-if="errorMessage != ''" type="error">{{ errorMessage }}</iv-alert>
      <iv-form ref="loginForm" :model="loginForm" :rules="loginFormRules" :label-width="80">
        <iv-form-item label="Username" prop="username">
          <iv-input type="text" v-model="loginForm.username" />
        </iv-form-item>
        <iv-form-item label="Password" prop="password">
          <iv-input type="password" v-model="loginForm.password" />
        </iv-form-item>
        <iv-row>
          <iv-col span="24" class="text-right">
            <router-link to='/forgetPass'>forget password?</router-link>
          </iv-col>
        </iv-row>
        <iv-form-item class="clear-margin-bottom">
          <iv-row>
            <iv-col span="12">
              <iv-button type="primary" @click="handleSubmit('loginForm')">Login</iv-button>
            </iv-col>
            <iv-col span="12" class="text-right">
              <router-link to="/register">register</router-link>
            </iv-col>
          </iv-row>
        </iv-form-item>
      </iv-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserService as userService } from '../../api/userService'
import { Mutation, Getter } from 'vuex-class'
import { Types } from '../../store/mutation-types'

@Component
export default class LoginComponent extends Vue {
  name = 'login';

  errorMessage = '';
  loginForm = {
    password: '',
    username: ''
  };
  loginFormRules = {
    username: [
      { required: true, message: 'username username', trigger: 'blur' }
    ],
    password: [
      { required: true, message: 'password required', trigger: 'blur' }
    ]
  };

  @Getter('getUserRole') userRole
  @Mutation(Types.UPDATE_USER_ROLE) updateUserRole
  @Mutation(Types.UPDATE_USERNAME) updateUsername

  handleSubmit (formName): void {
    this.$refs[formName]['validate'](async (valid) => {
      if (valid) {
        const res = await userService.login(this.loginForm.username, this.loginForm.password)
        if (res) {
          this.updateUsername({ username: this.loginForm.username })
          this.updateUserRole({ userRole: res.userRole })
          this.$router.push('/student')
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
