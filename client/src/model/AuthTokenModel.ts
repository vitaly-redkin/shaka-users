/**
 * Class to contain authentication tokens.
 */

export class AuthTokenModel {
  /**
   * Constructor.
   * 
   * @param accessToken JWT access token
   * @param refreshToken JWT refresh token
   */
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string
  ) {
  }
}
