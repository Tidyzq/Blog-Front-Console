import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { bindAuthorization } from '@/api'
import { checkLogin } from '@/store/actions/login'
import { State } from '@/store'
import { accessTokenSelector } from './selector'

export interface AuthorizationProps {
  accessToken: string | undefined
  checkLogin: typeof checkLogin
}

class Authorization extends PureComponent<AuthorizationProps, {}> {

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

export default connect((state: State) => ({
  accessToken: accessTokenSelector(state),
}), {
  checkLogin,
})(Authorization)
