import { ClassNum } from './class'


export class Grade {

  constructor (
    public id?: number,
    public grade?: number,
    public gradeName?: string,
    public classes?: ClassNum[]
  ) {}

}
