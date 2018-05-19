import { createAction } from 'redux-actions'
import { Action } from 'redux-actions'
import { AxiosResponse } from 'axios'
import { Auth } from '@/api'
import { IUser } from '@/models/types'

export enum Actions {
  Login = 'Login',
  CheckLogin = 'CheckLogin',
  Logout = 'Logout',
}

export type ILoginAction = Action<AxiosResponse<{ user: IUser, accessToken: string }>>

export type ICheckLoginAction = Action<AxiosResponse<void>>

export type ILogoutAction = Action<void>

export const login = createAction(Actions.Login, Auth.login)

export const checkLogin = createAction(Actions.CheckLogin, Auth.checkLogin)

export const logout = createAction(Actions.Logout)
