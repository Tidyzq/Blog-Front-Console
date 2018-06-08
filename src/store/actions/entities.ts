import { Action } from 'redux'
import { Document, User } from '@/models/types'

export enum EntitiesActions {
  UpdateDocumentEntity = 'UpdateDocumentEntity',
  UpdateUserEntity = 'UpdateUserEntity',
}

export type UpdateDocumentEntityAction = Action<EntitiesActions.UpdateDocumentEntity> & {
  id: number
  document: Document | undefined
}

export type UpdateUserEntityAction = Action<EntitiesActions.UpdateUserEntity> & {
  id: number
  user: User | undefined
}

export type AnyEntityAction = UpdateDocumentEntityAction | UpdateUserEntityAction

export const updateDocumentEntity = (id: number, document: Document | undefined): UpdateDocumentEntityAction => ({
  type: EntitiesActions.UpdateDocumentEntity,
  id,
  document,
})

export const updateUserEntity = (id: number, user: User | undefined): UpdateUserEntityAction => ({
  type: EntitiesActions.UpdateUserEntity,
  id,
  user,
})
