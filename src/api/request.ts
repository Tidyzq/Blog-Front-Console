import Axios from 'axios'

const isServer = process.env.VUE_ENV === 'server'

export default Axios.create({
  baseURL: isServer ? 'http://127.0.0.1:1337' : location.origin,
  timeout: 3000,
})
