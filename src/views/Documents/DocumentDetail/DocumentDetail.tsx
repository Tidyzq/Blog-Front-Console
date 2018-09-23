import React, { PureComponent, Fragment } from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { message } from 'antd'

import MarkdownView from '@/views/MarkdownView'
import DocumentDetailModal from '@/views/Documents/DocumentDetailModal'
import withComputedProps from '@/components/withComputedProps'
import { Document } from '@/models'
import { State } from '@/store'
import { fetchDocument, updateDocument, updateDocumentTags } from '@/store/actions/documents'
import { Breadcrumb, BreadcrumbItem, Portal as HeaderPortal, Button as HeaderButton } from '@/views/Header'

import { documentSelector, tagsSelector } from './selector'

export interface DocumentDetailProps extends RouteComponentProps<{ id: string }> {
  id: number,
  document: Document | undefined,
  tags: number[],
  fetchDocument: typeof fetchDocument,
  updateDocument: typeof updateDocument,
  updateDocumentTags: typeof updateDocumentTags,
}

export interface DocumentDetailState {
  detailModalVisible: boolean
}

class DocumentDetail extends PureComponent<DocumentDetailProps, DocumentDetailState> {

  public state: DocumentDetailState = {
    detailModalVisible: false,
  }

  public componentDidMount () {
    const { id, fetchDocument } = this.props
    fetchDocument(id)
  }

  public componentWillUpdate (nextProps: DocumentDetailProps) {
    const { id: prevId } = this.props
    const { id: nextId, fetchDocument } = nextProps
    if (prevId !== nextId) {
      fetchDocument(nextId)
    }
  }

  public render () {
    const { document, tags, id } = this.props
    return (
      <Fragment>
        <HeaderPortal>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/documents">Documents</Link></BreadcrumbItem>
            <BreadcrumbItem>{document ? document.title : id}</BreadcrumbItem>
          </Breadcrumb>
          <HeaderButton onClick={() => this.setState({ detailModalVisible: true })}>Detail</HeaderButton>
          <HeaderButton type="primary"><Link to={`/editor/${id}`}>Edit</Link></HeaderButton>
        </HeaderPortal>
        {document === undefined ? null :(
          <DocumentDetailModal
            document={document}
            tags={tags}
            onClose={() => this.setState({ detailModalVisible: false })}
            visible={this.state.detailModalVisible}
            onSubmit={this.onDetailSubmit}
          />
        )}
        {document === undefined ? null : (
          <MarkdownView
            value={document.markdown}
          />
        )}
      </Fragment>
    )
  }

  private onDetailSubmit = async (document: Document, tags: number[]) => {
    const { updateDocument, updateDocumentTags } = this.props
    try {
      await Promise.all([
        updateDocument(document),
        updateDocumentTags(document.id, tags),
      ])
      this.setState({ detailModalVisible: false })
      message.success('document is saved successfully')
    } catch (e) {
      message.error(e.message)
      console.error(e)
    }
  }
}

export default withRouter(
  withComputedProps((ownProps: RouteComponentProps<{ id: string }>) => ({
    id: parseInt(ownProps.match.params.id, 10),
  }))(
    connect((state: State, { id }: { id: number }) => ({
      document: documentSelector(state)(id),
      tags: tagsSelector(state)(id),
    }), {
      fetchDocument,
      updateDocument,
      updateDocumentTags,
    })(DocumentDetail),
  ),
)
