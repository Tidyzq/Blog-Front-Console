import { createStore, applyMiddleware, compose, StoreEnhancerStoreCreator } from 'redux'
import ThunkMiddleware from 'redux-thunk'
import reducer, { State } from './reducers'
import { LoginStateProperty } from './reducers/login'
import localStorageEnhancer from './enhancers/localstorage'

export type State = State

let composeEnhancers = compose

// use devtool if not in production mode
if (process.env.NODE_ENV !== 'production') {
  if ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  }
}

const middlewares = [
  ThunkMiddleware,
]

const enhancer = composeEnhancers<StoreEnhancerStoreCreator>(
  applyMiddleware(...middlewares),
  localStorageEnhancer<State, LoginStateProperty>(
    'redux',
    state => state.login,
    login => ({ login }),
  ),
)

export default () => createStore(
  reducer,
  enhancer,
)
