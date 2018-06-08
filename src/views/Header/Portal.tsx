import { PureComponent, ReactNode } from 'react'
import { Bind } from 'lodash-decorators'
import { uniquePush, erase } from '@/utils'

const elements: ReactNode[] = []
const listeners: (() => void)[] = []

function notify () {
  listeners.forEach(listener => listener())
}

export class PortalTarget extends PureComponent {
  public componentWillMount () {
    uniquePush(listeners, this.update)
  }

  public render () {
    return elements
  }

  public componentWillUnmount () {
    erase(listeners, this.update)
  }

  @Bind()
  private update () {
    this.forceUpdate()
  }
}

export interface PortalProps {
  children?: ReactNode
}

export class Portal extends PureComponent<PortalProps> {
  public componentWillReceiveProps (nextProps: PortalProps) {
    erase(elements, this.props.children)
    uniquePush(elements, nextProps.children)
    notify()
  }

  public componentWillMount () {
    uniquePush(elements, this.props.children)
    notify()
  }

  public render () {
    return null
  }

  public componentWillUnmount () {
    erase(elements, this.props.children)
    notify()
  }
}
