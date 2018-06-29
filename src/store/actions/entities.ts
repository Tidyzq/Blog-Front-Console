import { Action } from 'redux'
import { Document, User, Tag, TagDocument } from '@/models'

export enum EntitiesActions {
  UpdateDocumentEntity = 'UpdateDocumentEntity',
  UpdateUserEntity = 'UpdateUserEntity',
  UpdateTagEntity = 'UpdateTagEntity',
  UpdateTagDocumentEntity = 'UpdateTagDocumentEntity',
}

export type UpdateDocumentEntityAction = Action<EntitiesActions.UpdateDocumentEntity> & {
  id: number
  document: Document | undefined
}

export type UpdateUserEntityAction = Action<EntitiesActions.UpdateUserEntity> & {
  id: number
  user: User | undefined
}

export type UpdateTagEntityAction = Action<EntitiesActions.UpdateTagEntity> & {
  id: number
  tag: Tag | undefined
}

export type UpdateTagDocumentEntityAction = Action<EntitiesActions.UpdateTagDocumentEntity> & {
  tagId: number
  documentId: number
  tagDocument: TagDocument | undefined
}

export type AnyEntityAction = UpdateDocumentEntityAction | UpdateUserEntityAction | UpdateTagEntityAction | UpdateTagDocumentEntityAction

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

export const updateTagEntity = (id: number, tag: Tag | undefined): UpdateTagEntityAction => ({
  type: EntitiesActions.UpdateTagEntity,
  id,
  tag,
})

export const updateTagDocumentEntity = (tagId: number, documentId: number, tagDocument: TagDocument | undefined): UpdateTagDocumentEntityAction => ({
  type: EntitiesActions.UpdateTagDocumentEntity,
  tagId,
  documentId,
  tagDocument,
})
