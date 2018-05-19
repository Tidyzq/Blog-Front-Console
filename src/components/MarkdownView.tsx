import React, { PureComponent } from 'react'
import { Bind } from 'lodash-decorators'
import * as Markdown from '@/utils/markdown'
import ScrollManager from '@/utils/scrollManager'
import styles from '@/styles/markdown.scss'

export interface IMarkdownViewProps {
  markdown: string
  scroll?: number
  updateScroll?: (scroll: number) => void
}

export default class MarkdownView extends PureComponent<IMarkdownViewProps> {

  private scrollManager = new ScrollManager(this.getScroll, this.setScroll, this.updateScroll)
  private container: HTMLDivElement | null = null

  public componentWillUpdate (nextProps: IMarkdownViewProps) {
    const currProps = this.props
    if (currProps.scroll !== nextProps.scroll && nextProps.scroll !== undefined) {
      this.scrollManager.scrollTo(nextProps.scroll)
    }
  }

  public render () {
    return (
      <div
        className={styles.markdown_view}
        onScroll={this.onScroll}
        ref={container => { this.container = container }}
        dangerouslySetInnerHTML={this.renderMarkdown()}
      />
    )
  }

  private renderMarkdown () {
    return {
      __html: Markdown.render(Markdown.parse(this.props.markdown || '')) as string,
    }
  }

  @Bind()
  private onScroll () {
    const { updateScroll } = this.props
    if (updateScroll) this.scrollManager.onScroll()
  }

  @Bind()
  private setScroll (scroll: number) {
    const { container } = this
    if (!container) return
    container.scrollTop = scroll * (container.scrollHeight - container.clientHeight)
  }

  @Bind()
  private getScroll (): number {
    const { container } = this
    if (!container) return 0
    return container.scrollTop / (container.scrollHeight - container.clientHeight)
  }

  @Bind()
  private updateScroll (scroll: number) {
    const { updateScroll } = this.props
    if (updateScroll) updateScroll(scroll)
  }
}
