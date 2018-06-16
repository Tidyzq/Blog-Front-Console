import { State } from '@/store'

export const documentsSelector = (state: State) => state.entities.documents

export const usersSelector = (state: State) => state.entities.users
