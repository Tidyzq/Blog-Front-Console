import React, { PureComponent, Fragment } from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { message } from 'antd'
import { Bind } from 'lodash-decorators'

import MarkdownView from '@/components/MarkdownView'
import DocumentDetailModal from '@/views/Documents/DocumentDetailModal'
import { Document } from '@/models'
import { State } from '@/store'
import { fetchDocument, updateDocument } from '@/store/actions/documents'
import { Breadcrumb, BreadcrumbItem, Portal as HeaderPortal, Button as HeaderButton } from '@/views/Header'

import { documentSelector } from './selector'

export interface DocumentDetailProps extends RouteComponentProps<{ id: string }> {
  id: number,
  document: Document | undefined,
  fetchDocument: typeof fetchDocument,
  updateDocument: typeof updateDocument,
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
    const { document, id } = this.props
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
        <DocumentDetailModal
          document={document}
          onClose={() => this.setState({ detailModalVisible: false })}
          visible={this.state.detailModalVisible}
          onSubmit={this.onDetailSubmit}
        />
        {document === undefined ? null : (
          <MarkdownView
            value={document.markdown}
          />
        )}
      </Fragment>
    )
  }

  @Bind()
  private async onDetailSubmit (document: Document) {
    const { updateDocument } = this.props
    try {
      await updateDocument(document)
      this.setState({ detailModalVisible: false })
      message.success('document is saved successfully')
    } catch (e) {
      message.error(e.message)
      console.error(e)
    }
  }
}

export default withRouter(
  connect((state: State, ownProps: RouteComponentProps<{ id: string }>) => {
    const id = parseInt(ownProps.match.params.id, 10)
    return {
      id,
      document: documentSelector(state)(id),
    }
  }, {
    fetchDocument,
    updateDocument,
  })(DocumentDetail),
)

