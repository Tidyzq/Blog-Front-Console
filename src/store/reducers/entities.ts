import { Reducer } from 'redux'
import { User, Document } from '@/models'
import { handleActions } from '@/utils/reduxHelper'
import { EntitiesActions, UpdateDocumentEntityAction, UpdateUserEntityAction } from '../actions/entities'

export interface EntitiesStateProperty {
  documents: { [id: number]: Document | undefined }
  users: { [id: number]: User | undefined }
}

export interface EntitiesState {
  entities: EntitiesStateProperty
}

export const defaultState: EntitiesStateProperty = {
  documents: {},
  users: {},
}

export const updateDocumentEntityReducer: Reducer<EntitiesStateProperty, UpdateDocumentEntityAction> =
(state, action) => ({
  documents: {
    ...state!.documents,
    [action.id]: action.document,
  },
  users: state!.users,
})

export const updateUserEntityReducer: Reducer<EntitiesStateProperty, UpdateUserEntityAction> =
(state, action) => ({
  documents: state!.documents,
  users: {
    ...state!.users,
    [action.id]: action.user,
  },
})

export default handleActions({
  [EntitiesActions.UpdateDocumentEntity]: updateDocumentEntityReducer,
  [EntitiesActions.UpdateUserEntity]: updateUserEntityReducer,
}, defaultState)
