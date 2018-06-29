import { Action } from 'redux'

import { createThunkAction } from '@/utils/redux'
import { setting as settingAPI } from '@/api'
import { Setting } from '@/models'

import { createThunkActionWithAccessToken } from './login'

export enum SettingsActions {
  UpdateSettings = 'UpdateSettings',
}

export type UpdateSettingsAction = Action<SettingsActions.UpdateSettings> & {
  settings: Setting
}

export const updateSettingsState = (settings: Setting): UpdateSettingsAction => ({
  type: SettingsActions.UpdateSettings,
  settings,
})

export const fetchSettings = () => createThunkAction(async dispatch => {
  const { data: settings } = await settingAPI.get()
  dispatch(updateSettingsState(settings))
  return settings
})

export const updateSettings = (settings: Setting) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  await settingAPI.update(accessToken, settings)
  dispatch(updateSettingsState(settings))
  return settings
})
