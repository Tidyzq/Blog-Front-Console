function decoratorMixin (func: (...args: any[]) => any) {
  return (...args: any[]) => (target: any, _: string, descriptor: PropertyDescriptor) => {
    const { value } = descriptor
    if (typeof value === 'function') descriptor.value = func.call(target, value, ...args)
    return descriptor
  }
}

const throttleWithRAF = <T extends (...args: any[]) => any>(func: T) => {
  let rAFHandler: number | null = null
  let rAFCall: boolean = false
  let rAFThis: any
  let rAFArgs: any[]
  return function (this: any, ...args: any[]) {
    if (rAFHandler === null) {
      func.apply(this, args)
      rAFCall = false
      rAFHandler = requestAnimationFrame(() => {
        if (rAFCall) func.apply(rAFThis, rAFArgs)
        rAFHandler = null
      })
    } else {
      rAFThis = this
      rAFArgs = args
      rAFCall = true
    }
  }
}

export const ThrottleWithRAF = decoratorMixin(throttleWithRAF)
