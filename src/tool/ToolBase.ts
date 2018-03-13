interface FloatObject {
  floatInt: number
  floatIntStr: string
  floatDecimal: number
  floatDecimalStr: string
  allInteger: number
  times: number
}



export class ToolBase {

  static MAX_ARRAY_INDEX = 2 ** 53
  static hasOwn = Object.prototype.hasOwnProperty
  static tag = {
    arrayTag: '[object Array]',
    boolTag: '[object Boolean]',
    dateTag: '[object Date]',
    errorTag: '[object Error]',
    funcTag: '[object Function]',
    mapTag: '[object Map]',
    numberTag: '[object Number]',
    nullTag: '[object Null]',
    objectTag: '[object Object]',
    promiseTag: '[object Promise]',
    regexpTag: '[object RegExp]',
    setTag: '[object Set]',
    stringTag: '[object String]',
    symbolTag: '[object Symbol]',
    undefinedTag: '[object Undefined]'
  }

  static getValueTag (value: any): string {
    if (value === null) {
      return value === undefined ? this.tag.undefinedTag : this.tag.nullTag
    }
    return Object.prototype.toString.call(value)
  }

  static isObject (value): boolean {
    const valueTag = typeof value
    return valueTag != null && (valueTag === 'object')
  }

  static isNull (value): boolean {
    return value === null
  }

  static isUndefined (value): boolean {
    return value === undefined
  }

  static isArray (value): boolean {
    return Array.isArray(value)
  }

  static isArrayLike (value): boolean {
    if (!this.hasOwn.call(value, 'length')) {
      return false
    }
    const length = value.length
    return typeof length === 'number' && length >= 0 && length <= this.MAX_ARRAY_INDEX
  }

  static isString (value): boolean {
    return typeof value === 'string' || this.getValueTag(value) === this.tag.stringTag
  }

  static isNumber (value): boolean {
    const valueTag = typeof value
    return valueTag === 'number' || (this.isObject(value) && this.getValueTag(value) === this.tag.numberTag)
  }

  static isMap (value) {
    return value != null && this.getValueTag(value) === this.tag.mapTag
  }

  static isSet (value) {
    return value != null && this.getValueTag(value) === this.tag.setTag
  }

  /**
   * 将一个浮点类型值转放大成整数
   * @param {Number} value 需要转换的值
   * @return {Object} -> {
   *  floatInt: 整数部分
   *  floatIntStr: 整数部分(字符串)
   *  floatDecimal: 小数部分
   *  floatDecimalStr: 小数部分(字符串)
   *  allInteger：转换成的整数
   *  times: 放大倍数
   * }
   */
  static floatToInt (value): FloatObject {
    if (!(this.isNumber(value) && `${value}`.indexOf('.') !== -1)) {
      return {
        floatInt: value,
        floatIntStr: `${value}`,
        floatDecimal: null,
        floatDecimalStr: null,
        allInteger: value,
        times: 1
      }
    }
    const floatString = `${value}`
    const floatDecimalStr = floatString.split('.')[1]
    const floatIntStr = floatString.split('.')[0]
    const allInteger = Number.parseInt(floatIntStr + floatDecimalStr, 10)
    const times = 10 ** (floatDecimalStr.length)
    const floatInt = Number.parseInt(floatIntStr)
    const floatDecimal = Number.parseInt(floatDecimalStr)
    return {
      floatInt,
      floatIntStr,
      floatDecimal,
      floatDecimalStr,
      allInteger,
      times
    }
  }


  /**
   * 浮点类型计算 加法 或 乘法
   * @param {String} sign 计算符号 '+' '*'
   * @param {...Number} valueArray 累加(乘)的一系列值
   * @return {Number} 计算结果
   */
  static floatComputeAddorMul (sign: string, ...valueArray): number {
    return valueArray.reduce((sum, currentValue) => {
      if (!this.isNumber(currentValue)) {
        return sum
      }
      sum = this.floatToInt(sum)
      currentValue = this.floatToInt(currentValue)
      switch (sign) {
        case '+':
          if (sum.times === currentValue.times) {
            return ((sum.allInteger + currentValue.allInteger) / sum.times)
          }
          return sum.times > currentValue.times ?
            (sum.allInteger + (currentValue.allInteger * (sum.times / currentValue.times))) / sum.times
            : (currentValue.allInteger + (sum.allInteger * (currentValue.times / sum.times))) / currentValue.times
        default:
          return (sum.allInteger * currentValue.allInteger) / (sum.times * currentValue.times)
      }
    })
  }


  /**
   * 浮点类型计算 减法 或 除法
   * @param {String} sign 计算符号 '-' '/'
   * @param {Number} firstvalue 被减数/被除数
   * @param {...Number} valueArray 累减(除)的一系列值
   * @return {Number} 计算结果
   */
  static floatComputeSuborDiv (sign: string, firstvalue: number, ...valueArray): number {
    return valueArray.reduce((sum, currentValue) => {
      if (!this.isNumber(currentValue)) {
        return sum
      }
      sum = this.floatToInt(sum)
      currentValue = this.floatToInt(currentValue)
      switch (sign) {
        case '-':
          if (sum.times === currentValue.times) {
            return ((sum.allInteger - currentValue.allInteger) / sum.times)
          }
          return sum.times > currentValue.times ?
            (sum.allInteger - (currentValue.allInteger * (sum.times / currentValue.times))) / sum.times
            : (((sum.allInteger * (currentValue.times / sum.times)) - currentValue.allInteger) / currentValue.times)
        default: return (sum.allInteger / currentValue.allInteger) * (sum.times / currentValue.times)
      }
    }, firstvalue)
  }

  /**
   * 生成[min,max]的随机整数,两个参数应该为整数,如果为小数则会忽略小数部分
   * @param min 下限
   * @param max 上限
   * @returns {number} 生成的随机数
   */
  static randomNum (min, max) {
    const maxObject = this.floatToInt(max)
    const minObject = this.floatToInt(min)
    return Math.floor((Math.random() * ((maxObject.floatInt - minObject.floatInt) + 1)) + minObject.floatInt)
  }

  /**
   * 检测一个对象或数组中是否存在无效值 可自定义需要检测属性(数组为自定义下标)
   * @param {Object|Array} target 检测的目标
   * @param {String[]} property? 检测的属性
   * @returns {boolean} 检测的属性当中存在无效值 false 否则 true
   */
  static checkEmptyProperty (target: Object | Array<string>, property?: string[]): boolean {
    console.log(this.getValueTag(target))
    if (this.getValueTag(target) !== this.tag.objectTag && this.getValueTag(target) !== this.tag.arrayTag) {
      throw new Error('target must be Object or Array')
    }
    const checkPropertys = property ? property : Object.keys(target)
    return checkPropertys.every((e) => {
      return target[e] !== undefined && target[e] !== null && target[e] !== ''
    })
  }


}

