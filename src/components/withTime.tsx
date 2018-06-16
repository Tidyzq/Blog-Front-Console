import React, { ComponentType, PureComponent } from 'react'
import { Bind } from 'lodash-decorators'
import { Omit } from '@/utils/tsHelper'

export interface WithTimeComponentProps {
  timer: number
}

const getTimeInMilliSeconds = () => new Date().valueOf()

const getTimerWatcher = (() => {
  type Listener = (time: number) => void

  const timers: { [interval: number]: { handle: number | undefined, listeners: Set<Listener> } } = {}

  return (interval: number) => {
    const timer = timers[interval] = timers[interval] || { handle: undefined, listeners: new Set() }
    const watchTimer = (listener: Listener) => {
      if (timer.handle === undefined) {
        timer.handle = window.setInterval(() => {
          const time = getTimeInMilliSeconds()
          timer.listeners.forEach(listener => listener(time))
        }, interval)
      }
      timer.listeners.add(listener)
    }
    const unwatchTimer = (listener: Listener) => {
      timer.listeners.delete(listener)
      if (timer.listeners.size === 0 && timer.handle !== undefined) {
        window.clearInterval(timer.handle)
        timer.handle = undefined
      }
    }
    return { watchTimer, unwatchTimer }
  }
})()

const withTime = (interval: number) => <P extends WithTimeComponentProps>(Comp: ComponentType<P>) => {
  type props = Omit<P, keyof WithTimeComponentProps>
  const { watchTimer, unwatchTimer } = getTimerWatcher(interval)
  class Timer extends PureComponent<props, WithTimeComponentProps> {
    public state: WithTimeComponentProps = { timer: getTimeInMilliSeconds() }
    public componentDidMount () { watchTimer(this.onTimer) }
    public componentWillUnmount () { unwatchTimer(this.onTimer) }
    public render () { return <Comp timer={this.state.timer} {...this.props} /> }
    @Bind()
    private onTimer (timer: number) { this.setState({ timer }) }
  }
  return Timer
}

export default withTime
