import { PureComponent, ReactNode } from 'react'
import { Bind } from 'lodash-decorators'

export interface PortalTargetProps { }

export interface PortalProps {
  children?: ReactNode
}

const createPortal = () => {
  type updateHandler = () => void

  const elements: ReactNode[] = []
  const addElement = (node: ReactNode) => { elements.push(node) }
  const removeElement = (node: ReactNode) => {
    const index = elements.indexOf(node)
    if (index !== -1) elements.splice(index, 1)
  }
  const replaceElement = (oldNode: ReactNode, newNode: ReactNode) => {
    const index = elements.indexOf(oldNode)
    if (index !== -1) elements[index] = newNode
  }

  const listeners: Set<updateHandler> = new Set()
  const emit = (): void => { listeners.forEach(listener => listener()) }
  const addListener = (listener: updateHandler): void => { listeners.add(listener) }
  const removeListener = (listener: updateHandler): void => { listeners.delete(listener) }

  class PortalTarget extends PureComponent {
    public componentDidMount () {
      addListener(this.update)
    }

    public render () {
      return elements
    }

    public componentWillUnmount () {
      removeListener(this.update)
    }

    @Bind()
    private update () {
      this.forceUpdate()
    }
  }

  class Portal extends PureComponent<PortalProps> {
    public componentWillReceiveProps (nextProps: PortalProps) {
      replaceElement(this.props.children, nextProps.children)
      emit()
    }

    public componentDidMount () {
      addElement(this.props.children)
      emit()
    }

    public render () {
      return null
    }

    public componentWillUnmount () {
      removeElement(this.props.children)
      emit()
    }
  }

  return { PortalTarget, Portal }

}

export default createPortal
