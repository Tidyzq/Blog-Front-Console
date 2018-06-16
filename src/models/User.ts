export interface User {
  id: number
  username: string
  password?: string
  email: string
  avatar: string
}

export const createNewUser = (): User => ({
  id: -1,
  username: 'Untitled',
  password: '',
  email: '',
  avatar: '',
})
