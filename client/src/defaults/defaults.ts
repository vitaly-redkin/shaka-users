/**
 * Module to contain application defaults.
 */
import { UserModel } from '../model/UserModel';
import { AuthTokenModel } from '../model/AuthTokenModel';

/**
 * Default user.
 */
export const defaultUser: UserModel | undefined = undefined;

/**
 * Default auth tokens.
 */
export const defaultAuthTokens: AuthTokenModel = {
    accessToken: '',
    refreshToken: ''
};
