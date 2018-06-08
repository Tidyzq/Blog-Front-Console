import React, { PureComponent, Fragment, ChangeEvent } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Bind, Debounce } from 'lodash-decorators'
import { message } from 'antd'

// import { document as documentAPI } from '@/api'
import { Document } from '@/models/types'
import { Portal as HeaderPortal, Input, Button } from '@/views/Header'
import syncScroll from '@/components/syncScroll'
import MarkdownEditor from '@/components/MarkdownEditor'
import MarkdownView from '@/components/MarkdownView'
import { State } from '@/store'
import { fetchDocument, updateDocument } from '@/store/actions/documents'
import styles from './Editor.scss'
// import { documentSelector } from './selector'

export interface EditorProps extends RouteComponentProps<{ id: string }> {
  id: number
  // document: Document | undefined
  fetchDocument: typeof fetchDocument
  updateDocument: typeof updateDocument
}

export interface EditorState {
  document: Document | undefined
}

class Editor extends PureComponent<EditorProps, EditorState> {

  public state: EditorState = {
    document: undefined,
  }

  public render () {
    const { document: doc } = this.state
    const markdown = doc ? doc.markdown : undefined
    return (
      <Fragment>
        <HeaderPortal>
          <Input value={doc ? doc.title : undefined} onChange={this.onTitleChange}/>
          <Button type="primary" onClick={() => this.onEditorSave()}>Save</Button>
        </HeaderPortal>
        {syncScroll({
          containerClassName: styles.editor_container,
        })(
          <MarkdownEditor
            value={markdown}
            onChange={this.onEditorChange}
            onSave={this.onEditorSave}
          />,
        )}
        {syncScroll({
          containerClassName: styles.editor_container,
        })(
          <MarkdownView
            value={markdown}
          />,
        )}
      </Fragment>
    )
  }

  public async componentWillMount () {
    const { id, fetchDocument } = this.props
    const document = await fetchDocument(id)
    this.setState({ document })
  }

  public async componentWillReceiveProps (nextProps: EditorProps) {
    const { id: prevId } = this.props
    const { id: nextId, fetchDocument } = nextProps
    if (prevId !== nextId) {
      const document = await fetchDocument(nextId)
      this.setState({ document })
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
      const { updateDocument } = this.props
      if (markdown) {
        this.setState({ document: { ...this.state.document, markdown } })
      }
      const document = this.state.document
      try {
        await updateDocument(document)
        message.success('document is saved successfully')
      } catch (e) {
        message.error(e.message)
        console.error(e)
      }
    }
  }

}

export default withRouter(
  connect((_: State, ownProps: RouteComponentProps<{ id: string }>) => ({
    id: parseInt(ownProps.match.params.id, 10),
  }), {
    fetchDocument,
    updateDocument,
  })(Editor),
)
