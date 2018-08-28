/**
 * Class to fetch exchange rates.
 */

// URL of the Currex sample rates API
const API_URL: string = 'https://api.currex.info/v1/json/latest/';

export class RateFetchService {
  /**
   * Fetched recent exchange rates from the external API.
   * 
   * @param currency code of the currency to fetch the rates for
   * @param onSuccess function to call on success
   * @param onError function to call on error
   */
    public fetchRates(
      currency: string,
      onSuccess: Function,
      onError: Function
    ): void {
      const url: string = `${API_URL}${currency}`;
      try {
          fetch(
              url,
              {
                  method: 'GET',
              }
          )
          .then(async (response) =>  { 
              // fetch() resolves promise successfully even if responce.ok is false
              if (response.ok) {
                  return response.json();
                } else {
                    return {_error: `Request rejected with status ${response.status}`};
                }
              }
          )
          .catch((error: Error) => { onError(error); })
          .then((response: object | FetchError) => { 
              if (response) {
                  // tslint:disable
                  if ('_error' in (response as any)) {
                    onError(new Error((response as FetchError)._error));
                  } else {
                      if (onSuccess) {
                          onSuccess(response as object);
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
}  

/**
 * Type with fetch() error information.
 */
export type FetchError = {
  _error: string;
};
