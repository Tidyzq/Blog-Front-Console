import { xml2js, getHeaders } from '@/utils/api'

import request from './request'

const API_URL = process.env.REACT_APP_COS_API_URL || ''

export const Token = {
  get: (accessToken: string, method: string, key: string) => request.get<{ token: string }>('/api/cos/token', { params: { method, key }, headers: getHeaders(accessToken) }),
}

async function getAuthorization (accessToken: string, method: string, key: string) {
  const realMethod = (method || '*').toLowerCase()
  const realKey = key || ''
  const { data: { token } } = await Token.get(accessToken, realMethod, realKey)
  return token
}

export interface BucketContent {
  ListBucketResult: {
    Contents: CosContent[]
  }
}

export interface CosContent {
  Key: string
  Size: string
  LastModified: string
  ETag: string
}

export default {
  Token,
  async get (accessToken: string) {
    const token = await getAuthorization(accessToken, 'get', '')
    const { data } = await request.get(API_URL, { headers: { Authorization: token }})
    const { ListBucketResult: { Contents: result } } = await xml2js(data) as BucketContent
    return result
  },
  async put (accessToken: string, file: File, options?: { key?: string, progress?: (e: ProgressEvent) => void }) {
    const key = options && options.key ? options.key : file.name
    const progress = options && options.progress ? options.progress : undefined
    const token = await getAuthorization(accessToken, 'put', key)
    await request.put(
      `${API_URL}/${key}`,
      file,
      {
        headers: {
          Authorization: token,
          'Content-Type': file.type,
        },
        onUploadProgress: progress,
      },
    )
  },
  async delete (accessToken: string, key: string) {
    const token = await getAuthorization(accessToken, 'delete', key)
    await request.delete(`${API_URL}/${key}`, { headers: { Authorization: token }})
  },
}
