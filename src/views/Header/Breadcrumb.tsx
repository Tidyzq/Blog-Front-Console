import React, { StatelessComponent } from 'react'
import AntdBreadcrumb from 'antd/lib/breadcrumb'
import styles from './Breadcrumb.scss'

const BreadCrumbItem = AntdBreadcrumb.Item

const BreadCrumb = (({ children }) => (
  <AntdBreadcrumb className={styles.breadcrumb}>{children}</AntdBreadcrumb>
)) as StatelessComponent<{}> & { Item: typeof BreadCrumbItem }

BreadCrumb.Item = BreadCrumbItem

export default BreadCrumb
