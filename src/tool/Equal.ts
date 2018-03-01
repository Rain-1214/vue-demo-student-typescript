import { ToolBase } from './ToolBase'


export class Equal extends ToolBase {

  private static result = true

  /**
   * 深度比较两个对象或数组 不比较方法
   * @param {Object | Array} resource  比较的对象
   * @param {Object | Array} target 比较的对象
   * @return {Boolean} result 比较的结果
   */
  static deepEqual (resource: any, target: any): boolean {
    if (!this.checkIsObjectOrArray(resource, target)) {
      throw new Error('参数必须为对象或者数组')
    }
    const resourceKeys = Object.keys(resource)
    resourceKeys.forEach(e => {
      const currentTag = this.getValueTag(e)
      if (currentTag === this.tag.objectTag || currentTag === this.tag.arrayTag) {
        this.deepEqual(resource[e], target[e])
      } else if (!(currentTag === this.tag.funcTag)) {
        if (this.result) {
          this.result = resource[e] === target[e]
        }
      }
    })

    return this.result
  }

  private static checkIsObjectOrArray (...value: any[]): boolean {
    return value.every((e) => {
      const currentTag = this.getValueTag(e)
      return currentTag === this.tag.objectTag || currentTag === this.tag.arrayTag
    })
  }


}


