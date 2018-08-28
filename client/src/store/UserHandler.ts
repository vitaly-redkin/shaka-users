/**
 * The Redux store stuff for the user state.
 */

import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import { UserModel } from '../model/UserModel';
import { defaultUser } from '../defaults/defaults';

/**
 * Interface for the user state.
 */
export interface IUserState {
  loggedUser: UserModel | undefined;
}

/**
 * Initial user state.
 */
export const initialState: IUserState = {
  loggedUser: defaultUser,
};

/**
 * Enumeration for the action type strings.
 */
export enum ActionTypeEnum {
  UserSet = '@@USER/SET',
  UserClear = '@@USER_TOKEN/CLEAR',
}

// -----------------
// ACTIONS

/**
 * Interface for the UserSet action.
 */
interface IUserSetAction {
  // tslint:disable
  type: ActionTypeEnum.UserSet;
  // tslint:enable
  newUser: UserModel;
}

/**
 * Interface for the UserClear action.
 */
interface IUserClearAction {
  // tslint:disable
  type: ActionTypeEnum.UserClear;
  // tslint:enable
}

/**
 * Declare a 'discriminated union' type. This guarantees that all references
 * to 'type' properties contain one of the declared type strings
 * (and not any other arbitrary string).
 */
export type KnownAction = IUserSetAction | IUserClearAction;

/**
 * ACTION CREATORS.
 * These are functions exposed to UI components that will trigger a state transition.
 */
export const actionCreators = {
  setUser: (newUser: UserModel): AppThunkAction <KnownAction> =>
      (dispatch: (action: KnownAction) => void): void => {
    dispatch({ type: ActionTypeEnum.UserSet, newUser });
  },

  clearUser: (): AppThunkAction <KnownAction> =>
      (dispatch: (action: KnownAction) => void): void => {
    dispatch({ type: ActionTypeEnum.UserClear });
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
export const reducer: Reducer<IUserState> =
  (state: IUserState, incomingAction: KnownAction): IUserState => {
  switch (incomingAction.type) {
    case ActionTypeEnum.UserSet:
    {
      return {...state, loggedUser: incomingAction.newUser};
    }
    case ActionTypeEnum.UserClear:
    {
      return {...state, loggedUser: initialState.loggedUser};
    }
    default:
      // Do nothing - the final return will work
  }

  // For unrecognized actions (or in cases where actions have no effect), must return the existing state
  //  (or default initial state if none was supplied)
  return state || initialState;
};
