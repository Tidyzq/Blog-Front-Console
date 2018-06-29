import React from 'react'
import SelectImageModal from './SelectImageModal'
import ReactDOM from 'react-dom'

import { Image } from '@/models'

export interface SelectImageFuncProps {
  onClose?: () => any,
  multiple?: boolean,
  defaultValue?: string[],
  afterClose?: () => any,
  onSelect: (images: Image[]) => any,
}

interface SelectImageProps extends SelectImageFuncProps {
  visible: boolean
  onClose: () => any,
}

export default function selectImage (config: SelectImageFuncProps) {
  const div = document.createElement('div')
  document.body.appendChild(div)

  function render (props: SelectImageProps) {
    ReactDOM.render(<SelectImageModal {...props}/>, div)
  }

  function destory () {
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }
  }

  function afterClose () {
    if (config.afterClose) config.afterClose()
    destory()
  }

  function onClose () {
    if (config.onClose) config.onClose()
    render({ ...config, visible: false, onClose, onSelect, afterClose })
  }

  function onSelect (images: Image[]) {
    onClose()
    config.onSelect(images)
  }

  render({ ...config, visible: true, onClose, onSelect, afterClose })

  return {
    destory: onClose,
  }
}
