import login, { IReduxLogin } from './login'
import { combineReducers } from 'redux'

export type IRedux = IReduxLogin

export default combineReducers<IRedux>({
  login,
})
