export function decoratorMixin (func: (...args: any[]) => any) {
  return (...args: any[]) => (target: any, _: string, descriptor: PropertyDescriptor) => {
    const { value } = descriptor
    if (typeof value === 'function') descriptor.value = func.call(target, value, ...args)
    return descriptor
  }
}

import { throttleWithRAF } from '@/utils'

export const ThrottleWithRAF = decoratorMixin(throttleWithRAF)
