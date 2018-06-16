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
}

export interface MarkdownEditorState { }

// proxy save command
(CodeMirror as any).commands.save = (instance: CodeMirror.Editor) => {
  CodeMirror.signal(instance, 'save', instance)
}

class MarkdownEditor extends PureComponent<MarkdownEditorProps, MarkdownEditorState> {

  private editorContainer: HTMLTextAreaElement | null = null
  private editor: CodeMirror.Editor | null = null

  public render () {
    return (
      <textarea
        ref={this.updateEditorContainer}
      />
    )
  }

  public componentWillReceiveProps (nextProps: MarkdownEditorProps) {
    const { value } = nextProps
    if (this.editor && this.editor.getValue() !== value) this.editor.setValue(value)
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
    if (this.editorContainer) {
      const codeMirrorSettings = this.getCodeMirrorSettings()
      this.editor = CodeMirror.fromTextArea(this.editorContainer, codeMirrorSettings)
      this.initializeEditor(this.editor)
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
  }
}

export default withDefaultProps({
  value: '',
})(MarkdownEditor)
