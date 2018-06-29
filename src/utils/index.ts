export const now = ((): (() => number) => {
  const hasPerformance = typeof window !== 'undefined' && window.performance && window.performance.now

  return hasPerformance
    ? window.performance.now.bind(window.performance)
    : Date.now
})()

export function easeInOut (k: number) {
  return 0.5 * (1 - Math.cos(Math.PI * k))
}

export function isPromise (promise: any) {
  return promise.then && typeof promise.then === 'function'
}

export function throttlePromise <T extends (...args: any[]) => Promise<any>> (func: T): T {
  const penddingPromises: { [key: string]: Promise<any> } = {}
  return (function (this: any, ...args: any[]): Promise<any> {
    const key = JSON.stringify(args)
    if (penddingPromises[key]) return penddingPromises[key]
    const result = func.apply(this, args) as Promise<any>
    if (isPromise(result)) {
      penddingPromises[key] = result
      result.then(data => {
        delete penddingPromises[key]
        return data
      }, err => {
        delete penddingPromises[key]
        throw err
      })
    }
    return result
  }) as T
}

export function throttleWithRAF <T extends (...args: any[]) => any> (func: T) {
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

export function JsonStringify (obj: any): string {
  let result: string = 'undefined'
  try {
    result = JSON.stringify(obj)
  } catch (e) {
    // do nothing
  }
  return result
}

export function JsonParse (obj: string): any {
  let result: any
  try {
    result = JSON.parse(obj)
  } catch (e) {
    // do nothing
  }
  return result
}

export function createLazyFunction <T extends (...args: any[]) => any> (main: T, firstCall: () => void): T {
  let actualFunc = ((...args: any[]) => {
    firstCall()
    actualFunc = main
    return main(...args)
  }) as T
  return ((...args: any[]) => actualFunc(...args)) as T
}

export function prefixReduce<I, R> (arr: I[], reducer: (accumulator: R, currentValue: I, currentIndex: number) => R, initialValue: R): R[] {
  let value: R = initialValue
  const result: R[] = []
  for (let i = 0; i < arr.length; ++i) {
    result[i] = value = reducer(value, arr[i], i)
  }
  return result
}
