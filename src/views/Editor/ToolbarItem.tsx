import React, { StatelessComponent } from 'react'
import { Button } from 'antd'

import { Editor } from '@/views/MarkdownEditor'
import Icon from '@/components/Icon'

export interface ToolbarItemProps {
  editor: Editor | null
  avaliable: boolean
}

export interface ToolbarItemOwnProps extends ToolbarItemProps {
  icon: string
  work: () => any
}

const Toolbar: StatelessComponent<ToolbarItemOwnProps> =
({ icon, avaliable, work }) => (
  <Button disabled={!avaliable} onClick={() => work()}>
    <Icon type={icon}/>
  </Button>
)

export default Toolbar
