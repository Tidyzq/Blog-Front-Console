import { ActionCreator, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { auth } from '@/api'
import { createThunkAction } from '@/utils/redux'
import { getErrorCode } from '@/utils/api'
import { User } from '@/models'
import { State } from '@/store'

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

export const checkLogin = () => createThunkActionWithAccessToken(async accessToken => {
  try {
    await auth.checkLogin(accessToken)
    // do nothing if login is valid
  } catch (e) {
    throw e
  }
})

export const createThunkActionWithAccessToken = <R, E, A extends Action>(thunkActionWithAccessToken: (accessToken: string, dispatch: ThunkDispatch<State, E, A>, getState: () => State, extraArgument: E) => Promise<R>) => createThunkAction<Promise<R>, State, E, A>(async (dispatch, getState, extraArgument) => {
  try {
    const { login: { accessToken }} = getState()
    if (!accessToken) throw new Error('No AccessToken')
    return await thunkActionWithAccessToken(accessToken, dispatch, getState, extraArgument)
  } catch (e) {
    const code = getErrorCode(e)
    if (code === 401) dispatch(clearLogin() as A)
    throw e
  }
})

export const logout: ActionCreator<ClearLoginAction> = clearLogin
