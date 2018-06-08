import React, { StatelessComponent } from 'react'
import * as Markdown from '@/utils/markdown'
import styles from '@/styles/markdown.scss'
import withDefaultProps from '@/components/withDefaultProps'

export interface MarkdownViewProps {
  value: string
}

const MarkdownView: StatelessComponent<MarkdownViewProps> = ({ value }) => (
  <div
    className={styles.markdown_view}
    dangerouslySetInnerHTML={{ __html: Markdown.render(Markdown.parse(value)) as string }}
  />
)

export default withDefaultProps({
  value: '',
}, MarkdownView)
