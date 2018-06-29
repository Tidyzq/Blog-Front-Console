import React from 'react'
import Loadable from 'react-loadable'
import Loading from '@/components/Loading'

export * from './MarkdownEditor'

export default Loadable({
  loader: () => import('./MarkdownEditor'),
  loading: Loading,
  render: ({ default: Documents }, props) => (
    <Documents {...props} />
  ),
})
