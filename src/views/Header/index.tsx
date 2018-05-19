import React, { StatelessComponent } from 'react'
import { Layout } from 'antd'
import { Portal, PortalTarget } from './Portal'
import Breadcrumb from './Breadcrumb'
import styles from './index.scss'

export interface IHeaderProps {}

const Header = (_ => (
  <Layout.Header className={styles.header}>
    <PortalTarget />
  </Layout.Header>
)) as StatelessComponent<IHeaderProps> & {
  Portal: typeof Portal
  Breadcrumb: typeof Breadcrumb
}

Header.Portal = Portal
Header.Breadcrumb = Breadcrumb

export default Header
