import { Reducer } from 'redux'
import { handleActions } from '@/utils/redux'
import {
  RelationsActions,
  UpdateTagToDocumentsRelationAction,
  UpdateDocumentToTagsRelationAction,
} from '@/store/actions/relations'

export interface RelationsStateProperty {
  tagToDocuments: { [tagId: number]: number[] | undefined }
  documentToTags: { [documentId: number]: number[] | undefined }
}

export interface RelationsState {
  relations: RelationsStateProperty
}

export const defaultState: RelationsStateProperty = {
  tagToDocuments: {},
  documentToTags: {},
}

export const updateTagToDocumentsRelationReducer: Reducer<RelationsStateProperty, UpdateTagToDocumentsRelationAction> =
(state, action) => ({
  ...state!,
  tagToDocuments: {
    ...state!.tagToDocuments,
    [action.tagId]: action.documentIds,
  },
})

export const updateDocumentToTagsRelationReducer: Reducer<RelationsStateProperty, UpdateDocumentToTagsRelationAction> =
(state, action) => ({
  ...state!,
  documentToTags: {
    ...state!.documentToTags,
    [action.documentId]: action.tagIds,
  },
})

export default handleActions({
  [RelationsActions.UpdateTagToDocumentsRelation]: updateTagToDocumentsRelationReducer,
  [RelationsActions.UpdateDocumentToTagsRelation]: updateDocumentToTagsRelationReducer,
}, defaultState)
