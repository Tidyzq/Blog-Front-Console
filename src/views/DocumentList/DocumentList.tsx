import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { List } from 'antd'
import { Document } from '@/models/types'
import { State } from '@/store'
import { fetchDocuments } from '@/store/actions/documents'
import { documentsSelector } from './selector'
import DocumentListItem from './Item'

export interface DocumentListProps {
  documents: { [id: number]: Document | undefined },
  fetchDocuments: typeof fetchDocuments,
}

export interface DocumentListState {
  documents: number[],
}

class DocumentList extends PureComponent<DocumentListProps, DocumentListState> {

  public state: DocumentListState = {
    documents: [],
  }

  public async componentWillMount () {
    const { fetchDocuments } = this.props
    const documents = await fetchDocuments()
    this.setState({ documents })
  }

  public render () {
    const documents = this.getDocuments()
    return (
      <Fragment>
        <List itemLayout="horizontal" dataSource={undefined} renderItem={undefined}>
          {documents.map(document => (
            <DocumentListItem key={document.id} document={document}/>
          ))}
        </List>
      </Fragment>
    )
  }

  private getDocuments () {
    return this.state.documents.map(id => this.props.documents[id]!).filter(Boolean)
  }
}

export default connect((state: State) => ({
  documents: documentsSelector(state),
}), {
  fetchDocuments,
})(DocumentList)
