import React from 'react'
import Loadable from 'react-loadable'
import Loading from '@/components/Loading'

export default Loadable({
  loader: () => import('./Login'),
  loading: Loading,
  render: ({ default: Login }, props) => (
    <Login {...props} />
  ),
})
