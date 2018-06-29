import React, { PureComponent } from 'react'
import { Bind } from 'lodash-decorators'
import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/lib/codemirror.css'

import withDefaultProps from '@/components/withDefaultProps'

export interface MarkdownEditorProps {
  value: string,
  onChange?: (value: string) => void,
  onSave?: (value: string) => void,
  onDrop?: (e: DragEvent) => Promise<string | null>
  onInit?: (editor: CodeMirror.Editor) => any,
}

export interface MarkdownEditorState {
  editor: CodeMirror.Editor | null
}

export { Editor } from 'codemirror'

// proxy save command
(CodeMirror as any).commands.save = (instance: CodeMirror.Editor) => {
  CodeMirror.signal(instance, 'save', instance)
}

class MarkdownEditor extends PureComponent<MarkdownEditorProps, MarkdownEditorState> {

  public state: MarkdownEditorState = {
    editor: null,
  }

  private editorContainer: HTMLTextAreaElement | null = null

  public render () {
    return (
      <textarea
        ref={this.updateEditorContainer}
      />
    )
  }

  public componentDidUpdate () {
    const { value } = this.props
    const { editor } = this.state
    if (editor && editor.getValue() !== value) editor.setValue(value)
  }

  private getCodeMirrorSettings () {
    return {
      mode: 'markdown',
      indentWithTabs: false,
      lineWrapping: true,
      lineNumbers: true,
      dragDrop: true,
      allowDropFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
    }
  }

  @Bind()
  private updateEditorContainer (editorContainer: HTMLTextAreaElement | null) {
    this.editorContainer = editorContainer
    const { onInit } = this.props
    if (this.editorContainer) {
      const codeMirrorSettings = this.getCodeMirrorSettings()
      const editor = CodeMirror.fromTextArea(this.editorContainer, codeMirrorSettings)
      this.initializeEditor(editor)
      if (onInit) onInit(editor)
      this.setState({ editor })
    }
  }

  private initializeEditor (editor: CodeMirror.Editor) {
    // set size to fill parent
    editor.setSize('100%', '100%')
    // callback on text change
    editor.on('change', (instance, { origin }) => {
      if (origin === 'setValue') return
      const { onChange } = this.props
      if (onChange) onChange(instance.getValue())
    })
    // callback on save command
    editor.on('save', instance => {
      const { onSave } = this.props
      if (onSave) onSave(instance.getValue())
    })
    // callback on drop files
    editor.on('drop', async (instance: CodeMirror.Editor, event: Event) => {
      const { onDrop } = this.props
      if (onDrop) {
        event.preventDefault()
        const textToInsert = await onDrop(event as DragEvent)
        if (textToInsert) {
          const doc = instance.getDoc()
          doc.replaceSelection(textToInsert)
        }
      }
    })
    // set initial value
    editor.setValue(this.props.value)
  }
}

export default withDefaultProps({
  value: '',
})(MarkdownEditor)
