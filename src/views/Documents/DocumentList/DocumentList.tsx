import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { List } from 'antd'
import { Document, User } from '@/models'
import { State } from '@/store'
import { fetchDocuments } from '@/store/actions/documents'
import { documentsSelector, usersSelector } from './selector'
import DocumentListItem from './Item'

export interface DocumentListProps {
  documents: { [id: number]: Document | undefined },
  users: { [id: number]: User | undefined },
  fetchDocuments: typeof fetchDocuments,
}

export interface DocumentListState {
  documentIdList: number[],
}

class DocumentList extends PureComponent<DocumentListProps, DocumentListState> {

  public state: DocumentListState = {
    documentIdList: [],
  }

  public async componentDidMount () {
    const { fetchDocuments } = this.props
    const documentIdList = await fetchDocuments()
    this.setState({ documentIdList })
  }

  public render () {
    const { documentIdList } = this.state
    const { documents, users } = this.props
    return (
      <List itemLayout="horizontal" dataSource={undefined} renderItem={undefined}>
        {documentIdList.map(id => {
          const document = documents[id]
          if (!document) return null
          const author = users[document.author]
          return (
            <DocumentListItem key={document.id} document={document} author={author}/>
          )
        }).filter(Boolean)}
      </List>
    )
  }
}

export default connect((state: State) => ({
  documents: documentsSelector(state),
  users: usersSelector(state),
}), {
  fetchDocuments,
})(DocumentList)
