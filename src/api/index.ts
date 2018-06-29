import { throttlePromise } from '@/utils'
import { Query, getOptions } from '@/utils/api'
import { User, Document, Post, Tag, Page, Setting } from '@/models'

import request from './request'

export const auth = {
  login: (body: { email: string, password: string }) => request.post<{ user: User, accessToken: string }>('/api/auth/login', body),
  checkLogin: throttlePromise((accessToken: string) => request.get<void>('/api/auth/check-login', getOptions({ accessToken }))),
}

export const user = {
  getAll: throttlePromise((accessToken: string, query?: Query) => request.get<User[]>('/api/users', getOptions({ accessToken, query }))),
  create: (accessToken: string, body: User) => request.post<User>('/api/users', body, getOptions({ accessToken })),
  getById: throttlePromise((id: number) => request.get<User>(`/api/users/${id}`)),
  update: (accessToken: string, id: number, body: User) => request.put<User>(`/api/users/${id}`, body, getOptions({ accessToken })),
  delete: (accessToken: string, id: number) => request.delete(`/api/users/${id}`, getOptions({ accessToken })),
  changePassword: (accessToken: string, id: number, body: { newPassword: string, oldPassword: string }) => request.put<User>(`/api/users/${id}/password`, body, getOptions({ accessToken })),
  Post: {
    getAll: throttlePromise((userId: number, query?: Query) => request.get<Post[]>(`/api/users/${userId}/posts`, getOptions({ query }))),
  },
}

export const document = {
  getAll: throttlePromise((accessToken: string, query?: Query) => request.get<Document[]>('/api/documents', getOptions({ accessToken, query }))),
  create: (accessToken: string, body: Document) => request.post<Document>('/api/documents', body, getOptions({ accessToken })),
  getById: throttlePromise((accessToken: string, id: number) => request.get<Document>(`/api/documents/${id}`, getOptions({ accessToken }))),
  update: (accessToken: string, id: number, body: Document) => request.put<Document>(`/api/documents/${id}`, body, getOptions({ accessToken })),
  delete: (accessToken: string, id: number) => request.delete(`/api/documents/${id}`, getOptions({ accessToken })),
  Tag: {
    getAll: throttlePromise((accessToken: string, documentId: number, query?: Query) => request.get<Tag[]>(`/api/documents/${documentId}/tags`, getOptions({ accessToken, query }))),
    link: (accessToken: string, documentId: number, body: number[]) => request.post<number[]>(`/api/documents/${documentId}/tags`, body, getOptions({ accessToken })),
    update: (accessToken: string, documentId: number, body: number[]) => request.put(`/api/documents/${documentId}/tags`, body, getOptions({ accessToken })),
    delete: (accessToken: string, documentId: number, tagId: number) => request.delete(`/api/documents/${documentId}/tags/${tagId}`, getOptions({ accessToken })),
  },
}

export const tag = {
  getAll: throttlePromise((accessToken: string, query?: Query) => request.get<Tag[]>('/api/tags', getOptions({ accessToken, query }))),
  create: (accessToken: string, body: Tag) => request.post<Tag>('/api/tags', body, getOptions({ accessToken })),
  getById: throttlePromise((accessToken: string, id: number) => request.get<Tag>(`/api/tags/id/${id}`, getOptions({ accessToken }))),
  updateById: (accessToken: string, id: number, body: Tag) => request.put<Tag>(`/api/tags/id/${id}`, body, getOptions({ accessToken })),
  deleteById: (accessToken: string, id: number) => request.delete(`/api/tags/id/${id}`, getOptions({ accessToken })),
  getByUrl: throttlePromise((url: string) => request.get<Tag>(`/api/tags/url/${url}`)),
  Document: {
    getAll: throttlePromise((accessToken: string, tagId: number, query?: Query) => request.get<Document[]>(`/api/tags/id/${tagId}/documents`, getOptions({ accessToken, query }))),
  },
  Post: {
    getAll: throttlePromise((tagUrl: string, query?: Query) => request.get<Document[]>(`/api/tags/url/${tagUrl}/documents`, getOptions({ query }))),
  },
}

export const post = {
  getAll: throttlePromise((query?: Query) => request.get<Post[]>('/api/posts', getOptions({ query }))),
  getByUrl: throttlePromise((url: string) => request.get<Post>(`/api/posts/${url}`)),
  Tag: {
    getAll: throttlePromise((tagUrl: string, query?: Query) => request.get<Tag[]>(`/api/posts/${tagUrl}/tags`, getOptions({ query }))),
  },
}

export const page = {
  getByUrl: throttlePromise((url: string) => request.get<Page>(`/api/pages/${url}`)),
}

export const setting = {
  get: throttlePromise(() => request.get<Setting>('/api/settings')),
  update: (accessToken: string, body: Setting) => request.put('/api/settings', body, getOptions({ accessToken })),
}

export { default as cos } from './cos'

export { default as image } from './image'
