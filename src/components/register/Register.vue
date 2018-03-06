<template>
  <div id="register" class="user-layout">
    <div class="center">
      <div>
        <router-link to="/login"><iv-icon type="chevron-left"></iv-icon> 返回</router-link>
      </div>
      <h1 class="text-center">注册</h1>
      <iv-alert v-show="errorMessage !== ''">{{ errorMessage }}</iv-alert>
      <iv-form ref="registerForm" :model="registerForm" :rules="registerFormRules" :label-width="110">
        <iv-form-item label="Username" prop="username">
          <iv-input type="text" v-model="registerForm.username" />
        </iv-form-item>
        <iv-form-item label="Password" prop="password">
          <iv-input type="password" v-model="registerForm.password" />
        </iv-form-item>
        <iv-form-item label="Password Again" prop="passwordAgain">
          <iv-input type="password" v-model="registerForm.passwordAgain" />
        </iv-form-item>
        <iv-form-item label="Email Address" prop="email">
          <iv-input type="text" v-model="registerForm.email" />
        </iv-form-item>
        <iv-row :gutter="20">
          <iv-col span="16">
            <iv-form-item label="Code" prop="code">
              <iv-input type="text" v-model="registerForm.code" />
            </iv-form-item>
          </iv-col>
          <iv-col span="8">
            <iv-button class="btn-block btn-sm-padding" type="primary" @click="getEmailCode()" :disabled="!getCodeFlag">{{ codeText }}</iv-button>
          </iv-col>
          <iv-col class="set-padding-left" span="24">
            <iv-button type="primary" @click="handleSubmit('registerForm')">提交</iv-button>
            <iv-button type="default" @click="resetForm('registerForm')">重置</iv-button>
          </iv-col>
        </iv-row>
      </iv-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Verification } from '../../tool/verification'
import { UserService } from '../../api/userService'
import { Mutation } from 'vuex-class'
import { Types } from '../../store/mutation-types'

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
  registerFormRules = {
    username: [
      { required: true, message: 'username is required', trigger: 'blur' },
      { min: 6, message: 'min length is 6', trigger: 'change' },
      { max: 16, message: 'max length is 16', trigger: 'change' },
      { validator: this.checkUsername, trigger: 'blur' }
    ],
    password: [
      { required: true, message: 'password is required', trigger: 'blur' },
      { min: 6, message: 'min length is 6', trigger: 'change' },
      { max: 16, message: 'max length is 16', trigger: 'change' },
      { validator: this.triggerCheckPasswordAgain, trigger: 'change' }
    ],
    passwordAgain: [
      { required: true, message: 'passwordAgain is reuqired', trigger: 'blur' },
      { validator: this.checkPasswordAgain, trigger: 'change' }
    ],
    code: [
      { required: true, message: 'code is required', trigger: 'blur' }
    ],
    email: [
      { required: true, message: 'email is required', trigger: 'blur' },
      { validator: this.checkEmail, message: 'email is invalid', trigger: 'change' }
    ]
  }

  getCodeFlag = true
  timeNumber = 60
  codeText = '获取验证码'

  @Mutation(Types.UPDATE_USERNAME) updateUsername
  @Mutation(Types.UPDATE_USER_ROLE) updateUserRole

  async checkUsername (rule, value, callback): Promise<void> {
    if (!Verification.validCharTest(value)) {
      callback(new Error('username has invalid char'))
    }
    const res = await UserService.checkUsername(value)
    if (!res) {
      callback(new Error('username is already register'))
    }
    callback()
  }

  triggerCheckPasswordAgain (rule, value, callback): void {
    console.log(rule)
    if (this.registerForm.passwordAgain !== '') {
      this.$refs.registerForm['validateField']('passwordAgain')
      callback()
    } else {
      callback()
    }
  }

  checkPasswordAgain (rule, value, callback): void {
    if (value !== this.registerForm.password) {
      callback(new Error('passwordAgain is not equal password'))
    } else {
      callback()
    }
  }

  checkEmail (rule, value, callback): void {
    if (Verification.emailTest(value)) {
      callback()
    } else {
      callback(new Error('email address is invalid'))
    }
  }

  created (): void {
    this.checkSendEmailInterval()
  }

  async getEmailCode (): Promise<void> {
    this.$refs.registerForm['validateField']('email')
    if (Verification.emailTest(this.registerForm.email) && this.getCodeFlag) {
      this.getCodeFlag = false
      const res = await UserService.getEmailCode(this.registerForm.email)
      if (res) {
        this.startInterval()
      } else {
        this.getCodeFlag = true
      }
    }
  }

  checkSendEmailInterval (): void {
    const saveData = JSON.parse(localStorage.getItem('codeTime'))
    if (saveData) {
      const currentTime = new Date().getTime()
      const poor = Math.floor((currentTime - saveData.saveTime) / 1000)
      if (poor < this.timeNumber) {
        this.getCodeFlag = false
        this.timeNumber -= poor
        this.startInterval()
      } else {
        localStorage.removeItem('codeTime')
      }
    }
  }

  startInterval () {
    const saveData = localStorage.getItem('codeTime')
    if (!saveData) {
      const saveTime = new Date().getTime()
      localStorage.setItem('codeTime', JSON.stringify({ saveTime }))
    }
    const timerId = setInterval(() => {
      this.codeText = `${this.timeNumber--}秒后重新获取`
      if (this.timeNumber < 0) {
        clearInterval(timerId)
        localStorage.removeItem('codeTime')
        this.codeText = '再次获取'
        this.getCodeFlag = true
        this.timeNumber = 60
      }
    }, 1000)
  }

  handleSubmit (formName: string): void {
    this.$refs[formName]['validate'](async (valid: boolean) => {
      if (valid) {
        const { username, password, email, code } = this.registerForm
        const res = await UserService.register(username, password, email, code)
        if (res) {
          this.updateUsername({ username: username })
          this.updateUserRole({ userRole: res.userRole })
          this.$router.push('/student')
        }
      }
    })
  }

  resetForm (formName: string): void {
    this.$refs[formName]['resetFields']()
  }
}
</script>

<style lang="scss" scoped>
.set-padding-left{
  padding-left: 120px !important;
}
</style>
