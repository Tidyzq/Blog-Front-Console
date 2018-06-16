import React, { StatelessComponent, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { List, Tag } from 'antd'
import { Document, User } from '@/models'
import TimeFromNow from '@/components/TimeFromNow'
import styles from './Item.scss'

export interface DocumentItemProps {
  document: Document
  author: User | undefined
}

const DocumentItemType: StatelessComponent<{ type: string }>
= ({ type }) => (
  <Tag className={styles[`type--${type}`]}>{type}</Tag>
)

const DocumentItemTitle: StatelessComponent<{ title: string }>
= ({ title }) => (
  <Fragment>{title}</Fragment>
)

const DocumentItemDetail: StatelessComponent<{ type: string, author: User | undefined, modifiedAt: number }>
 = ({ type, author, modifiedAt }) => (
  <Fragment>
    <DocumentItemType type={type} />
    {author === undefined ? null : (
      <span className={styles.detail}>{author.username}</span>
    )}
    <span className={styles.detail}><TimeFromNow date={modifiedAt}/></span>
  </Fragment>
)

const DocumentItem: StatelessComponent<DocumentItemProps>
= ({ document, author }) => (
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
          author={author}
          modifiedAt={document.modifiedAt}
        />
      }
    />
  </List.Item>
)

export default DocumentItem
