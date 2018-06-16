import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { List } from 'antd'

import { User } from '@/models'
import { State } from '@/store'
import { fetchUsers } from '@/store/actions/users'

import UserListItem from './UserListItem'
import { usersSelector } from './selector'
// import DocumentListItem from './Item'

export interface DocumentListProps {
  users: { [id: number]: User | undefined },
  fetchUsers: typeof fetchUsers,
}

export interface DocumentListState {
  userIdList: number[],
}

class DocumentList extends PureComponent<DocumentListProps, DocumentListState> {

  public state: DocumentListState = {
    userIdList: [],
  }

  public async componentDidMount () {
    const { fetchUsers } = this.props
    const userIdList = await fetchUsers()
    this.setState({ userIdList })
  }

  public render () {
    const { userIdList } = this.state
    const { users } = this.props
    return (
      <List itemLayout="horizontal" dataSource={undefined} renderItem={undefined}>
        {userIdList.map(id => {
          const user = users[id]
          if (!user) return null
          return (
            <UserListItem key={user.id} user={user} />
          )
        }).filter(Boolean)}
      </List>
    )
  }
}

export default connect((state: State) => ({
  users: usersSelector(state),
}), {
  fetchUsers,
})(DocumentList)
