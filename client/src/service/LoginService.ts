/**
 * Class to do login-related API calls.
 */

import { UserModel } from '../model/UserModel';
import { AuthTokenModel } from '../model/AuthTokenModel';

export class LoginService {
    /**
     * Tries to log in.
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
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    private callApi<TPayload, TResult>(
        endpoint: string,
        method: string,
        data: TPayload | null,
        onSuccess: Function,
        onError: Function
    ): void {
        const url: string = `${this.getApiHost()}${endpoint}`;
        try {
            fetch(
                url,
                {
                    method: method,
                    mode: 'cors',
                    body: (data === null ? null : JSON.stringify(data)),
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
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

    /**
     * Returns API host to add to the endpoint names.
     */
    private getApiHost(): string {
        return process.env.REACT_APP_API_HOST!;
    }
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
 * Type with API error information.
 */
export type ApiError = {
    _error: string;
};
