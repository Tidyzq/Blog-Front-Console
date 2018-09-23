import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Modal, Form, Input, Select, Button, Divider, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { mapValues } from 'lodash'
import { Bind } from 'lodash-decorators'

import { Document, Tag } from '@/models'
import withDefaultProps from '@/components/withDefaultProps'
import { deleteDocument } from '@/store/actions/documents'
import { fetchTags } from '@/store/actions/tags'
import { State } from '@/store'

import { tagsSelector } from './selector'

export interface DocumentDetailModalProps extends FormComponentProps, RouteComponentProps<{}> {
  document: Document
  tags: number[]
  tagsMap: { [id: number]: Tag | undefined }
  visible: boolean
  onClose: () => void
  onSubmit: (document: Document, tags: number[]) => void
  deleteDocument: typeof deleteDocument
  fetchTags: typeof fetchTags
}

export interface DocumentDetailModalState {
  tagIds: number[]
}

class DocumentDetail extends PureComponent<DocumentDetailModalProps, DocumentDetailModalState> {

  public state: DocumentDetailModalState = {
    tagIds: [],
  }

  private formItemLayout = {
    labelCol: {
      sm: { span: 4 },
      xs: { span: 24 },
    },
    wrapperCol: {
      sm: { span: 16 },
      xs: { span: 24 },
    },
  }

  private formButtonLayout = {
    wrapperCol: {
      sm: { span: 16, offset: 4 },
      xs: { span: 24 },
    },
  }

  public componentDidUpdate (prevProps: DocumentDetailModalProps) {
    if (this.props.visible && !prevProps.visible) {
      this.fetchTags()
    }
  }

  public render () {
    const {
      document,
      tagsMap,
      visible,
      onClose,
      onSubmit,
      form: {
        getFieldDecorator,
        getFieldsValue,
      },
    } = this.props
    const { tagIds } = this.state
    return (
      <Modal
        title={document.title}
        visible={visible}
        onCancel={onClose}
        onOk={() => {
          const { tags: newTags, ...newDocument } = getFieldsValue() as Document & { tags: number[] }
          onSubmit({ ...document, ...newDocument }, newTags)
        }}
      >
        <Form layout="horizontal">
          <Form.Item label="Tags" {...this.formItemLayout}>
            {getFieldDecorator('tags')(
              <Select mode="multiple">
                {tagIds.map(tagId => {
                  const tag = tagsMap[tagId]
                  if (!tag) return null
                  return (
                    <Select.Option key={tag.id} value={tag.id}>{tag.name}</Select.Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Url" {...this.formItemLayout}>
            {getFieldDecorator('url')(
              <Input/>,
            )}
          </Form.Item>
          <Form.Item label="Type" {...this.formItemLayout}>
            {getFieldDecorator('type')(
              <Select>
                <Select.Option value="draft">Draft</Select.Option>
                <Select.Option value="post">Post</Select.Option>
                <Select.Option value="page">Page</Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Divider />
          <Form.Item {...this.formButtonLayout}>
            <Button
              type="danger"
              style={{ width: '100%' }}
              onClick={this.onDeleteClick}
            >
              Delete
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  @Bind()
  private onDeleteClick () {
    const { history, deleteDocument, document } = this.props
    Modal.confirm({
      content: `Are you sure to delete document "${document.title}"?`,
      onOk: async () => {
        try {
          await deleteDocument(document.id)
          message.success(`Document "${document.title}" has been deleted`)
          history.push('/documents')
        } catch (e) {
          message.error(e.message)
          console.error(e)
        }
      },
    })
  }

  private async fetchTags () {
    const { fetchTags } = this.props
    const tagIds = await fetchTags()
    this.setState({ tagIds })
  }
}

export default withDefaultProps({
  onSubmit: (_: Document, __: number[]) => {},
})(
  withRouter(
    Form.create({
      mapPropsToFields: ({ document, tags }: DocumentDetailModalProps) => ({
        ...mapValues(document, value => Form.createFormField({ value })),
        tags: Form.createFormField({ value: tags }),
      }),
    })(
      connect((state: State) => ({
        tagsMap: tagsSelector(state),
      }), {
        deleteDocument,
        fetchTags,
      })(
        DocumentDetail,
      ),
    ),
  ),
)
