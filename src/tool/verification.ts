import { ToolBase } from './ToolBase'

export class Verification extends ToolBase {

  private static emailReg = /^[\w\-]+[\w\-\.]*@[\w\-]+(\.[\w\-]+)+$/

  private static validCharReg = /^[\w\-]+$/

  static emailTest (email: string): boolean {
    if (this.getValueTag(email) !== this.tag.stringTag) {
      return false
    }
    return this.emailReg.test(email)
  }

  static validCharTest (str: string): boolean {
    if (this.getValueTag(str) !== this.tag.stringTag) {
      return false
    }
    return this.validCharReg.test(str)
  }

}

