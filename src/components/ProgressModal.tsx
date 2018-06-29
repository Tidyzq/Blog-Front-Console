import React, { StatelessComponent } from 'react'
import { Modal, Progress } from 'antd'

export interface ProgressModal {
  title?: string
  progress: number
  visible: boolean
}

const ProgressModal: StatelessComponent<ProgressModal> =
({ title, progress, visible }) => (
  <Modal
    title={title}
    visible={visible}
    closable={false}
    maskClosable={false}
    keyboard={false}
    footer={null}
  >
    <Progress format={percent => `${(percent || 0).toFixed(0)}%`} percent={progress * 100}/>
  </Modal>
)

export default ProgressModal
