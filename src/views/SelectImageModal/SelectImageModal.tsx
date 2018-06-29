import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { Modal, Row, Col, Card, Button, Popconfirm, message } from 'antd'
import { Bind } from 'lodash-decorators'

import { Image } from '@/models'
import Icon from '@/components/Icon'
import FileSelector from '@/components/FileSelector'
import ProgressModal from '@/components/ProgressModal'
import withDefaultProps from '@/components/withDefaultProps'
import { fetchImages, createImages, deleteImage } from '@/store/actions/images'
import styles from './SelectImageModal.scss'

export interface SelectImageModalProps {
  visible: boolean,
  onClose: () => any,
  multiple: boolean,
  destroyOnClose: boolean,
  defaultValue: string[],
  onSelect: (images: Image[]) => any,
  afterClose?: () => any,
  fetchImages: typeof fetchImages,
  createImages: typeof createImages,
  deleteImage: typeof deleteImage,
}

export interface SelectImageModalState {
  images: Image[]
  selectedImageURLs: string[]
  imageSelectorVisible: boolean
  uploadProgress: number
  uploadProgressModalVisible: boolean
}

class SelectImageModal extends PureComponent<SelectImageModalProps, SelectImageModalState> {

  public state: SelectImageModalState = {
    images: [],
    selectedImageURLs: this.props.defaultValue,
    imageSelectorVisible: false,
    uploadProgress: 0,
    uploadProgressModalVisible: false,
  }

  public componentDidUpdate (prevProps: SelectImageModalProps, prevState: SelectImageModalState) {
    if (this.props.visible && !prevProps.visible) {
      this.fetchImages()
    }
    if (this.props.defaultValue !== prevProps.defaultValue) {
      this.setState({ selectedImageURLs: this.props.defaultValue })
    }
    if (this.state.images !== prevState.images) {
      this.setState({ selectedImageURLs: this.getSelectedImageURLs(this.state.images, this.state.selectedImageURLs) })
    }
  }

  public render () {
    const { visible, onClose, afterClose, destroyOnClose } = this.props
    const { imageSelectorVisible, selectedImageURLs, images, uploadProgress, uploadProgressModalVisible } = this.state
    const selectedImageURLSet = new Set(selectedImageURLs)
    return (
      <Modal
        title="Select Image"
        visible={visible}
        onCancel={onClose}
        width={782}
        afterClose={afterClose}
        destroyOnClose={destroyOnClose}
        footer={[
          <Button key="upload" type="primary" style={{ float: 'left' }} onClick={() => this.setState({ imageSelectorVisible: true })}>Upload</Button>,
          <Button key="cancel" onClick={onClose}>Cancel</Button>,
          <Button key="ok" type="primary" onClick={this.onConfirmSelectImages}>OK</Button>,
        ]}
      >
        <FileSelector
          accept="image/png,image/jpeg,image/gif"
          visible={imageSelectorVisible}
          onCancel={() => this.setState({ imageSelectorVisible: false })}
          onSelect={this.onUploadImages}
        />
        <ProgressModal
          progress={uploadProgress}
          visible={uploadProgressModalVisible}
        />
        <Row gutter={16} style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
        {images.map(image => (
          <Col key={image.name} span={6} style={{ display: 'inline-block', float: 'none' }}>
            <Card
              hoverable
              cover={<img src={image.url} />}
              onClick={() => this.onSelectImage(image)}
            >
              {!selectedImageURLSet.has(image.url) ? null : (
                <div className={styles.selected_icon}/>
              )}
              <Card.Meta
                title={image.name}
                description={
                  <Fragment>
                    {image.size}
                    <span onClick={e => e.stopPropagation()}>
                      <Popconfirm title="Are you sure to delete this image?" onConfirm={() => this.onDeleteImage(image)}>
                        <Icon type="trash" className={styles.delete_button}/>
                      </Popconfirm>
                    </span>
                  </Fragment>
                }
              />
            </Card>
          </Col>
        ))}
        </Row>
      </Modal>
    )
  }

  private getSelectedImageURLs (images: Image[], originalSelectedImageURLs: string[] = []) {
    const imageURLSet = new Set(images.map(image => image.url))
    return originalSelectedImageURLs.filter(url => imageURLSet.has(url))
  }

  private async fetchImages () {
    const { fetchImages } = this.props
    const images = await fetchImages()
    this.setState({ images })
  }

  private onSelectImage (image: Image) {
    const { multiple } = this.props
    const { selectedImageURLs } = this.state
    const newSelectedImageURLs = selectedImageURLs.slice()
    const foundIndex = selectedImageURLs.indexOf(image.url)
    if (foundIndex !== -1) {
      newSelectedImageURLs.splice(foundIndex, 1)
    } else {
      newSelectedImageURLs.push(image.url)
      if (!multiple && selectedImageURLs.length) {
        newSelectedImageURLs.shift()
      }
    }
    this.setState({ selectedImageURLs: newSelectedImageURLs })
  }

  @Bind()
  private onConfirmSelectImages () {
    const { onSelect } = this.props
    const { images, selectedImageURLs } = this.state
    const newSelectedImageURLSet = new Set(selectedImageURLs)
    onSelect(images.filter(image => newSelectedImageURLSet.has(image.url)))
  }

  @Bind()
  private async onUploadImages (files: File[]) {
    const { createImages } = this.props
    try {
      if (files.length) {
        this.setState({ uploadProgress: 0, uploadProgressModalVisible: true })
        message.info(`Uploading ${files.length} images`)
        await createImages(files, uploadProgress => {
          this.setState({ uploadProgress })
        })
        this.setState({ uploadProgressModalVisible: false })
        message.success(`Uploading completed`)
        await this.fetchImages()
      }
    } catch (e) {
      this.setState({ uploadProgressModalVisible: false })
      message.error(e.message)
      console.error(e)
    }
  }

  private async onDeleteImage (image: Image) {
    const { deleteImage } = this.props
    try {
      await deleteImage(image)
      message.success(`Image "${image.name}" has been deleted`)
      await this.fetchImages()
    } catch (e) {
      message.error(e.message)
      console.error(e)
    }
  }
}

export default
withDefaultProps({
  multiple: true,
  defaultValue: [] as string[],
  destroyOnClose: false,
})(
  connect(null, {
    fetchImages,
    createImages,
    deleteImage,
  })(
    SelectImageModal,
  ),
)
