import React, { PureComponent } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import MarkdownView from '@/components/MarkdownView.tsx'
import { IDocument } from '@/models/types'
import { Document } from '@/api'

export interface IDocumentDetailProps extends RouteComponentProps<{ id: string }> {}

export interface IDocumentDetailState {
  document?: IDocument
}

class DocumentDetail extends PureComponent<IDocumentDetailProps, IDocumentDetailState> {

  public state: IDocumentDetailState = {}

  public componentWillMount () {
    const { match } = this.props
    const id = parseInt(match.params.id, 10)
    this.fetchDocument(id)
  }

  public componentWillUpdate (nextProps: IDocumentDetailProps, nextState: IDocumentDetailState ) {
    const { match } = nextProps
    const { document } = nextState
    const id = parseInt(match.params.id, 10)
    if (!document || id !== document.id) {
      this.fetchDocument(id)
    }
  }

  public render () {
    const { document } = this.state
    return (
      <MarkdownView
        markdown={document ? document.markdown : ''}
      />
    )
  }

  private async fetchDocument (id: number) {
    const { data: document } = await Document.getById(id)
    this.setState({
      document,
    })
  }
}

export default withRouter(DocumentDetail)
