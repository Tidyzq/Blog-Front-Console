import React, { StatelessComponent } from 'react'

import { Editor } from '@/views/MarkdownEditor'

import InsertImage from './ToolbarItems/InsertImage'

export interface ToolbarProps {
  editor: Editor | null
}

const Toolbar: StatelessComponent<ToolbarProps> =
({ editor }) => (
  <div>
    <InsertImage editor={editor}/>
  </div>
)

export default Toolbar
