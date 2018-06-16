import { State } from '@/store'

export const userSelector = (state: State) => (id: number) => state.entities.users[id]
