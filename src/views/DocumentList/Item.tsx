import React, { StatelessComponent, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { List, Tag } from 'antd'
import { Document } from '@/models/types'
import styles from './Item.scss'

export interface DocumentItemProps {
  document: Document
}

const DocumentItemType: StatelessComponent<{ type: string }>
= ({ type }) => (
  <Tag className={styles[`type--${type}`]}>{type}</Tag>
)

const DocumentItemTitle: StatelessComponent<{ title: string }>
= ({ title }) => (
  <Fragment>{title}</Fragment>
)

const DocumentItemDetail: StatelessComponent<{ type: string, author: number, modifiedAt: number }>
 = ({ type, author, modifiedAt }) => (
  <Fragment>
    <DocumentItemType type={type} />
    <span className={styles.detail}>{author}</span>
    <span className={styles.detail}>{modifiedAt}</span>
  </Fragment>
)

const DocumentItem: StatelessComponent<DocumentItemProps>
= ({ document }) => (
  <List.Item actions={[
    <Link key="detail" to={`/documents/${document.id}`}>Detail</Link>,
    <Link key="edit" to={`/editor/${document.id}`}>Edit</Link>,
  ]}>
    <List.Item.Meta
      title={
        <DocumentItemTitle
          title={document.title}
        />
      }
      description={
        <DocumentItemDetail
          type={document.type}
          author={document.author}
          modifiedAt={document.modifiedAt}
        />
      }
    />
  </List.Item>
)

export default DocumentItem
