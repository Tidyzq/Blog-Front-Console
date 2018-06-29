import React, { StatelessComponent } from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Input, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

import { User } from '@/models'
import { changeUserPassword } from '@/store/actions/users'

export interface UserChangePasswordModalProps extends FormComponentProps {
  user: User,
  visible: boolean,
  onClose: () => any,
  changeUserPassword: typeof changeUserPassword,
}

const UserChangePasswordModal: StatelessComponent<UserChangePasswordModalProps> =
({ user, visible, onClose, changeUserPassword, form: { getFieldValue, validateFields, getFieldDecorator } }) => (
  <Modal
    title="Change Password"
    visible={visible}
    onCancel={onClose}
    onOk={() => {
      validateFields(async (errors, { newPassword, oldPassword }: { newPassword: string, oldPassword: string }) => {
        try {
          if (errors) throw errors
          await changeUserPassword(user.id, newPassword, oldPassword)
          message.success(`User "${user.username}" has been saved`)
          onClose()
        } catch (e) {
          message.error(e.message)
          console.error(e)
        }
      })
    }}
  >
    <Form>
      <Form.Item label="Old Password">
        {getFieldDecorator('oldPassword', { rules: [{ required: true, message: 'Please input old password' }] })(
          <Input type="password" />,
        )}
      </Form.Item>
      <Form.Item label="New Password">
        {getFieldDecorator('newPassword', { rules: [{ required: true, message: 'Please input new password' }] })(
          <Input type="password" />,
        )}
      </Form.Item>
      <Form.Item label="Repeat New Password">
        {getFieldDecorator('repeatNewPassword', {
          rules: [{
            required: true, message: 'Please repeat new password',
          }, {
            validator: (_, value, callback) => {
              if (value && value !== getFieldValue('newPassword')) {
                callback('Two passwords that you enter is inconsistent!')
              } else {
                callback()
              }
            },
          }],
        })(
          <Input type="password" />,
        )}
      </Form.Item>
    </Form>
  </Modal>
)

export default
connect(null, {
  changeUserPassword,
})(
  Form.create()(
    UserChangePasswordModal,
  ),
)
