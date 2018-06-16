import React, { StatelessComponent } from 'react'
import { Link } from 'react-router-dom'
import { List, Avatar } from 'antd'
import { User } from '@/models/User'

export interface DocumentItemProps {
  user: User
}

const DocumentItem: StatelessComponent<DocumentItemProps>
  = ({ user }) => (
    <List.Item actions={[
      <Link key="detail" to={`/users/${user.id}`}>Detail</Link>,
    ]}>
      <List.Item.Meta
        avatar={<Avatar src={user.avatar} />}
        title={user.username}
        description={user.email}
      />
    </List.Item>
  )

export default DocumentItem
