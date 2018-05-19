export const isProduction = process.env.NODE_ENV === 'production'

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

export function uniquePush<T> (arr: T[], item: T): boolean {
  const index = arr.indexOf(item)
  if (index === -1) {
    arr.push(item)
    return true
  }
  return false
}

export function erase<T> (arr: T[], item: T): boolean {
  const index = arr.indexOf(item)
  if (index !== -1) {
    arr.splice(index, 1)
    return true
  }
  return false
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

export function createLazyFunction<T extends (...args: any[]) => any> (main: T, firstCall: () => void): T {
  let actualFunc = ((...args: any[]) => {
    firstCall()
    actualFunc = main
    return main(...args)
  }) as T
  return ((...args: any[]) => actualFunc(...args)) as T
}

export enum MediaType {
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
}

interface IDimension {
  maxWidth: string,
  below: MediaType,
  above: MediaType,
}

const dimensions = [{
  maxWidth: '576px',
  below: MediaType.xs,
  above: MediaType.sm,
}, {
  maxWidth: '768px',
  below: MediaType.sm,
  above: MediaType.md,
}, {
  maxWidth: '992px',
  below: MediaType.md,
  above: MediaType.lg,
}, {
  maxWidth: '1200px',
  below: MediaType.lg,
  above: MediaType.xl,
}, {
  maxWidth: '1600px',
  below: MediaType.xl,
  above: MediaType.xxl,
}]

export const watchMedia = (() => {
  const listeners: ((media: MediaType) => any)[] = []
  let media: MediaType = MediaType.xs
  const addListener = (listener: (media: MediaType) => any) => {
    uniquePush(listeners, listener)
  }
  const removeListener = (listener: (media: MediaType) => any) => {
    erase(listeners, listener)
  }
  return createLazyFunction(
    () => ({ media, addListener, removeListener }),
    () => {
      const setMedia = (m: MediaType) => {
        if (media === m) return
        media = m
        listeners.forEach(listener => listener(media))
      }
      const getResponsiveHandler = (dimension: IDimension) => (mql: MediaQueryList) =>
        setMedia(mql.matches ?
          Math.min(media, dimension.below) :
          Math.max(media, dimension.above) ,
        )
      dimensions.forEach(dimension => {
        const mql = window.matchMedia(`(max-width: ${dimension.maxWidth})`)
        const responsiveHandler = getResponsiveHandler(dimension)
        mql.addListener(responsiveHandler)
        responsiveHandler(mql)
      })
    },
  )
})()
