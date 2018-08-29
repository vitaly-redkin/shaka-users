/**
 * The root file of the Redux store.
 */

import * as UserHandler from './UserHandler';
import * as AuthTokenHandler from './AuthTokenHandler';

/**
 * Interface for the application state.
 */
export interface IApplicationState {
  user: UserHandler.IUserState;
  authTokens: AuthTokenHandler.IAuthTokenState;
}

/**
 * Inital application state.
 */
export const initialState: IApplicationState = {
  user: UserHandler.initialState,
  authTokens: AuthTokenHandler.initialState,
};

/**
 * ACTION CREATORS.
 * These are functions exposed to UI components that will trigger a state transition.
 */
export const actionCreators = {
  setUser: UserHandler.actionCreators.setUser,
  clearUser: UserHandler.actionCreators.clearUser,

  setAuthTokens: AuthTokenHandler.actionCreators.setAuthTokens,
  refreshAuthTokens: AuthTokenHandler.actionCreators.refreshAuthTokens,
  clearAuthTokens: AuthTokenHandler.actionCreators.clearAuthTokens,
};

/**
 * Application reducers.
 */
export const reducers = {
  user: UserHandler.reducer,
  authTokens: AuthTokenHandler.reducer,
};

/**
 * This type can be used as a hint on action creators so that its 'dispatch' and
 * 'getState' params are correctly typed to match your store.
 */
export type AppThunkAction<TAction> = (
  dispatch: (action: TAction) => void,
  getState: () => IApplicationState) => void;
