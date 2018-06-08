import React, { StatelessComponent } from 'react'
import { Layout } from 'antd'
import { PortalTarget } from './Portal'
import styles from './Header.scss'

export interface HeaderProps { }

const Header = (_ => (
  <Layout.Header className={styles.header}>
    <PortalTarget />
  </Layout.Header>
)) as StatelessComponent<HeaderProps>

export default Header
