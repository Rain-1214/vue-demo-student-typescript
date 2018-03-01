import { Provide } from 'vue-property-decorator'
import axios, { AxiosResponse } from 'axios'
import { AjaxReturn } from '../entity/AjaxReturn'
import { Notice } from 'iview'

export class UserService {

  static async login (username: string, password: string): Promise<boolean | void> {
    const res: AxiosResponse<AjaxReturn> = await axios.post('/api/user/login', { username, password })
    return this.handleError(res.data)
  }

  static async logout (): Promise<boolean | void> {
    const res: AxiosResponse<AjaxReturn> = await axios.get('/api/user/logout')
    return this.handleError(res.data)
  }

  static async getEmailCode (emailAddress: string): Promise<void> {
    const res: AxiosResponse<AjaxReturn> = await axios.post('/api/user/getEmailCode', { email: emailAddress })
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

  static async register (username, password, email, code): Promise<void> {
    const res: AxiosResponse<AjaxReturn> = await axios.put('/api/user/register', { username, password, email, code })
  }

  private static handleError (result: AjaxReturn, returnData?: any) {
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

