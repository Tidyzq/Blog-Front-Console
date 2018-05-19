import { createStore, applyMiddleware, compose, StoreEnhancerStoreCreator } from 'redux'
import PromiseMiddleware from 'redux-promise'
import reducer, { IRedux as IReducer } from './reducers'
import { IReduxLoginProperty } from './reducers/login'
import localStorageEnhancer from './enhancers/localstorage'

export type IRedux = IReducer

let composeEnhancers = compose

// use devtool if not in production mode
if (process.env.NODE_ENV !== 'production') {
  if ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  }
}

const middlewares = [
  PromiseMiddleware,
]

const enhancer = composeEnhancers<StoreEnhancerStoreCreator>(
  applyMiddleware(...middlewares),
  localStorageEnhancer<IRedux, IReduxLoginProperty>(
    'redux',
    state => state.login,
    login => ({ login }),
  ),
)

export default () => createStore(
  reducer,
  enhancer,
)
