import login, { LoginState } from './login'
import entities, { EntitiesState } from './entities'
import relations, { RelationsState } from './relations'
import settings, { SettingsState } from './settings'
import { combineReducers } from 'redux'

export type State = LoginState & EntitiesState & RelationsState & SettingsState

export default combineReducers<State>({
  login,
  entities,
  relations,
  settings,
})
