import React, { StatelessComponent } from 'react'
import { render } from '@/utils/markdown'
import styles from '@/styles/markdown.scss'
import withDefaultProps from '@/components/withDefaultProps'

export interface MarkdownViewProps {
  value: string
}

const renderMarkdownIntoContent = (() => {
  let prevMarkdown: string
  return (content: HTMLElement | null, markdown: string) => {
    if (content && (!content.innerHTML || prevMarkdown !== markdown)) {
      prevMarkdown = markdown
      content.innerHTML = render(markdown)
    }
  }
})()

const MarkdownView: StatelessComponent<MarkdownViewProps> = ({ value }) => (
  <div
    className={styles.markdown_view}
    ref={content => renderMarkdownIntoContent(content, value)}
  />
)

export default withDefaultProps({
  value: '',
})(MarkdownView)
