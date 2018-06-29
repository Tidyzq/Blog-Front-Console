import { Reducer } from 'redux'
import { User, Document, Tag } from '@/models'
import { handleActions } from '@/utils/redux'
import {
  EntitiesActions,
  UpdateDocumentEntityAction,
  UpdateUserEntityAction,
  UpdateTagEntityAction,
} from '@/store/actions/entities'

export interface EntitiesStateProperty {
  documents: { [id: number]: Document | undefined }
  users: { [id: number]: User | undefined }
  tags: { [id: number]: Tag | undefined }
}

export interface EntitiesState {
  entities: EntitiesStateProperty
}

export const defaultState: EntitiesStateProperty = {
  documents: {},
  users: {},
  tags: {},
}

export const updateDocumentEntityReducer: Reducer<EntitiesStateProperty, UpdateDocumentEntityAction> =
(state, action) => ({
  ...state!,
  documents: {
    ...state!.documents,
    [action.id]: action.document,
  },
})

export const updateUserEntityReducer: Reducer<EntitiesStateProperty, UpdateUserEntityAction> =
(state, action) => ({
  ...state!,
  users: {
    ...state!.users,
    [action.id]: action.user,
  },
})

export const updateTagEntityReducer: Reducer<EntitiesStateProperty, UpdateTagEntityAction> =
(state, action) => ({
  ...state!,
  tags: {
    ...state!.tags,
    [action.id]: action.tag,
  },
})

// export const updateTagDocumentEntityReducer: Reducer<EntitiesStateProperty, UpdateTagDocumentEntityAction> =
// (state, action) => ({
//   tagDocuments: {
//     ...state!.tagDocuments,
//     [action.tagId]: {
//       ...state!.tagDocuments[action.tagId],
//       [action.documentId]: action.tagDocument,
//     },
//   },
//   ...state!,
// })

export default handleActions({
  [EntitiesActions.UpdateDocumentEntity]: updateDocumentEntityReducer,
  [EntitiesActions.UpdateUserEntity]: updateUserEntityReducer,
  [EntitiesActions.UpdateTagEntity]: updateTagEntityReducer,
  // [EntitiesActions.UpdateTagDocumentEntity]: updateTagDocumentEntityReducer,
}, defaultState)
