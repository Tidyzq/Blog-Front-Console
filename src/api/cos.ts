import request from './request'
import { xml2js } from '../utils/xml'

export const Token = {
  get: (method: string, key: string) => request.get<{ token: string }>('/api/cos/token', { params: { method, key } }),
}

async function getAuthorization (method: string, key: string) {
  const realMethod = (method || 'get').toLowerCase()
  const realKey = key || ''
  const { data: { token } } = await Token.get(realMethod, realKey)
  return token
}

const apiUrl = process.env.REACT_APP_COS_API_URL || ''
const cdnUrl = process.env.REACT_APP_COS_CDN_URL || ''

export interface BucketContent {
  ListBucketResult: CosContent[]
}

export interface CosContent {
  Key: string
  Size: string
  LastModified: string
  ETag: string
}

export default {
  Token,
  async get () {
    const token = await getAuthorization('get', '')
    const { data } = await request.get(apiUrl, { headers: { Authorization: token } })
    const { ListBucketResult: result } = await xml2js(data) as BucketContent
    return result
  },
  async put (key: string | undefined, file: File, progress?: () => void) {
    if (typeof key !== 'string') {
      progress = (file as any)
      file = key as any
      key = (file || {}).name
    }
    const token = await getAuthorization('put', key)
    await request.put(
      `${apiUrl}/${key}`,
      file,
      {
        headers: {
          Authorization: token,
          'Content-Type': file.type,
        },
        onUploadProgress: progress,
      },
    )
    return `${cdnUrl}/${key}`
  },
  async delete (key: string) {
    const token = await getAuthorization('delete', key)
    await request.delete(`${apiUrl}/${key}`, { headers: { Authorization: token }})
    return `${cdnUrl}/${key}`
  },
}
