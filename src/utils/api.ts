import Xml2js from 'xml2js'
import { forEach } from 'lodash'

export interface Query {
  limit?: number
  offset?: number
  sort?: { [key: string]: 'asc' | 'desc' }
}

export function solveQuery (query?: Query): { [key: string]: string } {
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

export const getHeaders = (accessToken?: string) => (accessToken ? { Authorization: `JWT ${accessToken}` } : {})

export const getOptions = ({ accessToken, query }: { accessToken?: string, query?: Query }) => ({ params: solveQuery(query), headers: getHeaders(accessToken) })

export const getErrorCode = (e: any) => e && e.response && e.response.status ? e.response.status as number : undefined

const xmlParser = new Xml2js.Parser({ explicitArray: false, ignoreAttrs: true })

export function xml2js <R extends {}> (str: string) {
  return new Promise<R>((resolve, reject) => {
    xmlParser.parseString(str, (err: Error, data: R) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
