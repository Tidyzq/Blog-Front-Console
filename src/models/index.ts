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

export interface Setting {
  title: string
  description: string
  cover: string
  postPerPage: number
  logo: string
  navigation: {
    name: string
    path: string
  }[]
}

export interface Image {
  name: string
  size: string
  lastModified: Date
  url: string
}
