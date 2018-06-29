import { State } from '@/store'
import { compact } from 'lodash'

export const documentSelector = (state: State) => (id: number) => state.entities.documents[id]

export const tagsSelector = (state: State) => (id: number) =>
  compact(state.relations.documentToTags[id])