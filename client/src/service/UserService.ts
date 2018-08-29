/**
 * Class to do login-related API calls.
 */

import { UserModel } from '../model/UserModel';
import { AuthTokenModel } from '../model/AuthTokenModel';

export class UserService {
    /**
     * Logs in.
     * 
     * @param email User E-mail
     * @param password User password
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public login(
        email: string,
        password: string,
        onSuccess: Function,
        onError: Function
    ): void {
        const data: ILoginPayload = {email: email, password: password};
        this.callApi<ILoginPayload, ILoginResult>(
            '/login',
            'POST',
            data,
            null,
            onSuccess,
            onError
        );
    }

    /**
     * Registers a new user.
     * 
     * @param email User E-mail
     * @param password User password
     * @param firstName User first name
     * @param lastName User last name
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public register(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        onSuccess: Function,
        onError: Function
    ): void {
        const data: IRegisterPayload = {
            email: email, password: password, firstName: firstName, lastName: lastName};
        this.callApi<IRegisterPayload, ILoginResult>(
            '/registration',
            'POST',
            data,
            null,
            onSuccess,
            onError
        );
    }

    /**
     * Logs out.
     * 
     * @param authTokens Authentication tokens
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public logout(
        authTokens: AuthTokenModel,
        onSuccess: Function,
        onError: Function
    ): void {
        this.callApi<IEmptyPayload, IEmptyResult>(
            '/logout/access',
            'POST',
            null,
            authTokens.accessToken,
            onSuccess,
            onError
        );

        this.callApi<IEmptyPayload, IEmptyResult>(
            '/logout/refresh',
            'POST',
            null,
            authTokens.refreshToken,
            onSuccess,
            onError
        );
    }

    /**
     * Returns the user list.
     * 
     * @param authTokens Authentication tokens
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public getUserList(
        authTokens: AuthTokenModel,
        onSuccess: Function,
        onError: Function
    ): void {
        this.callApi<IEmptyPayload, UserModel[]>(
            '/users',
            'GET',
            null,
            authTokens,
            onSuccess,
            onError
        );
    }

    /**
     * Creates or updaets the user.
     * 
     * @param user User data
     * @param isNewUser true if new user is to be created
     * @param authTokens Authentication tokens
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public saveUser(
        user: UserModel,
        isNewUser: boolean,
        authTokens: AuthTokenModel,
        onSuccess: Function,
        onError: Function
    ): void {
        const method = (isNewUser ? 'POST' : 'PUT');
        const data: UserModel = user;
        const param: string = (!isNewUser ? `/${user.email}` : '');
        const endpoint: string = `/users${param}`;
        this.callApi<UserModel, UserModel>(
            endpoint,
            method,
            data,
            authTokens,
            onSuccess,
            onError
        );
    }

    /**
     * Returns the user list.
     * 
     * @param authTokens Authentication tokens
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public deleteUser(
        email: string,
        authTokens: AuthTokenModel,
        onSuccess: Function,
        onError: Function
    ): void {
        const param: string = `/${email}`;
        const endpoint: string = `/users${param}`;
        this.callApi<IEmptyPayload, IUserDeleteResult>(
            endpoint,
            'DELETE',
            null,
            authTokens,
            onSuccess,
            onError
        );
    }

    /**
     * Calls a specified API endpoint.
     * 
     * @param endpoint API endpoint to call
     * @param method HTTP method to use (GET, POST, PUT, DELETE)
     * @param data payload object
     * @param authTokens - either both access and refresh tokens, or only one token, or null
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    private callApi<TPayload, TResult>(
        endpoint: string,
        method: string,
        data: TPayload | null,
        authTokens: AuthTokenModel | string | null,
        onSuccess: Function,
        onError: Function
    ): void {
        const url: string = `${this.getApiHost()}${endpoint}`;
        //tslint:disable
        const headers: any = this.addAuthHeaders(
            authTokens,
            {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
        //tslint:enable
        try {
            fetch(
                url,
                {
                    method: method,
                    mode: 'cors',
                    body: (data === null ? null : JSON.stringify(data)),
                    headers: headers
                }
            )
            .then(async (response) =>  { 
                // fetch() resolves promise successfully even if responce.ok is false
                // API retuns JSON with error description when HTTP status is 400
                // Otherwise treat the call as failed with nothing but HTTP status known
                if (response.ok || response.status === 400) {
                    return response.json();
                  } else {
                    return {_error: `Request rejected with status ${response.status}`};
                  }
                }
            )
            .catch((error: Error) => { onError(error); })
            .then((response: TResult | ApiError) => { 
                if (response) {
                    // tslint:disable
                    if ('_error' in (response as any)) {
                    onError(new Error((response as ApiError)._error));
                    } else {
                        if (onSuccess) {
                            onSuccess(response as TResult);
                        }
                    }
                    // tslint:enable
                }
            })
            .catch((error: Error) => { 
                if (onError) {
                    onError(error); 
                }
            });
        } catch (error) {
            if (onError) {
                onError(error);
            }
        }
    }

    //tslint:disable
    private addAuthHeaders(
        authTokens: AuthTokenModel | string | null,
        headers: any
    ): any {
        //tslint:enable
        if (authTokens === null) {
            return headers;
        } else {
            const token: string = 
                (typeof authTokens === 'string' ? authTokens : authTokens.accessToken);

            return {...headers, Authorization: `Bearer ${token}`};
        }
    }

    /**
     * Returns API host to add to the endpoint names.
     */
    private getApiHost(): string {
        return process.env.REACT_APP_API_HOST!;
    }
}  

/**
 * Interface for the empty payload.
 */
interface IEmptyPayload {
}

/**
 * Interface for the empty result.
 */
interface IEmptyResult {
}

/**
 * Interface for the login payload objects.
 */
interface ILoginPayload {
    email: string;
    password: string;
}

/**
 * Interface for the login payload objects.
 */
export interface ILoginResult {
    authTokens: AuthTokenModel;
    user: UserModel;
}

/**
 * Interface for the register payload objects.
 */
interface IRegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

/**
 * Interface for user delete results.
 */
export interface IUserDeleteResult {
    email: string;
}

/**
 * Type with API error information.
 */
export type ApiError = {
    _error: string;
};
