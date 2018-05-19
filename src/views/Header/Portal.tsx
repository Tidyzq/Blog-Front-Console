import { PureComponent, ReactNode } from 'react'
import { Bind } from 'lodash-decorators'
import { uniquePush, erase } from '@/utils'

const elements: ReactNode[] = []
const listeners: (() => void)[] = []

function update () {
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

export interface IPortalProps {
  children?: ReactNode
}

export class Portal extends PureComponent<IPortalProps> {
  public componentWillReceiveProps (nextProps: IPortalProps) {
    erase(elements, this.props.children)
    uniquePush(elements, nextProps.children)
    update()
  }

  public componentWillMount () {
    uniquePush(elements, this.props.children)
    update()
  }

  public render () {
    return null
  }

  public componentWillUnmount () {
    erase(elements, this.props.children)
    update()
  }
}
