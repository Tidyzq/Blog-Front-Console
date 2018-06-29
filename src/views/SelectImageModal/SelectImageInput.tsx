import React, { PureComponent, Fragment } from 'react'
import { Button, Col } from 'antd'

import SelectImageModal from './SelectImageModal'

export interface SelectImageInputProps {
  value?: string,
  onChange?: (value: string) => any,
}

export interface SelectImageInputState {
  selectImageModalVisible: boolean
}

class SelectImageInput extends PureComponent<SelectImageInputProps> {

  public state: SelectImageInputState = {
    selectImageModalVisible: false,
  }

  public render () {
    const { value, onChange } = this.props
    const { selectImageModalVisible } = this.state
    return (
      <Fragment>
        <Col xs={{ span: 24 }} sm={{ span: 12 }}>
          <img src={value} style={{ width: '100%' }} />
        </Col>
        <Button onClick={() => this.setState({ selectImageModalVisible: true })}>Select</Button>
        <SelectImageModal
          multiple={false}
          destroyOnClose={true}
          defaultValue={[ value || '' ]}
          visible={selectImageModalVisible}
          onClose={() => this.setState({ selectImageModalVisible: false })}
          onSelect={images => {
            this.setState({ selectImageModalVisible: false })
            if (onChange) onChange(images.length ? images[0].url : '')
          }}
        />
      </Fragment>
    )
  }
}

export default SelectImageInput