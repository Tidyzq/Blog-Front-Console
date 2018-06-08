import { State } from '@/store'

export const accessTokenSelector = (state: State) => state.login.accessToken
