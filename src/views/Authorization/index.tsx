import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { bindAuthorization } from '@/api'
import { IRedux } from '@/store'
import { checkLogin } from '@/store/actions/login'

export interface IAuthorizationProps {
  accessToken: string | undefined
  checkLogin: () => any
}

class Authorization extends PureComponent<IAuthorizationProps, {}> {

  public componentWillMount () {
    const { accessToken, checkLogin } = this.props
    bindAuthorization(() => this.props.accessToken)
    if (accessToken !== undefined) {
      checkLogin()
    }
  }

  public render () {
    const { accessToken, children } = this.props
    const isLogin = accessToken !== undefined
    return isLogin ? children :
      <Redirect to="/login"/>
  }
}

export default connect((state: IRedux) => ({
  accessToken: state.login.accessToken,
}), {
  checkLogin,
})(Authorization)
