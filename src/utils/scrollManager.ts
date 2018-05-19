import { now } from './index'
import { Bind, Throttle } from 'lodash-decorators'

const SCROLL_DURATION = 250
const SCROLL_THROTTLE = 100

export default class ScrollManager {

  public isScrolling: boolean = false
  public getScroll: () => number
  public setScroll: (scroll: number) => void
  public updateScroll: (scroll: number) => void

  private scrollStart: number = 0
  private scrollEnd: number = 0
  private startTime: number = 0
  private duration: number = 0
  private animationId: number | null = null

  constructor (
    getScroll: () => number,
    setScroll: (scroll: number) => void,
    updateScroll: (scroll: number) => void,
  ) {
    this.getScroll = getScroll
    this.setScroll = setScroll
    this.updateScroll = updateScroll
  }

  public onScroll (scroll?: number) {
    if (this.isScrolling) {
      this.isScrolling = false
      return
    }
    if (scroll === undefined) scroll = this.getScroll()
    this.throttleUpdateScroll(scroll)
  }

  public scrollTo (scroll: number, duration: number = SCROLL_DURATION) {
    this.scrollStart = this.getScroll()
    this.scrollEnd = scroll
    this.startTime = now()
    this.duration = duration
    if (this.animationId === null) {
      this.animationId = window.requestAnimationFrame(this.animationFrame)
    }
  }

  public cancel () {
    if (this.animationId !== null) {
      window.cancelAnimationFrame(this.animationId)
    }
  }

  @Bind()
  private animationFrame () {
    const { startTime, scrollStart, scrollEnd, duration } = this
    const time = now() - startTime
    const scroll = (scrollEnd - scrollStart) * (time / duration) + scrollStart
    this.isScrolling = true
    this.setScroll(scroll)
    if (time < duration) {
      this.animationId = window.requestAnimationFrame(this.animationFrame)
    } else {
      this.animationId = null
    }
  }

  @Throttle(SCROLL_THROTTLE)
  private throttleUpdateScroll (scroll: number) {
    this.updateScroll(scroll)
  }
}
