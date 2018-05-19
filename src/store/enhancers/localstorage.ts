import { StoreEnhancerStoreCreator, DeepPartial, Reducer, Action, AnyAction, Store } from 'redux'
import { identity } from 'lodash'
import { JsonStringify, JsonParse } from '@/utils'

export type ILocalStorageEnhancer<T, A extends Action = AnyAction> =
  (next: StoreEnhancerStoreCreator) =>
    (reducer: Reducer<T, A>, preloadedState?: DeepPartial<T>) =>
      Store<T & {}, A>

// T 是redux的 schema
// S 是存储到localstorage的 schema
export default <T extends {}, S>(
  key: string = 'redux',
  picker: (state: T) => S = identity,
  grow: (state: S) => DeepPartial<T> | undefined = identity,
  merge: (init: DeepPartial<T> | undefined, storage: DeepPartial<T> | undefined) => DeepPartial<T> | undefined = (a, b) => ({ ...(a as any), ...(b as any) }),
  serialize: (value: any) => string = JsonStringify,
  deserialize: (value: string) => any = JsonParse,
): ILocalStorageEnhancer<T> => next => (reducer, preloadedState) => {
  let storageState: DeepPartial<T> | undefined = preloadedState
  try {
    const storageValue = localStorage.getItem(key)
    if (storageValue !== null) {
      storageState = merge(grow(deserialize(storageValue)), preloadedState)
    }
  } catch (e) {
    console.warn('Failed to retrieve initialize state from localStorage:', e)
  }

  const store = next(reducer, storageState)

  store.subscribe(() => {
    const state = store.getState()
    console.log(state)

    try {
      console.log(key, serialize(picker(state)))
      localStorage.setItem(key, serialize(picker(state)))
    } catch (e) {
      console.warn('Failed to persist state to localStorage:', e)
    }
  })

  return store
}
