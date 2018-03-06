<template>
  <div id="forgetPass" class="user-layout">
    <div class="center">
      <div>
        <router-link to="/login"><iv-icon type="chevron-left"></iv-icon> 返回</router-link>
      </div>
      <h1 class="text-center">找回密码</h1>
      <template v-if="currentStep === 1">
        <iv-alert>
          请输入您要找回密码的帐号
        </iv-alert>
        <iv-form ref="inputUsernameForm" :model="inputUsernameForm" :rules="inputUsernameFormRules" :label-width="80">
          <iv-form-item label="Username" prop="username">
            <iv-input type="text" v-model="inputUsernameForm.username" />
          </iv-form-item>
          <iv-form-item class="clear-margin-bottom">
            <iv-button type="primary" :loading="btnLoading" @click="submitUsername('inputUsernameForm')">提交</iv-button>
          </iv-form-item>
        </iv-form>
      </template>
      <template v-if="currentStep === 2">
        <iv-alert>
          已经向您的邮箱{{ userEmail }}发送了验证码，请到对应的邮箱查找
        </iv-alert>
        <iv-form ref="checkCodeForm" :model="checkCodeForm" :rules="checkCodeFormRules" :label-width="80">
          <iv-form-item label="Code" prop="code">
            <iv-input type="text" v-model="checkCodeForm.code" />
          </iv-form-item>
          <iv-form-item class="clear-margin-bottom">
            <iv-button type="primary" @click="submitCode('checkCodeForm')">提交</iv-button>
          </iv-form-item>
        </iv-form>
      </template>
      <template v-if="currentStep === 3">
        <iv-form ref="setNewPassForm" :model="setNewPassForm" :rules="setNewPassFormRules" :label-width="120">
          <iv-form-item label="Password" prop="password">
            <iv-input type="password" v-model="setNewPassForm.password" />
          </iv-form-item>
          <iv-form-item label="PasswordAgain" prop="passwordAgain">
            <iv-input type="password" v-model="setNewPassForm.passwordAgain" />
          </iv-form-item>
          <iv-form-item class="clear-margin-bottom">
            <iv-button type="primary" @click="handleSetNewPass('setNewPassForm')">提交</iv-button>
          </iv-form-item>
        </iv-form>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserService } from '../../api/userService'
import { Notice } from 'iview'

@Component
export default class ForgetPassComponent extends Vue {
  name = 'forgetPass'

  btnLoading = false
  currentStep = 1

  inputUsernameForm = {
    username: ''
  }

  inputUsernameFormRules = {
    username: [
      { required: true, message: 'username is required', trigger: 'blur' }
    ]
  }

  userEmail: string

  checkCodeForm = {
    code: ''
  }

  checkCodeFormRules = {
    code: [
      { required: true, message: 'code is required', trigger: 'blur' }
    ]
  }

  setNewPassForm = {
    password: '',
    passwordAgain: ''
  }

  setNewPassFormRules = {
    password: [
      { required: true, message: 'password is required', trigger: 'blur' },
      { min: 6, message: 'min length is 6', trigger: 'change' },
      { max: 16, message: 'max length is 16', trigger: 'change' },
      { validator: this.triggerCheckPasswordAgain, trigger: 'change' }
    ],
    passwordAgain: [
      { required: true, message: 'passwordAgain is reuqired', trigger: 'blur' },
      { validator: this.checkPasswordAgain, trigger: 'change' }
    ]
  }

  triggerCheckPasswordAgain (rule, value, callback): void {
    if (this.setNewPassForm.passwordAgain !== '') {
      this.$refs.setNewPassForm['validateField']('passwordAgain')
      callback()
    } else {
      callback()
    }
  }

  checkPasswordAgain (rule, value, callback): void {
    if (value !== this.setNewPassForm.password) {
      callback(new Error('passwordAgain is not equal password'))
    } else {
      callback()
    }
  }

  submitUsername (formName): void {
    this.$refs[formName]['validate'](async (valid: boolean) => {
      if (valid) {
        this.btnLoading = true
        const res = await UserService.forgetPassword(this.inputUsernameForm.username)
        if (res) {
          this.userEmail = res
          this.currentStep = 2
        }
        this.btnLoading = false
      }
    })
  }

  submitCode (formName): void {
    this.$refs[formName]['validate'](async (valid: boolean) => {
      if (valid) {
        this.btnLoading = true
        const res = await UserService.checkForgetPassCode(this.checkCodeForm.code)
        if (res) {
          this.currentStep = 3
        }
        this.btnLoading = false
      }
    })
  }

  handleSetNewPass (fromName): void {
    this.$refs[fromName]['validate'](async (valid: boolean) => {
      if (valid) {
        this.btnLoading = true
        const res = await UserService.setNewPass(this.setNewPassForm.password)
        if (res) {
          Notice.success({
            title: '成功',
            desc: '修改成功,即将跳转至登录界面'
          })
          setInterval(() => {
            this.$router.push('/login')
          }, 1500)
        }
        this.btnLoading = false
      }
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
