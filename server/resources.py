from flask_restful import Resource, request, abort
from flask_jwt_extended import \
    (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required,
     get_jwt_identity, get_jwt_claims, get_raw_jwt)
from passlib.hash import pbkdf2_sha256 as sha256
from functools import wraps

from util import dict_get
from model.app_user import AppUser
from model.revoked_token import RevokedToken


def _error(message):
    """
    Returns dictionary with error

    :param string message: Error message to return
    :return: dictionary with error
    """
    return {'_error': message}


def _ok():
    """
    Composes a dictionary with them and success flag

    :return: dictionary with success flag
    """
    return {
        'success': True
    }


def _ok_with_new_tokens(email, role):
    """
    Generates new access tokens and composes a dictionary with them and success flag

    :param string email: user e-mail
    :param string role: user role
    :return: dictionary with access tokens and success flag
    """
    identity = {'email': email, 'role': role}
    result = _ok()
    authTokens = {
        'accessToken': create_access_token(identity=identity),
        'refreshToken': create_refresh_token(identity=identity)
    }
    result['authTokens'] = authTokens
    return result


def _ok_with_tokens_and_user(user):
    """
    Generates new access tokens and composes a dictionary with them and success flag.
    Adds user object (save for the hashed password) to the returned dictionary.

    :param user: User object to generate access tokens and to return
    :return: dictionary with success flag, access tokens and user
    """
    result = _ok_with_new_tokens(user['email'], user['role'])
    del user['passwordHash']
    result['user'] = user
    return result

def _generate_hash(password):
    """
    Generates password hash

    :param string password: password to generate the hash for
    :return: password hash
    """
    return None if password is None or password == '' else sha256.hash(password)


def _verify_hash(password, password_hash):
    """
    Verifies the password hash

    :param string password: password to verify
    :param string password_hash: hash to compare with
    :return: true if the password and hash match
    """
    return sha256.verify(password, password_hash)


def _is_admin():
    """
    Returns True if the current user (in JWT) is admin

    :return: True if the current user (in JWT) is admin
    """
    claims = get_jwt_claims()
    return 'role' in claims and claims['role'] == 'ADMIN'


def _admin_only(fn):
    """
    A decorator to protect "admin-only" endpoints.

    If you decorate an endpoint with this, it will ensure that the requester
    is an admin.
    """

    @wraps(fn)
    def wrapper(*args, **kwargs):
        """
        Decorator function. Raises '403 exception' if user is nt an admin

        :param args: not used
        :param kwargs: not used
        :return: just what the wrapped function returns
        """
        if not _is_admin():
            abort(403, message='Only admins can do this')

        return fn(*args, **kwargs)

    return wrapper


class UserRegistration(Resource):
    """
    Class to handle user registration requests
    """

    def post(self):
        """
        Registers new user

        :return: dictionary with error or sucess/access tokens
        """
        try:
            json_data = request.get_json(force=True)

            email = dict_get(json_data, 'email')
            if AppUser.get_by_email(email) is not None:
                return _error('User  with email %s already exists' % email)

            password = dict_get(json_data, 'password')
            passwordHash = _generate_hash(password)
            firstName = dict_get(json_data, 'firstName')
            lastName = dict_get(json_data, 'lastName')

            # The very first registered user is an admin
            userCount = AppUser.get_count()
            role = 'ADMIN' if userCount == 0 else 'USER'

            user = AppUser.create(email, passwordHash, firstName, lastName, role)
            return _ok_with_tokens_and_user(user)
        except Exception as e:
            print(e)
            return _error('Error adding user: %s' % e), 500


class UserLogin(Resource):
    """
    Class to handle user login requests
    """

    def post(self):
        """
        Checks if user exists and password matches.

        :return: dictionary with error or sucess/access tokens and user details
        """
        try:
            json_data = request.get_json(force=True)

            email = dict_get(json_data, 'email')
            password = dict_get(json_data, 'password')

            user = AppUser.get_by_email(email)
            if user is not None and _verify_hash(password, user['passwordHash']):
                return _ok_with_tokens_and_user(user)
            else:
                return _error('Invalid email/password')
        except Exception as e:
            return _error('Error during login: %s' % e), 500


