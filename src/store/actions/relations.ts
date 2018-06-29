import { Action } from 'redux'

export enum RelationsActions {
  UpdateTagToDocumentsRelation = 'UpdateTagToDocumentsRelation',
  UpdateDocumentToTagsRelation = 'UpdateDocumentToTagsRelation',
}

export type UpdateTagToDocumentsRelationAction = Action<RelationsActions.UpdateTagToDocumentsRelation> & {
  tagId: number
  documentIds: number[]
}

export type UpdateDocumentToTagsRelationAction = Action<RelationsActions.UpdateDocumentToTagsRelation> & {
  documentId: number
  tagIds: number[]
}

export const updateTagToDocumentsRelation = (tagId: number, documentIds: number[]): UpdateTagToDocumentsRelationAction => ({
  type: RelationsActions.UpdateTagToDocumentsRelation,
  tagId,
  documentIds,
})

export const updateDocumentToTagsRelation = (documentId: number, tagIds: number[]): UpdateDocumentToTagsRelationAction => ({
  type: RelationsActions.UpdateDocumentToTagsRelation,
  documentId,
  tagIds,
})
