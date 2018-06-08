import React, { PureComponent, ReactNode } from 'react'
import EventEmitter from 'events'
import { Bind } from 'lodash-decorators'

import { ThrottleByRAF } from '@/utils/decorators'

const scrollEventBus = new EventEmitter()
const ScrollEvent = Symbol()

export interface SyncScrollOptions {
  containerClassName?: string
}

export class SyncScrollContainer extends PureComponent<SyncScrollOptions> {

  private container: HTMLDivElement | null = null
  private isSettingScroll: boolean = false

  public componentDidMount () {
    scrollEventBus.addListener(ScrollEvent, this.onScrollEvent)
  }

  public componentWillUnmount () {
    scrollEventBus.removeListener(ScrollEvent, this.onScrollEvent)
  }

  public render () {
    const { containerClassName, children } = this.props
    return (
      <div
        className={containerClassName}
        ref={container => this.container = container}
        onScroll={this.onScroll}
      >
        <div>
          {children}
        </div>
      </div>
    )
  }

  private getScroll () {
    const { container } = this
    if (!container) return 0
    const scroll = container.scrollTop / (container.scrollHeight - container.clientHeight)
    return scroll
  }

  private setScroll (scroll: number) {
    const { container } = this
    if (!container) return
    this.isSettingScroll = true
    container.scrollTop = scroll * (container.scrollHeight - container.clientHeight)
  }

  @ThrottleByRAF()
  private updateScroll (scroll: number) {
    scrollEventBus.emit(ScrollEvent, this, scroll)
  }

  @Bind()
  private onScrollEvent (sender: SyncScrollContainer, scroll: number) {
    if (sender !== this) this.setScroll(scroll)
  }

  @Bind()
  private onScroll () {
    if (this.isSettingScroll) {
      this.isSettingScroll = false
      return
    }
    this.updateScroll(this.getScroll())
  }
}

const syncScroll = (options: SyncScrollOptions) => (node: ReactNode): ReactNode => (
  <SyncScrollContainer {...options}>
    {node}
  </SyncScrollContainer>
)

export default syncScroll
