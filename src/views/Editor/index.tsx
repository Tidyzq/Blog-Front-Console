import React from 'react'
import Loadable from 'react-loadable'
import Loading from '@/components/Loading'

export default Loadable({
  loader: () => import('./Editor'),
  loading: Loading,
  render: ({ default: Editor }, props) => (
    <Editor {...props}/>
  ),
})
