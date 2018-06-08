export interface User {
  id: number
  username: string
  password?: string
  email: string
  avatar: string
}

export interface Document {
  id: number
  title: string
  url: string
  type: 'draft' | 'post' | 'page'
  markdown: string
  modifiedAt: number
  createAt: number
  author: number
}

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
