import { ToolBase } from './ToolBase'

export class Clone extends ToolBase {

  private static loopPropertyArray = new Map()

  /**
   * 浅克隆一个对象 或数组
   * @param {Object|Array} target 克隆的目标
   */
  static shallowCopy (target: any): any {
    if (this.getValueTag(target) !== this.tag.objectTag || this.getValueTag(target) !== this.tag.arrayTag) {
      return target
    }
    const result = this.getValueTag(target) === this.tag.arrayTag ? [] : {}
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        result[key] = target[key]
      }
    }
    return result
  }

  /**
   * 深克隆一个目标 支持循环引用
   * @param {Object|Array} target 克隆的目标
   */
  static deepCopy (target: any): any {
    if (this.getValueTag(target) !== this.tag.objectTag && this.getValueTag(target) !== this.tag.arrayTag) {
      return target
    }
    const result = this.getValueTag(target) === this.tag.arrayTag ? [] : {}
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        this.loopPropertyArray.set(key, target[key])
        const currentTag = this.getValueTag(target[key])
        if (currentTag === this.tag.arrayTag || currentTag === this.tag.objectTag) {
          if (this.loopPropertyArray.has(key)) {
            result[key] = this.loopPropertyArray.get(key)
          } else {
            result[key] = this.deepCopy(target[key])
          }
        } else {
          result[key] = target[key]
        }
      }
    }
    this.loopPropertyArray = new Map()
    return result
  }

}

