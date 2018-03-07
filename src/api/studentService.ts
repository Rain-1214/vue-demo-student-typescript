import axios, { AxiosResponse } from 'axios'
import { AjaxReturn } from '../entity/AjaxReturn'
import { Grade } from '../entity/grade'
import { Notice } from 'iview'

export class StudentService {

  static async getGrade (): Promise<Grade[] | void> {
    const res: AxiosResponse<AjaxReturn<Grade[]>> = await axios.get('/api/student/getGrade')
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
