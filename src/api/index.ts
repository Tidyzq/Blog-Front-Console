import request from './request'
import EventEmitter from 'events'
import { throttlePromise } from '@/utils'
import { IUser, IDocument, IPost, ITag, IPage, ISetting } from '@/models/types'
import { forEach } from 'lodash'

// add attribute to axios response
declare module 'axios' {
  // tslint:disable:interface-name
  interface AxiosResponse<T = any> {
    totalCount?: number
  }
}

let authInterceptor: number | null = null

export const AuthorizationEvent = new EventEmitter()

export function bindAuthorization (getter?: () => string | undefined) {
  if (authInterceptor !== null) {
    request.interceptors.request.eject(authInterceptor)
  }
  if (getter === undefined) return
  authInterceptor = request.interceptors.request.use(config => {
    if (typeof config.headers.Authorization === 'undefined') {
      config.headers.Authorization = `JWT ${getter()}`
    }
    return config
  })
}

request.interceptors.response.use(undefined, error => {
  if (error.response.status === 401) {
    AuthorizationEvent.emit('failed')
  }
  return Promise.reject(error)
})

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

export const Auth = {
  login: (body: { email: string, password: string }) => request.post<{ user: IUser, accessToken: string }>('/api/auth/login', body),
  checkLogin: throttlePromise(() => request.get<void>('/api/auth/check-login')),
}

export const User = {
  getAll: throttlePromise((query?: IQuery) => request.get<IUser[]>('/api/users', { params: solveQuery(query) })),
  getById: throttlePromise((id: number) => request.get<IUser>(`/api/users/${id}`)),
  changePassword: (id: number, body: { newPassword: string, oldPassword: string }) => request.put<IUser>(`/api/users/${id}/password`, body),
  Post: {
    getAll: throttlePromise((userId: number, query?: IQuery) => request.get<IPost[]>(`/api/users/${userId}/posts`, { params: solveQuery(query) })),
  },
}

export const Document = {
  getAll: throttlePromise((query?: IQuery) => request.get<IDocument[]>('/api/documents', { params: solveQuery(query) })),
  create: (body: IDocument) => request.post<IDocument>('/api/documents', body),
  getById: throttlePromise((id: number) => request.get<IDocument>(`/api/documents/${id}`)),
  update: (id: number, body: IDocument) => request.put<IDocument>(`/api/documents/${id}`, body),
  delete: (id: number) => request.delete(`/api/documents/${id}`),
  Tag: {
    getAll: throttlePromise((documentId: number, query?: IQuery) => request.get<ITag[]>(`/api/documents/${documentId}/tags`, { params: solveQuery(query) })),
    link: (documentId: number, body: number[]) => request.post<number[]>(`/api/documents/${documentId}/tags`, body),
    update: (documentId: number, body: number[]) => request.put(`/api/documents/${documentId}/tags`, body),
    delete: (documentId: number, tagId: number) => request.delete(`/api/documents/${documentId}/tags/${tagId}`),
  },
}

export const Tag = {
  getAll: throttlePromise((query?: IQuery) => request.get<ITag[]>('/api/tags', { params: solveQuery(query) })),
  create: (body: ITag) => request.post<ITag>('/api/tags', body),
  getById: throttlePromise((id: number) => request.get<ITag>(`/api/tags/id/${id}`)),
  updateById: (id: number, body: ITag) => request.put<ITag>(`/api/tags/id/${id}`, body),
  deleteById: (id: number) => request.delete(`/api/tags/id/${id}`),
  getByUrl: throttlePromise((url: string) => request.get<ITag>(`/api/tags/url/${url}`)),
  Document: {
    getAll: throttlePromise((tagId: number, query?: IQuery) => request.get<IDocument>(`/api/tags/id/${tagId}/documents`, { params: solveQuery(query) })),
  },
  Post: {
    getAll: throttlePromise((tagUrl: string, query?: IQuery) => request.get<IDocument>(`/api/tags/url/${tagUrl}/documents`, { params: solveQuery(query) })),
  },
}

export const Post = {
  getAll: throttlePromise((query?: IQuery) => request.get<IPost[]>('/api/posts', { params: solveQuery(query) })),
  getByUrl: throttlePromise((url: string) => request.get<IPost>(`/api/posts/${url}`)),
  Tag: {
    getAll: throttlePromise((tagUrl: string, query?: IQuery) => request.get<ITag[]>(`/api/posts/${tagUrl}/tags`, { params: solveQuery(query) })),
  },
}

export const Page = {
  getByUrl: throttlePromise((url: string) => request.get<IPage>(`/api/pages/${url}`)),
}

export const Setting = {
  get: throttlePromise(() => request.get<ISetting>('/api/settings')),
  update: (body: ISetting) => request.put('/api/settings', body),
}

export { default as Cos } from './cos'
