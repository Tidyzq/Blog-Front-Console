import React, { StatelessComponent } from 'react'
import styles from './index.scss'

export interface IMainContentProps {
  span?: number
}

const MainContent: StatelessComponent<IMainContentProps>
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
