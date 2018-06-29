import React, { PureComponent, ChangeEvent } from 'react'
import { Bind } from 'lodash-decorators'

import withDefaultProps from '@/components/withDefaultProps'

export interface FileSelectorProps {
  multiple: boolean
  visible: boolean
  accept: string
  onCancel: () => any
  onSelect: (files: File[]) => any
}

class FileSelector extends PureComponent<FileSelectorProps, {}> {

  private input: HTMLInputElement | null = null

  public render () {
    const { accept, multiple } = this.props
    return (
      <input
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={this.onFileChange}
        ref={input => { this.input = input }}
        multiple={multiple}
      />
    )
  }

  public componentDidMount () {
    if (this.props.visible) {
      this.showFileSelector()
    }
  }

  public componentDidUpdate (prevProps: FileSelectorProps) {
    const currProps = this.props
    if (currProps.visible && !prevProps.visible) {
      this.showFileSelector()
    }
  }

  private showFileSelector () {
    if (this.input) {
      this.input.click()
      // no way to detect cancel event of file selection dialog
      // so call onCancel to reset visible props
      setTimeout(() => this.props.onCancel())
    }
  }

  @Bind()
  private onFileChange (event: ChangeEvent<HTMLInputElement>) {
    const { onSelect } = this.props
    const files: File[] = []
    const fileList = event.target.files
    if (fileList) {
      for (let i = 0; i < fileList.length; ++i) {
        const file = fileList.item(i)
        if (file) files.push(file)
      }
    }
    onSelect(files)
  }

}

export default
withDefaultProps({
  multiple: true,
  accept: '*',
})(
  FileSelector,
)
