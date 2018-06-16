import React, { PureComponent, Fragment } from 'react'
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Avatar } from 'antd'

import { State } from '@/store'
import { User } from '@/models/User'
import { fetchUser } from '@/store/actions/users'
import { Breadcrumb, BreadcrumbItem, Portal as HeaderPortal } from '@/views/Header'

import { userSelector } from './selector'

export interface UserDetailProps extends RouteComponentProps<{ id: string }> {
  id: number,
  user: User | undefined,
  fetchUser: typeof fetchUser,
}

class UserDetail extends PureComponent<UserDetailProps, {}> {

  public componentDidMount () {
    const { id, fetchUser } = this.props
    fetchUser(id)
  }

  public render () {
    const { id, user } = this.props
    return !user ? null : (
      <Fragment>
        <HeaderPortal>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/users">Users</Link></BreadcrumbItem>
            <BreadcrumbItem>{user ? user.username : id}</BreadcrumbItem>
          </Breadcrumb>
          {/* <HeaderButton onClick={() => this.setState({ detailModalVisible: true })}>Detail</HeaderButton> */}
          {/* <HeaderButton type="primary"><Link to={`/editor/${id}`}>Edit</Link></HeaderButton> */}
        </HeaderPortal>
        <Form layout="vertical">
          <Form.Item label="Avatar:" labelCol={{ span: 8 }}><Avatar size="large" src={user.avatar}/></Form.Item>
          <Form.Item label="ID:" labelCol={{ span: 8 }}>{user.id}</Form.Item>
          <Form.Item label="Username:" labelCol={{ span: 8 }}>{user.username}</Form.Item>
          <Form.Item label="Email:" labelCol={{ span: 8 }}>{user.email}</Form.Item>
        </Form>
      </Fragment>
    )
  }
}

export default withRouter(
  connect((state: State, ownProps: RouteComponentProps<{ id: string }>) => {
    const id = parseInt(ownProps.match.params.id, 10)
    return {
      id,
      user: userSelector(state)(id),
    }
  }, {
    fetchUser,
  })(
    UserDetail,
  ),
)
