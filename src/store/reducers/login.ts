import { Reducer } from 'redux'
import { LoginActions, UpdateLoginAction, ClearLoginAction } from '../actions/login'
import { handleActions } from '@/utils/reduxHelper'
import { User } from '@/models'

export interface LoginStateProperty {
  user?: User,
  accessToken?: string
}

export interface LoginState {
  login: LoginStateProperty
}

export const defaultState: LoginStateProperty = {}

export const updateLoginReducer: Reducer<LoginStateProperty, UpdateLoginAction> =
  (_, action) => ({
    user: action.user,
    accessToken: action.accessToken,
  })

export const clearLoginReducer: Reducer<LoginStateProperty, ClearLoginAction> =
  () => ({})

export default handleActions({
  [LoginActions.UpdateLogin]: updateLoginReducer,
  [LoginActions.ClearLogin]: clearLoginReducer,
}, defaultState)
