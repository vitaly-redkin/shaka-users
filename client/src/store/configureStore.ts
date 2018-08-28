/**
 * Redux store configurator.
 */

import {
  AnyAction, applyMiddleware, combineReducers, compose, createStore,
  Reducer, ReducersMapObject, Store, StoreEnhancerStoreCreator
} from 'redux';
import thunk from 'redux-thunk';
import { IApplicationState, reducers } from '.';

/**
 * Types for the application Redux store.
 */
export type StoreType = Store<IApplicationState>;

/**
 * Configures Redux store.
 *
 * @returns application Redux store
 */
export function configureStore(initialState: IApplicationState) : StoreType {
  return compose(
    applyMiddleware(thunk),
    <S>(next: StoreEnhancerStoreCreator<S>) => next
  )(createStore)(buildRootReducer(reducers), initialState);
}

/**
 * Builds the root reducer.
 *
 * @param allReducers Application reducers
 * @returns Root reducer combined from the application ones
 */
function buildRootReducer(allReducers: ReducersMapObject<IApplicationState, AnyAction>):
  Reducer<IApplicationState> {
  return combineReducers<IApplicationState>(allReducers);
}
