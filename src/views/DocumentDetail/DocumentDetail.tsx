import React, { PureComponent } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import MarkdownView from '@/components/MarkdownView'
import { Document } from '@/models/types'
import { State } from '@/store'
import { fetchDocument } from '@/store/actions/documents'
import { documentSelector } from './selector'

export interface DocumentDetailProps extends RouteComponentProps<{ id: string }> {
  id: number,
  document: Document | undefined,
  fetchDocument: typeof fetchDocument,
}

export interface DocumentDetailState { }

class DocumentDetail extends PureComponent<DocumentDetailProps, DocumentDetailState> {

  public state: DocumentDetailState = {}

  public componentWillMount () {
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
    const { document } = this.props
    return (
      <MarkdownView
        value={document ? document.markdown : undefined}
      />
    )
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
  })(DocumentDetail),
)

