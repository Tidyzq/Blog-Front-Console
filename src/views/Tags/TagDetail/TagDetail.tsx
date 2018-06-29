import React, { PureComponent, Fragment } from 'react'
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Input, Button, Divider, Modal, List, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { mapValues } from 'lodash'
import { Bind } from 'lodash-decorators'

import { State } from '@/store'
import { Document, Tag } from '@/models'
import { fetchTag, updateTag, deleteTag } from '@/store/actions/tags'
import { Breadcrumb, BreadcrumbItem, Portal as HeaderPortal, Button as HeaderButton } from '@/views/Header'
import withComputedProps from '@/components/withComputedProps'
import DocumentListItem from '@/views/Documents/DocumentList/Item'

import { tagSelector, documentsSelector } from './selector'

export interface TagDetailProps extends RouteComponentProps<{ id: string }>, FormComponentProps {
  id: number,
  createNew: boolean,
  tag: Tag | undefined,
  documents: Document[],
  fetchTag: typeof fetchTag,
  updateTag: typeof updateTag,
  deleteTag: typeof deleteTag,
}

export interface TagDetailState { }

class TagDetail extends PureComponent<TagDetailProps, TagDetailState> {

  public state: TagDetailState = { }

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

  public componentDidMount () {
    const { id, fetchTag } = this.props
    fetchTag(id)
  }

  public componentDidUpdate (prevProps: TagDetailProps) {
    const { id: currId, fetchTag } = this.props
    const { id: prevId } = prevProps
    if (prevId !== currId) {
      fetchTag(currId)
    }
  }

  public render () {
    const { id, tag, documents, form: { getFieldDecorator } } = this.props
    return !tag ? null : (
      <Fragment>
        <HeaderPortal>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/tags">Tags</Link></BreadcrumbItem>
            <BreadcrumbItem>{tag ? tag.name : id}</BreadcrumbItem>
          </Breadcrumb>
          <HeaderButton type="primary" onClick={this.onSave}>Save</HeaderButton>
        </HeaderPortal>
        <Form layout="horizontal">
          <Form.Item label="ID:" {...this.formItemLayout}>{tag.id}</Form.Item>
          <Form.Item label="Name:" {...this.formItemLayout}>
            {getFieldDecorator('name')(
              <Input />,
            )}
          </Form.Item>
          <Form.Item label="Url:" {...this.formItemLayout}>
            {getFieldDecorator('url')(
              <Input />,
            )}
          </Form.Item>
          <Form.Item label="Documents:" {...this.formItemLayout}>
            <List itemLayout="horizontal" dataSource={undefined} renderItem={undefined}>
              {documents.map(document => (
                <DocumentListItem key={document.id} document={document} author={undefined} />
              ))}
            </List>
          </Form.Item>
          <Divider />
          <Form.Item {...this.formButtonLayout}>
            <Button
              type="danger"
              style={{ width: '100%' }}
              onClick={this.onDelete}
            >
              Delete
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    )
  }

  private validateFields () {
    const { form: { validateFields } } = this.props
    return new Promise<Tag>((resolve, reject) => {
      validateFields((errors, values: Tag) => {
        if (errors) return reject(errors)
        resolve(values)
      })
    })
  }

  @Bind()
  private async onSave () {
    try {
      const { tag, updateTag } = this.props
      if (!tag) return
      const validatedTag = await this.validateFields()
      const newTag: Tag = { ...tag, ...validatedTag }
      await updateTag(newTag)
      message.success(`Tag "${newTag.name}" has been saved`)
    } catch (e) {
      message.error(e.message)
      console.error(e)
    }
  }

  @Bind()
  private async onDelete () {
    const { tag, deleteTag, history } = this.props
    if (!tag) return
    Modal.confirm({
      content: `Are you sure to delete tag "${tag.name}"?`,
      onOk: async () => {
        try {
          await deleteTag(tag.id)
          message.success(`Tag "${tag.name}" has been deleted`)
          history.push('/tags')
        } catch (e) {
          message.error(e.message)
          console.error(e)
        }
      },
    })
  }
}

export default withRouter(
  withComputedProps((ownProps: RouteComponentProps<{ id: string }>) => ({
    id: parseInt(ownProps.match.params.id, 10),
    createNew: parseInt(ownProps.match.params.id, 10).toString() === ownProps.match.params.id,
  }))(
    connect((state: State, { id }: { id: number}) => ({
      tag: tagSelector(state)(id),
      documents: documentsSelector(state)(id),
    }), {
      fetchTag,
      updateTag,
      deleteTag,
    })(
      Form.create({
        mapPropsToFields: ({ tag }: TagDetailProps) => mapValues(tag, value => Form.createFormField({ value })),
      })(
        TagDetail,
      ),
    ),
  ),
)
