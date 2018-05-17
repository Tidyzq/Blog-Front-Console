import * as React from 'react'
import styles from './App.css'

import logo from './logo.svg'

class App extends React.Component {
  public render () {
    return (
      <div className={styles.app}>
        <header className={styles.app_header}>
          <img src={logo} className={styles.app_logo} alt="logo" />
          <h1 className={styles.app_title}>Welcome to React</h1>
        </header>
        <p className={styles.app_intro}>
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App
