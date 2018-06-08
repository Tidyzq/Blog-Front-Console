import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import 'font-awesome/css/font-awesome.css'

import registerServiceWorker from './registerServiceWorker'
import Console from '@/views/Console'
import createStore from '@/store'

const store = createStore()

render(
  <Provider store={store}>
    <Console />
  </Provider>,
  document.getElementById('app'),
)
registerServiceWorker()

