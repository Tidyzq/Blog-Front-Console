import { ActionCreator, Action } from 'redux'
import { auth } from '@/api'
import { createThunkAction } from '@/utils/reduxHelper'
import { User } from '@/models/types'

export enum LoginActions {
  UpdateLogin = 'UpdateLogin',
  ClearLogin = 'ClearLogin',
}

export interface UpdateLoginAction extends Action<LoginActions.UpdateLogin> {
  user: User
  accessToken: string
}

export type ClearLoginAction = Action<LoginActions.ClearLogin>

export type AnyLoginAction = UpdateLoginAction | ClearLoginAction

export const updateLogin = (user: User, accessToken: string): UpdateLoginAction => ({
  type: LoginActions.UpdateLogin,
  user,
  accessToken,
})

export const clearLogin = (): ClearLoginAction => ({
  type: LoginActions.ClearLogin,
})

export const login = (body: { email: string, password: string }) => createThunkAction(async dispatch => {
  try {
    const { data: { user, accessToken } } = await auth.login(body)
    dispatch(updateLogin(user, accessToken))
  } catch (e) {
    dispatch(clearLogin())
  }
})

export const checkLogin = () => createThunkAction(async dispatch => {
  try {
    await auth.checkLogin()
    // do nothing if login is valid
  } catch (e) {
    dispatch(clearLogin())
  }
})

export const logout: ActionCreator<ClearLoginAction> = clearLogin
