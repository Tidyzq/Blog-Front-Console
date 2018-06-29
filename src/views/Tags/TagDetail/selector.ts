import { State } from '@/store'
import { compact, map } from 'lodash'

export const tagSelector = (state: State) => (id: number) => state.entities.tags[id]

export const documentsSelector = (state: State) => (id: number) =>
  compact(map(state.relations.tagToDocuments[id], documentId => state.entities.documents[documentId]))
