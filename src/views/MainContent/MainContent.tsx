import React, { StatelessComponent } from 'react'
import styles from './MainContent.scss'

export interface MainContentProps {
  span?: number
}

const MainContent: StatelessComponent<MainContentProps>
= ({ span, ...children }) => (
  <div
    className={styles[`main_content_${span}`]}
  >
    <div
      className={styles.main_content}
      {...children}
    />
  </div>
)

MainContent.defaultProps = {
  span: 24,
}

export default MainContent
