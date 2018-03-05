import { Provide } from 'vue-property-decorator'
import axios, { AxiosResponse } from 'axios'
import { AjaxReturn } from '../entity/AjaxReturn'
import { Notice } from 'iview'
import { User } from '../entity/User'

interface UserAndUserCountNum {
  users: User[]
  userCountNumber: number
}

export class UserService {

  static async login (username: string, password: string): Promise<{ userRole: string } | void> {
    const res: AxiosResponse<AjaxReturn<{ userRole: string }>> = await axios.post('/api/user/login', { username, password })
    return this.handleError(res.data)
  }

  static async logout (): Promise<boolean | void> {
    const res: AxiosResponse<AjaxReturn<null>> = await axios.get('/api/user/logout')
    return this.handleError(res.data)
  }

  static async getEmailCode (emailAddress: string): Promise<void> {
    const res: AxiosResponse<AjaxReturn<null>> = await axios.post('/api/user/getEmailCode', { email: emailAddress })
    if (res.data.stateCode === 1) {
      Notice.success({
        title: '成功',
        desc: res.data.message
      })
    } else {
      Notice.error({
        title: '有一个错误',
        desc: res.data.message
      })
    }
  }

  static async register (username: string, password: string, email: string, code: string): Promise<{ userRole: string } | void> {
    const res: AxiosResponse<AjaxReturn<{ userRole: string }>> = await axios.put('/api/user/register', { username, password, email, code })
    return this.handleError(res.data)
  }

  static async getUser (page: number, itemNumber: number): Promise<UserAndUserCountNum | void> {
    const res: AxiosResponse<AjaxReturn<UserAndUserCountNum>> = await axios.get('/api/user/getUser', { params: { page, itemNumber } })
    return this.handleError(res.data)
  }

  static async forgetPassword (username: string): Promise<string | void> {
    const res: AxiosResponse<AjaxReturn<string>> = await axios.post('/api/user/forgetPass', { username })
    return this.handleError(res.data)
  }

  static async checkForgetPassCode (code: string): Promise<boolean | void> {
    const res: AxiosResponse<AjaxReturn<null>> = await axios.post('/api/user/checkForgetPassCode', { code })
    return this.handleError(res.data, true)
  }

  static async setNewPass (password: string): Promise<boolean | void> {
    const res: AxiosResponse<AjaxReturn<null>> = await axios.post('/api/user/setNewPass', { password })
    return this.handleError(res.data, true)
  }

  static async checkUsername (username: string): Promise<boolean> {
    const res: AxiosResponse<AjaxReturn<null>> = await axios.post('/api/user/checkUsername', { username })
    return res.data.stateCode === 1
  }

  static async leaveUpUser (): Promise<string | void> {
    const res: AxiosResponse<AjaxReturn<null>> = await axios.post('/api/user/leaveUpUser')
    return this.handleError(res.data)
  }

  private static handleError (result: AjaxReturn<any>, returnData?: any) {
    if (result.stateCode === 1) {
      return returnData || result.data
    } else {
      Notice.warning({
        title: '有一个错误',
        desc: result.message
      })
    }
  }

}

