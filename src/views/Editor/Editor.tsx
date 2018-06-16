import React, { PureComponent, Fragment, ChangeEvent } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Bind, Debounce } from 'lodash-decorators'
import { message } from 'antd'

import { Document } from '@/models'
import { Portal as HeaderPortal, Input, Button } from '@/views/Header'
import createSyncScroll from '@/components/syncScroll'
import MarkdownEditor from '@/components/MarkdownEditor'
import MarkdownView from '@/components/MarkdownView'
import DocumentDetailModal from '@/views/Documents/DocumentDetailModal'
import { State } from '@/store'
import { createNewDocument } from '@/models/Document'
import { fetchDocument, updateDocument, createDocument } from '@/store/actions/documents'
import styles from './Editor.scss'

export interface EditorProps extends RouteComponentProps<{ id: string | undefined }> {
  id: number | undefined
  createNew: boolean
  splitView: boolean
  fetchDocument: typeof fetchDocument
  updateDocument: typeof updateDocument
  createDocument: typeof createDocument
}

export interface EditorState {
  document: Document | undefined
  detailModalVisible: boolean
}

const SyncScrollContainer = createSyncScroll()

class Editor extends PureComponent<EditorProps, EditorState> {

  public state: EditorState = {
    document: undefined,
    detailModalVisible: false,
  }

  public render () {
    const { splitView } = this.props
    const { document } = this.state
    const markdown = document ? document.markdown : undefined
    return (
      <Fragment>
        <HeaderPortal>
          <Input value={document ? document.title : undefined} onChange={this.onTitleChange}/>
          <Button onClick={() => this.setState({ detailModalVisible: true })}>Detail</Button>
          <Button type="primary" onClick={() => this.onEditorSave()}>Save</Button>
        </HeaderPortal>
        <DocumentDetailModal
          document={document}
          visible={this.state.detailModalVisible}
          onSubmit={document => this.setState({ document })}
          onClose={() => this.setState({ detailModalVisible: false })}
        />
        <SyncScrollContainer containerClassName={splitView ? styles.editor_container_split : styles.editor_container}>
          <MarkdownEditor
            value={markdown}
            onChange={this.onEditorChange}
            onSave={this.onEditorSave}
          />
        </SyncScrollContainer>
        {!splitView ? null : (
          <SyncScrollContainer containerClassName={styles.editor_container_split}>
            <MarkdownView
              value={markdown}
            />
          </SyncScrollContainer>
        )}
      </Fragment>
    )
  }

  public async componentDidMount () {
    const { id, createNew } = this.props
    this.initialDocument(id, createNew)
  }

  public async componentWillReceiveProps (nextProps: EditorProps) {
    const { id: prevId } = this.props
    const { id: nextId, createNew } = nextProps
    if (prevId !== nextId) {
      this.initialDocument(nextId, createNew)
    }
  }

  private async initialDocument (id: number | undefined, createNew: boolean) {
    const { fetchDocument } = this.props
    if (createNew) {
      // create new document
      const document = createNewDocument()
      this.setState({ document })
    } else {
      // edit existed document
      const document = await fetchDocument(id!)
      if (document) this.setState({ document })
    }
  }

  @Bind()
  @Debounce(500)
  private onEditorChange (markdown: string) {
    if (this.state.document) {
      const document = { ...this.state.document, markdown }
      this.setState({ document })
    }
  }

  @Bind()
  private onTitleChange (event: ChangeEvent<HTMLInputElement>) {
    if (this.state.document) {
      const title = event.target.value
      const document = { ...this.state.document, title }
      this.setState({ document })
    }
  }

  @Bind()
  private async onEditorSave (markdown?: string) {
    if (this.state.document) {
      const { createNew, history, updateDocument, createDocument } = this.props
      if (markdown) {
        this.setState({ document: { ...this.state.document, markdown } })
      }
      const document = this.state.document
      try {
        if (createNew) {
          // call create document
          const createdDocument = await createDocument(document)
          history.push(`/editor/${createdDocument.id}`)
        } else {
          // call update document
          await updateDocument(document)
        }
        this.setState({ detailModalVisible: false })
        message.success('document is saved successfully')
      } catch (e) {
        message.error(e.message)
        console.error(e)
      }
    }
  }

}

export default withRouter(
  connect((_: State, ownProps: RouteComponentProps<{ id: string | undefined }>) => ({
    id: ownProps.match.params.id !== undefined ? parseInt(ownProps.match.params.id, 10) : undefined,
    createNew: ownProps.match.params.id === undefined,
  }), {
    fetchDocument,
    updateDocument,
    createDocument,
  })(
    Editor,
  ),
)
