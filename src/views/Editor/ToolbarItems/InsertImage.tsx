import React, { PureComponent, Fragment } from 'react'

import { Image } from '@/models'
import SelectImageModal from '@/views/SelectImageModal'
import { Editor } from '@/views/MarkdownEditor'
import withComputedProps from '@/components/withComputedProps'

import ToolbarItem, { ToolbarItemProps } from '../ToolbarItem'

export interface InsertImageProps extends ToolbarItemProps { }

export interface InsertImageState {
  selectImageModalVisible: boolean
}

export function imageToLink (image: Image) {
  return `![${image.name}](${image.url} "${image.name}")`
}

export function insertImageWork (editor: Editor, images: Image[]) {
  const valueToInsert = images.map(imageToLink).join('\n')
  const doc = editor.getDoc()
  const startCursor = doc.getCursor('start')
  const endCursor = doc.getCursor('end')
  doc.replaceRange(valueToInsert, startCursor, endCursor)
}

class InsertImage extends PureComponent<InsertImageProps, InsertImageState> {

  public state: InsertImageState = {
    selectImageModalVisible: false,
  }

  public render () {
    const { editor } = this.props
    const { selectImageModalVisible } = this.state
    return (
      <Fragment>
        <ToolbarItem
          {...this.props}
          icon="image"
          work={() => this.setState({ selectImageModalVisible: true })}
        />
        <SelectImageModal
          visible={selectImageModalVisible}
          onClose={() => this.setState({ selectImageModalVisible: false })}
          onSelect={images => {
            this.setState({ selectImageModalVisible: false })
            if (editor) insertImageWork(editor, images)
          }}
        />
      </Fragment>
    )
  }
}

export default
withComputedProps(({ editor }: { editor: Editor | null }) => ({
  avaliable: Boolean(editor),
}))(
  InsertImage,
)
