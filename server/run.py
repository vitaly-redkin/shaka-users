import os
import json
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager

import resources
import model.revoked_token

app = Flask(__name__)
CORS(app)
api = Api(app)

app.config['ERROR_404_HELP'] = False

app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(app)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    """
    Checks if the token in the blacklist

    :param decrypted_token: decrypted token
    :return: True if the token is in the blacklist of false otherwise
    """
    jti = decrypted_token['jti']
    return model.revoked_token.RevokedToken.is_blacklisted(jti)


# Create a function that will be called whenever create_access_token
# is used. It will take whatever object is passed into the
# create_access_token method, and lets us define what custom claims
# should be added to the access token.
@jwt.user_claims_loader
def add_claims_to_access_token(identity):
    return {'role': identity['role']}


# Create a function that will be called whenever create_access_token
# is used. It will take whatever object is passed into the
# create_access_token method, and lets us define what the identity
# of the access token should be.
@jwt.user_identity_loader
def user_identity_lookup(identity):
    return identity['email']


api.add_resource(resources.UserRegistration, '/registration')
api.add_resource(resources.UserLogin, '/login')
api.add_resource(resources.UserLogoutAccess, '/logout/access')
api.add_resource(resources.UserLogoutRefresh, '/logout/refresh')
api.add_resource(resources.TokenRefresh, '/token/refresh')
api.add_resource(resources.Users, '/users')
api.add_resource(resources.User, '/users/<string:email>')
api.add_resource(resources.HelloWorld, '/')


@app.errorhandler(Exception)
def handle_root_exception(error):
    """
    Return a error description and 400 status code
    """
    code = 400
    if hasattr(error, 'code'):
        code = error.code
    d = dict(_error=str(error))
    s = json.dumps(d)
    return (s, code, [('Content-Type', 'application/json')])


if __name__ == '__main__':
    app.run(debug=True)
"""
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
"""
