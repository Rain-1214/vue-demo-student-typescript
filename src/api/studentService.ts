import axios, { AxiosResponse } from 'axios'
import { AjaxReturn } from '../entity/AjaxReturn'
import { Grade } from '../entity/grade'
import { Notice } from 'iview'
import { Student } from '../entity/student'

interface StuAndCountNum {
  countNum: number,
  students: Student[]
}

export class StudentService {

  static async getGrade (): Promise<Grade[] | void> {
    const res: AxiosResponse<AjaxReturn<Grade[]>> = await axios.get('/api/student/getGrade')
    return this.handleError(res.data)
  }

  static async getStuByGidCid (gradeId: number, classId: number): Promise<Student[] | void> {
    const res: AxiosResponse<AjaxReturn<Student[]>> = await axios.post('/api/student/getStuBygidcid', { gradeId, classId })
    return this.handleError(res.data)
  }

  static async getStudent (page: number): Promise<StuAndCountNum | void> {
    const res: AxiosResponse<AjaxReturn<StuAndCountNum>> = await axios.get('/api/student/getStudent', { params: { page } })
    return this.handleError(res.data)
  }

  static async addStudent (students: Student[]): Promise<boolean | void> {
    const res: AxiosResponse<AjaxReturn<null>> = await axios.put('/api/student/addStudent', { students })
    return this.handleError(res.data, true)
  }

  static async updateStudent (student: Student): Promise<boolean | void> {
    const { id, name, studentNumber, sex, classId, gradeId } = student
    const res: AxiosResponse<AjaxReturn<null>> = await axios.post('/api/student/updateStudent', { id, name, studentNumber, sex, classId, gradeId })
    return this.handleError(res.data, true)
  }

  static async deleteStudent (ids: number[]): Promise<boolean | void> {
    const res: AxiosResponse<AjaxReturn<null>> = await axios.post('/api/student/deleteStudent', { ids })
    return this.handleError(res.data, true)
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
