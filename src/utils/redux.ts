import { Action, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'

export const handleActions = <S>(reducerMap: { [type: string]: Reducer<S, any> }, defaultState: S): Reducer<S> => (prevState, action) => {
  const state = prevState || defaultState
  const actionType = action.type
  if (actionType && reducerMap[actionType]) return reducerMap[actionType](state, action)
  return state
}

export const createThunkAction = <R, S, E, A extends Action>(thunkAction: ThunkAction<R, S, E, A>): ThunkAction<R, S, E, A> & R => thunkAction as ThunkAction<R, S, E, A> & R

