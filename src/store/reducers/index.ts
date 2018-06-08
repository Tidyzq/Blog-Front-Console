import login, { LoginState } from './login'
import entities, { EntitiesState } from './entities'
import { combineReducers } from 'redux'

export type State = LoginState & EntitiesState

export default combineReducers<State>({
  login,
  entities,
})
