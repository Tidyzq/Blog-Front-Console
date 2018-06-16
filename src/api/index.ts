import request from './request'
import { throttlePromise } from '@/utils'
import { User, Document, Post, Tag, Page, Setting } from '@/models'
import { forEach } from 'lodash'

// add attribute to axios response
declare module 'axios' {
  // tslint:disable:interface-name
  interface AxiosResponse<T = any> {
    totalCount?: number
  }
}

// solve total count
request.interceptors.response.use(response => {
  const totalCount = response.headers['x-total-count']
  if (typeof totalCount === 'string') {
    response.totalCount = parseInt(totalCount, 10)
  }
  return response
})

export interface IQuery {
  limit?: number
  offset?: number
  sort?: { [key: string]: 'asc' | 'desc' }
}

export function solveQuery (query?: IQuery): { [key: string]: string } {
  const result: { [key: string]: string } = {}
  if (!query) return result
  if (query.limit !== undefined) result.limit = String(query.limit)
  if (query.offset !== undefined) result.offset = String(query.offset)
  if (query.sort !== undefined) {
    forEach(query.sort, (value, key) => {
      result[`sort[${key}]`] = value
    })
  }
  return result
}

const getHeaders = (accessToken: string) => ({ Authorization: `JWT ${accessToken}` })

export const auth = {
  login: (body: { email: string, password: string }) => request.post<{ user: User, accessToken: string }>('/api/auth/login', body),
  checkLogin: throttlePromise((accessToken: string) => request.get<void>('/api/auth/check-login', { headers: getHeaders(accessToken) })),
}

export const user = {
  getAll: throttlePromise((accessToken: string, query?: IQuery) => request.get<User[]>('/api/users', { params: solveQuery(query), headers: getHeaders(accessToken) })),
  create: (accessToken: string, body: User) => request.post<User>('/api/users', body, { headers: getHeaders(accessToken) }),
  getById: throttlePromise((id: number) => request.get<User>(`/api/users/${id}`)),
  update: (accessToken: string, id: number, body: User) => request.put<User>(`/api/documents/${id}`, body, { headers: getHeaders(accessToken) }),
  delete: (accessToken: string, id: number) => request.delete(`/api/documents/${id}`, { headers: getHeaders(accessToken) }),
  changePassword: (accessToken: string, id: number, body: { newPassword: string, oldPassword: string }) => request.put<User>(`/api/users/${id}/password`, body, { headers: getHeaders(accessToken) }),
  Post: {
    getAll: throttlePromise((userId: number, query?: IQuery) => request.get<Post[]>(`/api/users/${userId}/posts`, { params: solveQuery(query) })),
  },
}

export const document = {
  getAll: throttlePromise((accessToken: string, query?: IQuery) => request.get<Document[]>('/api/documents', { params: solveQuery(query), headers: getHeaders(accessToken) })),
  create: (accessToken: string, body: Document) => request.post<Document>('/api/documents', body, { headers: getHeaders(accessToken) }),
  getById: throttlePromise((accessToken: string, id: number) => request.get<Document>(`/api/documents/${id}`, { headers: getHeaders(accessToken) })),
  update: (accessToken: string, id: number, body: Document) => request.put<Document>(`/api/documents/${id}`, body, { headers: getHeaders(accessToken) }),
  delete: (accessToken: string, id: number) => request.delete(`/api/documents/${id}`, { headers: getHeaders(accessToken) }),
  Tag: {
    getAll: throttlePromise((accessToken: string, documentId: number, query?: IQuery) => request.get<Tag[]>(`/api/documents/${documentId}/tags`, { params: solveQuery(query), headers: getHeaders(accessToken) })),
    link: (accessToken: string, documentId: number, body: number[]) => request.post<number[]>(`/api/documents/${documentId}/tags`, body, { headers: getHeaders(accessToken) }),
    update: (accessToken: string, documentId: number, body: number[]) => request.put(`/api/documents/${documentId}/tags`, body, { headers: getHeaders(accessToken) }),
    delete: (accessToken: string, documentId: number, tagId: number) => request.delete(`/api/documents/${documentId}/tags/${tagId}`, { headers: getHeaders(accessToken) }),
  },
}

export const tag = {
  getAll: throttlePromise((query?: IQuery) => request.get<Tag[]>('/api/tags', { params: solveQuery(query) })),
  create: (body: Tag) => request.post<Tag>('/api/tags', body),
  getById: throttlePromise((id: number) => request.get<Tag>(`/api/tags/id/${id}`)),
  updateById: (id: number, body: Tag) => request.put<Tag>(`/api/tags/id/${id}`, body),
  deleteById: (id: number) => request.delete(`/api/tags/id/${id}`),
  getByUrl: throttlePromise((url: string) => request.get<Tag>(`/api/tags/url/${url}`)),
  Document: {
    getAll: throttlePromise((tagId: number, query?: IQuery) => request.get<Document>(`/api/tags/id/${tagId}/documents`, { params: solveQuery(query) })),
  },
  Post: {
    getAll: throttlePromise((tagUrl: string, query?: IQuery) => request.get<Document>(`/api/tags/url/${tagUrl}/documents`, { params: solveQuery(query) })),
  },
}

export const post = {
  getAll: throttlePromise((query?: IQuery) => request.get<Post[]>('/api/posts', { params: solveQuery(query) })),
  getByUrl: throttlePromise((url: string) => request.get<Post>(`/api/posts/${url}`)),
  Tag: {
    getAll: throttlePromise((tagUrl: string, query?: IQuery) => request.get<Tag[]>(`/api/posts/${tagUrl}/tags`, { params: solveQuery(query) })),
  },
}

export const page = {
  getByUrl: throttlePromise((url: string) => request.get<Page>(`/api/pages/${url}`)),
}

export const setting = {
  get: throttlePromise(() => request.get<Setting>('/api/settings')),
  update: (body: Setting) => request.put('/api/settings', body),
}

export { default as Cos } from './cos'
