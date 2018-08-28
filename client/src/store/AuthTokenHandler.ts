/**
 * The Redux store stuff for the auth token state.
 */

import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import { AuthTokenModel } from '../model/AuthTokenModel';
import { defaultAuthTokens } from '../defaults/defaults';

/**
 * Interface for the auth token state.
 */
export interface IAuthTokenState {
  authTokens: AuthTokenModel;
}

/**
 * Initial auth token state.
 */
export const initialState: IAuthTokenState = {
  authTokens: defaultAuthTokens,
};

/**
 * Enumeration for the action type strings.
 */
export enum ActionTypeEnum {
  AuthTokenSet = '@@AUTH_TOKEN/SET',
  AuthTokenRefresh = '@@AUTH_TOKEN/REFRESH',
  AuthTokenClear = '@@AUTH_TOKEN/CLEAR',
}

// -----------------
// ACTIONS

/**
 * Interface for the AuthTokenSet action.
 */
interface IAuthTokenSetAction {
  // tslint:disable
  type: ActionTypeEnum.AuthTokenSet;
  // tslint:enable
  newAuthTokens: AuthTokenModel;
}

/**
 * Interface for the AuthTokenRefresh action.
 */
interface IAuthTokenRefreshAction {
  // tslint:disable
  type: ActionTypeEnum.AuthTokenRefresh;
  // tslint:enable
  newAccessToken: string;
}

/**
 * Interface for the AuthTokenClear action.
 */
interface IAuthTokenClearAction {
  // tslint:disable
  type: ActionTypeEnum.AuthTokenClear;
  // tslint:enable
}

/**
 * Declare a 'discriminated union' type. This guarantees that all references
 * to 'type' properties contain one of the declared type strings
 * (and not any other arbitrary string).
 */
export type KnownAction = IAuthTokenSetAction | IAuthTokenRefreshAction | IAuthTokenClearAction;

/**
 * ACTION CREATORS.
 * These are functions exposed to UI components that will trigger a state transition.
 */
export const actionCreators = {
  setAuthTokens: (newAuthTokens: AuthTokenModel): AppThunkAction <KnownAction> =>
      (dispatch: (action: KnownAction) => void): void => {
    dispatch({ type: ActionTypeEnum.AuthTokenSet, newAuthTokens });
  },

  refreshAuthTokens: (newAccessToken: string): AppThunkAction <KnownAction> =>
      (dispatch: (action: KnownAction) => void): void => {
    dispatch({ type: ActionTypeEnum.AuthTokenRefresh, newAccessToken });
  },

  clearAuthTokens: (): AppThunkAction <KnownAction> =>
      (dispatch: (action: KnownAction) => void): void => {
    dispatch({ type: ActionTypeEnum.AuthTokenClear });
  },
};

/**
 * REDUCER - For a given state and action, returns the new state.
 *
 * @param state Current application state
 * @param incomingAction Dispatched Redux action
 *
 * @returns New application state
 */
export const reducer: Reducer<IAuthTokenState> =
  (state: IAuthTokenState, incomingAction: KnownAction): IAuthTokenState => {
  switch (incomingAction.type) {
    case ActionTypeEnum.AuthTokenSet:
    {
      return {...state, authTokens: incomingAction.newAuthTokens};
    }
    case ActionTypeEnum.AuthTokenRefresh:
    {
      return {...state, authTokens: {...state.authTokens, accessToken: incomingAction.newAccessToken}};
    }
    case ActionTypeEnum.AuthTokenClear:
    {
      return {...state, authTokens: initialState.authTokens};
    }
    default:
      // Do nothing - the final return will work
  }

  // For unrecognized actions (or in cases where actions have no effect), must return the existing state
  //  (or default initial state if none was supplied)
  return state || initialState;
};
