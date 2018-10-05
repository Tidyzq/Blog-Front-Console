import React, { PureComponent, Fragment } from 'react'
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Input, Divider, Button, Modal, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { mapValues } from 'lodash'
import { Bind } from 'lodash-decorators'

import UserChangePasswordModal from '@/views/Users/UserChangePasswordModal'
import { State } from '@/store'
import { User } from '@/models/User'
import { fetchUser, updateUser, deleteUser } from '@/store/actions/users'
import { Breadcrumb, BreadcrumbItem, Portal as HeaderPortal, Button as HeaderButton } from '@/views/Header'

import { userSelector, loginUserSelector } from './selector'
import SelectImageInput from '@/views/SelectImageModal/SelectImageInput'

export interface UserDetailProps extends RouteComponentProps<{ id: string }>, FormComponentProps {
  id: number,
  user: User | undefined,
  loginUser: User | undefined,
  isSelf: boolean,
  fetchUser: typeof fetchUser,
  updateUser: typeof updateUser,
  deleteUser: typeof deleteUser,
}

export interface UserDetailState {
  changePasswordModalVisible: boolean,
}

class UserDetail extends PureComponent<UserDetailProps, UserDetailState> {

  public state: UserDetailState = {
    changePasswordModalVisible: false,
  }

  private formItemLayout = {
    labelCol: {
      sm: { span: 4 },
      xs: { span: 24 },
    },
    wrapperCol: {
      sm: { span: 16 },
      xs: { span: 24 },
    },
  }

  private formButtonLayout = {
    wrapperCol: {
      sm: { span: 16, offset: 4 },
      xs: { span: 24 },
    },
  }

  public componentDidMount () {
    const { id, fetchUser } = this.props
    fetchUser(id)
  }

  public componentWillUpdate (nextProps: UserDetailProps) {
    const { id: prevId } = this.props
    const { id: nextId, fetchUser } = nextProps
    if (prevId !== nextId) {
      fetchUser(nextId)
    }
  }

  public render () {
    const { id, user, isSelf, form: { getFieldDecorator } } = this.props
    return !user ? null : (
      <Fragment>
        <HeaderPortal>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/users">Users</Link></BreadcrumbItem>
            <BreadcrumbItem>{user ? user.username : id}</BreadcrumbItem>
          </Breadcrumb>
          {!isSelf ? null : (
            <HeaderButton type="primary" onClick={this.onSave}>Save</HeaderButton>
          )}
        </HeaderPortal>
        <Form layout="horizontal">
          <Form.Item label="ID:" {...this.formItemLayout}>{user.id}</Form.Item>
          <Form.Item label="Avatar:" {...this.formItemLayout}>
            {isSelf ? getFieldDecorator('avatar')(
              <SelectImageInput />,
            ): (
              <div style={{ width: '100px', maxWidth: '100%' }}>
                <img src={user.avatar} style={{ width: '100%' }} />
              </div>
            )}
          </Form.Item>
          <Form.Item label="Username:" {...this.formItemLayout}>
            {isSelf ? getFieldDecorator('username')(
              <Input />,
            ) : (
              user.username
            )}
          </Form.Item>
          <Form.Item label="Email:" {...this.formItemLayout}>
            {isSelf ? getFieldDecorator('email')(
              <Input />,
            ) : (
              user.email
            )}
          </Form.Item>
          {!isSelf ? null : (
            <Fragment>
              <Divider />
              <Form.Item {...this.formButtonLayout}>
                <Button
                  type="danger"
                  style={{ width: '100%' }}
                  onClick={() => this.setState({ changePasswordModalVisible: true })}
                >
                  Change Password
                </Button>
                <UserChangePasswordModal
                  user={user}
                  visible={this.state.changePasswordModalVisible}
                  onClose={() => this.setState({ changePasswordModalVisible: false })}
                />
              </Form.Item>
              <Divider />
              <Form.Item {...this.formButtonLayout}>
                <Button type="danger" style={{ width: '100%' }} onClick={this.onDelete}>Delete</Button>
              </Form.Item>
            </Fragment>
          )}
        </Form>
      </Fragment>
    )
  }

  private validateFields () {
    const { form: { validateFields } } = this.props
    return new Promise<User>((resolve, reject) => {
      validateFields((errors: any, values: User) => {
        if (errors) return reject(errors)
        resolve(values)
      })
    })
  }

  @Bind()
  private async onSave () {
    try {
      const { isSelf, user, updateUser } = this.props
      if (!isSelf || !user) return
      const validatedUser = await this.validateFields()
      const newUser: User = { ...user, ...validatedUser }
      await updateUser(newUser)
      message.success(`User "${newUser.username}" has been saved`)
    } catch (e) {
      message.error(e.message)
      console.error(e)
    }
  }

  @Bind()
  private async onDelete () {
    const { isSelf, user, deleteUser, history } = this.props
    if (!isSelf || !user) return
    Modal.confirm({
      content: `Are you sure to delete user "${user.username}"?`,
      onOk: async () => {
        try {
          await deleteUser(user.id)
          message.success(`User "${user.username}" has been deleted`)
          history.push('/users')
        } catch (e) {
          message.error(e.message)
          console.error(e)
        }
      },
    })
  }
}

export default withRouter(
  connect((state: State, ownProps: RouteComponentProps<{ id: string }>) => {
    const id = parseInt(ownProps.match.params.id, 10)
    const user = userSelector(state)(id)
    const loginUser = loginUserSelector(state)
    const isSelf = Boolean(user && loginUser && user.id === loginUser.id)
    return {
      id,
      user,
      loginUser,
      isSelf,
    }
  }, {
    fetchUser,
    updateUser,
    deleteUser,
  })(
    Form.create({
      mapPropsToFields: ({ user }: UserDetailProps) => mapValues(user, value => Form.createFormField({ value })),
    })(
      UserDetail,
    ),
  ),
)
