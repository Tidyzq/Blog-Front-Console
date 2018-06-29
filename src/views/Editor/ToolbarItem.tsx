import React, { StatelessComponent } from 'react'
import { Editor } from 'codemirror'
import { Button } from 'antd'
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
