import { bind, throttle, debounce } from 'lodash'

function lodashDecoratorMixin (func: (...args: any[]) => any) {
  return (...args: any[]) => (target: any, _: string, descriptor: PropertyDescriptor) => {
    const { get, set, value } = descriptor
    if (typeof get === 'function') descriptor.get = func.call(target, get, ...args)
    if (typeof set === 'function') descriptor.set = func.call(target, set, ...args)
    if (typeof value === 'function') descriptor.value = func.call(target, value, ...args)
    return descriptor
  }
}

export const Bind = lodashDecoratorMixin(bind)

export const Throttle = lodashDecoratorMixin(throttle)

export const Debounce = lodashDecoratorMixin(debounce)
