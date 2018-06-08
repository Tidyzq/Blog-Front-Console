import { State } from '@/store'

export const documentSelector = (state: State) => (id: number) => state.entities.documents[id]
