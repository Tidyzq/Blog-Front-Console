import { createLazyFunction } from '@/utils'

export enum MediaType {
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
}

interface Dimension {
  maxWidth: string,
  below: MediaType,
  above: MediaType,
}

const dimensions: Dimension[] = [{
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
  const listeners: Set<(media: MediaType) => any> = new Set()
  let media: MediaType = MediaType.xs
  const addListener = (listener: (media: MediaType) => any) => {
    listeners.add(listener)
  }
  const removeListener = (listener: (media: MediaType) => any) => {
    listeners.delete(listener)
  }
  return createLazyFunction(
    () => ({ media, addListener, removeListener }),
    () => {
      const setMedia = (m: MediaType) => {
        if (media === m) return
        media = m
        listeners.forEach(listener => listener(media))
      }
      const getResponsiveHandler = (dimension: Dimension) => (mql: MediaQueryList) =>
        setMedia(mql.matches ?
          Math.min(media, dimension.below) :
          Math.max(media, dimension.above),
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