import React, { StatelessComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Button, Input, Row, Col, Form } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

import Icon from '@/components/Icon'
import { State } from '@/store'
import { login } from '@/store/actions/login'

import { accessTokenSelector } from './selector'
import styles from './Login.scss'

export interface LoginProps extends FormComponentProps {
  accessToken: string | undefined
  login: (data: { email: string, password: string }) => any
}

const Login = (({ accessToken, login, form: { getFieldDecorator, validateFields } }) => (
  accessToken === undefined ? (
    <Row className={styles.row} type="flex" justify="center" align="middle">
      <Col xs={20} sm={18} md={16} lg={12} xl={10}>
        <Form onSubmit={e => { e.preventDefault(); validateFields((err: any, values: any) => err || login(values)) }}>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(
              <Input placeholder="Email" prefix={
                <Icon type="envelope" className={styles.input_icon} />
              } />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input type="password" placeholder="Password" prefix={
                <Icon type="lock" className={styles.input_icon} />
              } />,
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
      <Redirect to="/" />
    )
)) as StatelessComponent<LoginProps>

export default Form.create()(
  connect((state: State) => ({
    accessToken: accessTokenSelector(state),
  }), {
    login,
  })(Login),
)
