export { Document } from './Document'

export { User } from './User'

export type Post = Document

export type Page = Document

export interface Tag {
  id: number
  name: string
  url: string
}

export interface TagDocument {
  tagId: number
  documentId: number
}

export type Setting = any
