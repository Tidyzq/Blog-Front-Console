import React, { StatelessComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Modal, Form, Input, Select, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

import { Document } from '@/models'
import withDefaultProps from '@/components/withDefaultProps'
import { deleteDocument } from '@/store/actions/documents'

export interface DocumentDetailModalProps extends FormComponentProps, RouteComponentProps<{}> {
  document: Document | undefined
  visible: boolean
  onClose: () => void
  onSubmit: (document: Document) => void
  disabled: boolean
  deleteDocument: typeof deleteDocument
}

const DocumentDetail: StatelessComponent<DocumentDetailModalProps> =
({
  document,
  visible,
  onClose,
  onSubmit,
  disabled,
  deleteDocument,
  form: {
    getFieldDecorator,
    getFieldsValue,
  },
  history,
}) => document === undefined ? null : (
  <Modal
    title={document.title}
    visible={visible}
    onCancel={onClose}
    onOk={() => onSubmit({ ...document, ...getFieldsValue() as Document })}
  >
    <Form layout="vertical">
      <Form.Item label="Url">
        {getFieldDecorator('url')(
          <Input disabled={disabled}/>,
        )}
      </Form.Item>
      <Form.Item label="Type">
        {getFieldDecorator('type')(
          <Select disabled={disabled}>
            <Select.Option value="draft">Draft</Select.Option>
            <Select.Option value="post">Post</Select.Option>
            <Select.Option value="page">Page</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="danger"
          style={{ width: '100%' }}
          onClick={() => {
            Modal.confirm({
              content: `Are you sure to delete document "${document.title}"?`,
              onOk: () => {
                deleteDocument(document.id)
                history.push('/documents')
              },
            })
          }}
        >
          Delete
        </Button>
      </Form.Item>
    </Form>
  </Modal>
)

export default withDefaultProps({
  disabled: false,
  onSubmit: (_: Document) => {},
})(
  connect(null, {
    deleteDocument,
  })(
    withRouter(
      Form.create({
        mapPropsToFields: ({ document }: DocumentDetailModalProps) => ({
          url: Form.createFormField({ value: document ? document.url : '' }),
          type: Form.createFormField({ value: document ? document.type : '' }),
        }),
      })(DocumentDetail),
    ),
  ),
)
