import React, { Component } from 'react'
import { Bind, Throttle } from 'lodash-decorators'
import { editor, languages } from 'monaco-editor'
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker.js'
import * as extendMarkdown from './language/extendMarkdown'

export interface IEditorProps { }

export interface IEditorState { }

const LANGUAGE_ID = 'extendedMarkdown'

const EditorConfig: editor.IEditorConstructionOptions = {
  language: LANGUAGE_ID,
  wordWrap: 'on',
  minimap: {
    enabled: false,
  },
}

function initializeMonacoEditor () {
  (window as any).MonacoEnvironment = {
    getWorker: () => new EditorWorker(),
  }
  languages.register({
    id: LANGUAGE_ID,
    extensions: [],
    aliases: [],
  })
  languages.setMonarchTokensProvider(LANGUAGE_ID, extendMarkdown.language)
  languages.setLanguageConfiguration(LANGUAGE_ID, extendMarkdown.conf)
}

class Editor extends Component<IEditorProps, IEditorState> {

  private editorContainer: HTMLDivElement | null = null
  private editor: editor.IStandaloneCodeEditor | null = null

  public componentWillMount () {
    initializeMonacoEditor()
    window.addEventListener('resize', this.updateEditorLayout)
  }

  public render () {
    return (
      <div
        style={{
          flex: 'auto',
          overflow: 'hidden',
          width: '100%',
        }}
        ref={this.updateEditorContainer}
      />
    )
  }

  public componentWillUnmount () {
    window.removeEventListener('resize', this.updateEditorLayout)
  }

  @Bind()
  private updateEditorContainer (editorContainer: HTMLDivElement | null) {
    this.editorContainer = editorContainer
    if (this.editorContainer) {
      this.editor = editor.create(this.editorContainer, EditorConfig)
      // this.editor.getModel().onDidChangeContent(console.log)
      setTimeout(this.updateEditorLayout, 0) // setTimeout 从而能够在Container计算到正确宽高后更新
    }
  }

  @Throttle(100)
  @Bind()
  private updateEditorLayout () {
    if (this.editor && this.editorContainer) {
      this.editor.layout({
        height: this.editorContainer.clientHeight,
        width: this.editorContainer.clientWidth,
      })
    }
  }
}

export default Editor