class BaseUserLogoutAccess(Resource):
    """
    Base class for resources which revoke user token
    """

    def revoke_token(self, operation):
        """
        Revokes user access token

        :param string operation: name of the operation to log in case of an exception
        :return: error or success dictionary
        """
        try:
            jti = get_raw_jwt()['jti']
            RevokedToken.add(jti)
            return _ok()
        except Exception as e:
            return _error('Error during %s: %s' % (operation, e)), 500


class UserLogoutAccess(BaseUserLogoutAccess):
    """
    Class to handle logout requests
    """

    @jwt_required
    def post(self):
        """
        Revokes user access token

        :return: error or success dictionary
        """
        return super().revoke_token('logout')


class UserLogoutRefresh(BaseUserLogoutAccess):
    """
    Class to handle logout refresh requests
    """

    @jwt_refresh_token_required
    def post(self):
        """
        Revokes user access token

        :return: error or success dictionary
        """
        return super().revoke_token('logout refresh')


class TokenRefresh(Resource):
    """
    Class to handle token refresh request
    """

    @jwt_refresh_token_required
    def post(self):
        """
        Handles token access request

        :return: dictionary with new access token
        """
        email = get_jwt_identity()
        user = AppUser.get_by_email(email)
        if user is not None:
            identity = {'email': email, 'role': user['role']}
            access_token = create_access_token(identity=identity)
            return {'accessToken': access_token}
        else:
            return self._check(user, email)


class Users(Resource):
    """
    Class to handle "get all users" request
    """

    @jwt_required
    @_admin_only
    def get(self):
        """
        Returns list of all users

        :return: list of all users
        """
        return AppUser.get_all()

    @jwt_required
    @_admin_only
    def post(self):
        """
        Creates new user

        :return: success or error dictionary
        """
        try:
            json_data = request.get_json(force=True)

            email = dict_get(json_data, 'email')
            if AppUser.get_by_email(email) is not None:
                return _error('User  with email %s already exists' % email)

            password = dict_get(json_data, 'password')
            passwordHash = _generate_hash(password)
            firstName = dict_get(json_data, 'firstName')
            lastName = dict_get(json_data, 'lastName')
            role = dict_get(json_data, 'role')

            result = AppUser.create(email, passwordHash, firstName, lastName, role)
            if result is not None:
                del result['passwordHash']
            return result
        except Exception as e:
            return _error('Error during creating a new user: %s' % e), 500


class User(Resource):
    """
    Class to handle requests for individual users
    """

    @jwt_required
    @_admin_only
    def get(self, email):
        """
        Returns details for the user with the given e-mail

        :param string email: email of the user to look for
        :return: details for the user with the given e-mail or HTTP 404 if not found
        """
        result = AppUser.get_by_email(email)
        if result is not None:
            del result['passwordHash']
        return self._check(result, email)

    @jwt_required
    @_admin_only
    def put(self, email):
        """
        Updates user

        :return: updated user or error dictionary
        """
        try:
            json_data = request.get_json(force=True)

            password = dict_get(json_data, 'password')
            passwordHash = _generate_hash(password)
            firstName = dict_get(json_data, 'firstName')
            lastName = dict_get(json_data, 'lastName')
            role = dict_get(json_data, 'role')

            result = AppUser.update(email, passwordHash, firstName, lastName, role)
            if result is not None:
                del result['passwordHash']
            return self._check(result, email)
        except Exception as e:
            return _error('Error during updating user: %s' % e), 500

    @jwt_required
    @_admin_only
    def delete(self, email):
        """
        Deletes user

        :return: user e-mail or error dictionary
        """
        try:
            result = AppUser.delete(email)

            return self._check(result, email)
        except Exception as e:
            return _error('Error during deleting user: %s' % e), 500

    def _check(self, doc, email):
        """
        Checks if user API call returned a real object.
        if None is returned calls abort(404).

        :param object doc: object to check if it is not None
        :param string email: user e-mail
        :return: user object if it is not None or calls abort(404) otherwise
        """
        if doc is not None:
            return doc
        else:
            error_message = 'No user with a-mail=%s exists' % email
            abort(404, message=error_message)


class HelloWorld(Resource):
    """
    Dummy class to check API health
    """

    def get(self):
        """
        Dummy GET method
        :return:
        """
        return {'hello': 'world'}
