import React, { PureComponent, Fragment } from 'react'
import { List } from 'antd'
import { Document } from '@/api'
import { IDocument } from '@/models/types'
import DocumentListItem from './Item'

export interface IDocumentListProps { }

export interface IDocumentListState {
  documents: IDocument[]
}

class DocumentList extends PureComponent<IDocumentListProps, IDocumentListState> {

  public state: IDocumentListState = {
    documents: [],
  }

  public componentWillMount () {
    this.fetchDocumentList()
  }

  public render () {
    const { documents } = this.state
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

  public async fetchDocumentList () {
    const { data: documents } = await Document.getAll()
    this.setState({
      documents,
    })
  }
}

export default DocumentList
