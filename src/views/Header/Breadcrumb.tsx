import React, { StatelessComponent } from 'react'
import { Breadcrumb as AntdBreadcrumb } from 'antd'
import styles from './Breadcrumb.scss'

const Breadcrumb = (({ children }) => (
  <AntdBreadcrumb className={styles.breadcrumb}>{children}</AntdBreadcrumb>
)) as StatelessComponent<{}>

export const BreadcrumbItem = AntdBreadcrumb.Item

export default Breadcrumb
