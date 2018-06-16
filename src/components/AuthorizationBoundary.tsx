import { PureComponent, ReactNode } from 'react'
import { connect } from 'react-redux'
import withDefaultProps from '@/components/withDefaultProps'
import { checkLogin } from '@/store/actions/login'
import { State } from '@/store'

export interface AuthorizationProps {
  accessToken: string | undefined
  checkLogin: typeof checkLogin
  unauthorized: () => ReactNode
}

class AuthorizationBoundary extends PureComponent<AuthorizationProps, {}> {
  public componentDidMount () {
    const { accessToken, checkLogin } = this.props
    if (accessToken !== undefined) {
      checkLogin()
    }
  }
  public render () {
    const { accessToken, children, unauthorized } = this.props
    const isLogin = accessToken !== undefined
    return isLogin ? children : unauthorized()
  }
}

export default connect((state: State) => ({
  accessToken: state.login.accessToken,
}), {
  checkLogin,
})(
  withDefaultProps({
    unauthorized: () => null as ReactNode,
  })(AuthorizationBoundary),
)
