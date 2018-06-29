import { Reducer } from 'redux'

import { Setting } from '@/models'
import { handleActions } from '@/utils/redux'
import {
  SettingsActions,
  UpdateSettingsAction,
} from '@/store/actions/settings'

export type SettingsStateProperty = Setting | {}

export interface SettingsState {
  settings: SettingsStateProperty
}

export const defaultState: SettingsStateProperty = {}

export const updateSettingsReducer: Reducer<SettingsStateProperty, UpdateSettingsAction> =
(_, action) => action.settings

export default handleActions({
  [SettingsActions.UpdateSettings]: updateSettingsReducer,
}, defaultState)
