import { handleActions } from 'redux-actions'
import { Reducer } from 'redux'
import { Actions, ILoginAction, ICheckLoginAction } from '../actions/login'
import { IUser } from '@/models/types'

export interface IReduxLogin {
  login: IReduxLoginProperty
}

export interface IReduxLoginProperty {
  user?: IUser,
  accessToken?: string
}

export default handleActions<IReduxLoginProperty, any>({
  [Actions.Login]: (_: IReduxLoginProperty, action: ILoginAction) => ({
    user: action.error ? undefined : action.payload!.data.user,
    accessToken: action.error ? undefined : action.payload!.data.accessToken,
  }),
  [Actions.CheckLogin]: (state: IReduxLoginProperty, action: ICheckLoginAction) => ({
    user: action.error ? undefined : state.user,
    accessToken: action.error ? undefined : state.accessToken,
  }),
  [Actions.Logout]: () => ({}),
}, {}) as Reducer<IReduxLoginProperty, any>
