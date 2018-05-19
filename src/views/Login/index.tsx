import React, { StatelessComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Button, Input, Row, Col } from 'antd'
import Form, { FormComponentProps } from 'antd/lib/form'
import Icon from '@/components/Icon'
import { IRedux } from '@/store'
import { login } from '@/store/actions/login'
import styles from './index.scss'

export interface ILoginProps extends FormComponentProps {
  accessToken: string | undefined
  login: (data: { email: string, password: string }) => any
}

const Login = (({ accessToken, login, form: { getFieldDecorator, validateFields } }) => (
  accessToken === undefined ? (
    <Row className={styles.row} type="flex" justify="center" align="middle">
      <Col xs={20} sm={18} md={16} lg={12} xl={10}>
        <Form onSubmit={e => { e.preventDefault(); validateFields((err, values) => err || login(values))}}>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(
              <Input placeholder="Email" prefix={
                <Icon type="envelope" className={styles.input_icon} />
              }/>,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input type="password" placeholder="Password" prefix={
                <Icon type="lock" className={styles.input_icon} />
              }/>,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.submit}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  ) : (
    <Redirect to="/"/>
  )
)) as StatelessComponent<ILoginProps>

export default Form.create()(
  connect((state: IRedux) => ({
    accessToken: state.login.accessToken,
  }), {
    login,
  })(Login),
)
