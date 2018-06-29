import React, { PureComponent, Fragment, ChangeEvent } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Bind, Debounce } from 'lodash-decorators'
import { message } from 'antd'

import { Document } from '@/models'
import { Portal as HeaderPortal, Input, Button } from '@/views/Header'
import MarkdownEditor, { Editor as EditorHandler } from '@/views/MarkdownEditor'
import MarkdownView from '@/views/MarkdownView'
import DocumentDetailModal from '@/views/Documents/DocumentDetailModal'
import createSyncScroll from '@/components/syncScroll'
import { State } from '@/store'
import { createNewDocument } from '@/models/Document'
import { fetchDocument, updateDocument, updateDocumentTags, createDocument } from '@/store/actions/documents'

import Toolbar from './Toolbar'
import styles from './Editor.scss'

export interface EditorProps extends RouteComponentProps<{ id: string | undefined }> {
  id: number | undefined
  createNew: boolean
  splitView: boolean
  fetchDocument: typeof fetchDocument
  updateDocument: typeof updateDocument
  updateDocumentTags: typeof updateDocumentTags
  createDocument: typeof createDocument
}

export interface EditorState {
  document: Document | undefined
  tags: number[]
  detailModalVisible: boolean
  editor: EditorHandler | null
}

const SyncScrollContainer = createSyncScroll()

class Editor extends PureComponent<EditorProps, EditorState> {

  public state: EditorState = {
    document: undefined,
    tags: [],
    detailModalVisible: false,
    editor: null,
  }

  public render () {
    const { splitView } = this.props
    const { editor, document, tags } = this.state
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
          tags={tags}
          visible={this.state.detailModalVisible}
          onSubmit={(document, tags) => this.setState({ document, tags, detailModalVisible: false })}
          onClose={() => this.setState({ detailModalVisible: false })}
        />
        <div className={splitView ? styles.editor_container_split : styles.editor_container} style={{ display: 'flex', flexDirection: 'column' }}>
          <Toolbar editor={editor}/>
          <SyncScrollContainer style={{ overflow: 'scroll' }}>
            <MarkdownEditor
              value={markdown}
              onChange={this.onEditorChange}
              onSave={this.onEditorSave}
              onInit={editor => this.setState({ editor })}
            />
          </SyncScrollContainer>
        </div>
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
      const { document, tags } = await fetchDocument(id!)
      if (document) this.setState({ document, tags })
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
      const { createNew, history, updateDocument, updateDocumentTags, createDocument } = this.props
      if (markdown) {
        this.setState({ document: { ...this.state.document, markdown } })
      }
      const { document, tags } = this.state
      try {
        if (createNew) {
          // call create document
          const createdDocument = await createDocument(document)
          await updateDocumentTags(createdDocument.id, tags)
          history.push(`/editor/${createdDocument.id}`)
        } else {
          // call update document
          await Promise.all([
            updateDocument(document),
            updateDocumentTags(document.id, tags),
          ])
        }
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
    updateDocumentTags,
    createDocument,
  })(
    Editor,
  ),
)
