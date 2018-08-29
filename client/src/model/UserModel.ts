/**
 * Class to contain user details.
 */

/**
 * Enum for user roles.
 */
export enum RoleEnum {
  Admin = 'ADMIN',
  User = 'USER'
}

export class UserModel {
  /**
   * Constructor.
   * 
   * @param accessToken JWT access token
   * @param refreshToken JWT refresh token
   */
  constructor(
    public readonly email: string = '',
    public readonly password: string = '',
    public readonly firstName: string = '',
    public readonly lastName: string = '',
    public readonly role: RoleEnum = RoleEnum.User
  ) {
  }
}
