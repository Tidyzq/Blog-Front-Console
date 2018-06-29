import { user as userAPI } from '@/api'
import { createThunkAction } from '@/utils/redux'
import { User } from '@/models'
import { createThunkActionWithAccessToken } from './login'
import { updateUserEntity } from './entities'

export const fetchUsers = () => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  try {
    const { data: users } = await userAPI.getAll(accessToken)
    for (const user of users) {
      dispatch(updateUserEntity(user.id, user))
    }
    const idList = users.map(({ id }) => id)
    return idList
  } catch (e) {
    throw e
  }
})

export const fetchUser = (id: number) => createThunkAction(async dispatch => {
  try {
    const { data: user } = await userAPI.getById(id)
    dispatch(updateUserEntity(id, user))
    return user
  } catch (e) {
    throw e
  }
})

export const createUser = (user: User) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  try {
    const { data: returnedUser } = await userAPI.create(accessToken, user)
    dispatch(updateUserEntity(returnedUser.id, returnedUser))
    return returnedUser
  } catch (e) {
    throw e
  }
})

export const updateUser = (user: User) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  try {
    const { data: returnedUser } = await userAPI.update(accessToken, user.id, user)
    dispatch(updateUserEntity(user.id, returnedUser))
  } catch (e) {
    throw e
  }
})

export const changeUserPassword = (id: number, newPassword: string, oldPassword: string) => createThunkActionWithAccessToken(async accessToken => {
  try {
    await userAPI.changePassword(accessToken, id, { newPassword, oldPassword })
  } catch (e) {
    throw e
  }
})

export const deleteUser = (id: number) => createThunkActionWithAccessToken(async (accessToken, dispatch) => {
  try {
    await userAPI.delete(accessToken, id)
    dispatch(updateUserEntity(id, undefined))
  } catch (e) {
    throw e
  }
})
