import Axios from 'axios'

const request = Axios.create({
  baseURL: process.env.VUE_ENV === 'server' ? 'http://127.0.0.1:1337' : location.origin,
  // timeout: 1000 * 10,
})

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

export default request
