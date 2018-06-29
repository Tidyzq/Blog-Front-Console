export interface Document {
  id: number
  title: string
  url: string
  type: 'draft' | 'post' | 'page'
  markdown: string
  modifiedAt: number
  createdAt: number
  author: number
}

export const createNewDocument = (): Document => ({
  id: -1,
  title: 'Untitled',
  url: '',
  type: 'draft',
  markdown: '',
  modifiedAt: 0,
  createdAt: 0,
  author: 0,
})
