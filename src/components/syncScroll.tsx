import React, { PureComponent } from 'react'
import { Bind } from 'lodash-decorators'

import { ThrottleWithRAF } from '@/utils/decorators'

export interface SyncScrollOptions {
  containerClassName?: string
  style?: React.CSSProperties
}

export const createSyncScroll = () => {
  type SyncScrollEventHandler = (sender: any, scroll: number) => void

  const listeners: Set<SyncScrollEventHandler> = new Set()
  const emit = (sender: any, scroll: number): void => listeners.forEach(listener => listener(sender, scroll))
  const addListener = (listener: SyncScrollEventHandler): void => { listeners.add(listener) }
  const removeListener = (listener: SyncScrollEventHandler): void => { listeners.delete(listener) }

  class SyncScrollContainer extends PureComponent<SyncScrollOptions, {}> {

    private container: HTMLDivElement | null = null
    private isSettingScroll: boolean = false

    public componentDidMount () {
      addListener(this.onScrollEvent)
    }

    public componentWillUnmount () {
      removeListener(this.onScrollEvent)
    }

    public render () {
      const { containerClassName, style, children } = this.props
      return (
        <div
          className={containerClassName}
          style={style}
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

    @ThrottleWithRAF()
    private updateScroll (scroll: number) {
      emit(this, scroll)
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

  return SyncScrollContainer
}

export default createSyncScroll
