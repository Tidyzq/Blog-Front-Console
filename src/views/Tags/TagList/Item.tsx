import React, { StatelessComponent } from 'react'
import { Link } from 'react-router-dom'
import { List } from 'antd'
import { Tag } from '@/models'

export interface TagItemProps {
  tag: Tag
}

const TagItem: StatelessComponent<TagItemProps>
  = ({ tag }) => (
    <List.Item actions={[
      <Link key="detail" to={`/tags/${tag.id}`}>Detail</Link>,
    ]}>
      <List.Item.Meta
        title={tag.name}
        description={`/${tag.url}`}
      />
    </List.Item>
  )

export default TagItem
