import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import 'antd/dist/antd.css'
import '@/styles/fontawesome.css'
import registerServiceWorker from './registerServiceWorker'
import Console from '@/views'
import createStore from '@/store'

const store = createStore()

render(
  <Provider store={store}>
    <Console />
  </Provider>,
  document.getElementById('app'),
)
registerServiceWorker()
