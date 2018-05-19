export interface IUser {
  id: number
  username: string
  password?: string
  email: string
  avatar: string
}

export interface IDocument {
  id: number
  title: string
  url: string
  type: 'draft' | 'post' | 'page'
  markdown: string
  modifiedAt: number
  createAt: number
  author: number
}

export type IPost = IDocument

export type IPage = IDocument

export interface ITag {
  id: number
  name: string
  url: string
}

export interface ITagDocument {
  tagId: number
  documentId: number
}

export type ISetting = any
