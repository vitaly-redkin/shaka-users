import datetime

from .mongo_util import MongoUtil


class RevokedToken:
    """
    Class to contain all revoked token operations
    """

    @staticmethod
    def add(jti):
        """
        Creates new user.

        :param string jti: JWT token identified (will be used as a primary key)
        """
        doc = MongoUtil.revoked_token_collection().find_one(
            {
                '_id': jti
            }
        )
        if doc is None:
            MongoUtil.revoked_token_collection().insert_one(
                {
                    '_id': jti,
                    'created_on': datetime.datetime.utcnow()
                }
            )

    @staticmethod
    def is_blacklisted(jti):
        """
        Checks if token has been blacklisted

        :param string jti: JWT token identified (will be used as a primary key)
        :return: true if token has been blacklisted or false otherwise
        """
        count = MongoUtil.revoked_token_collection().count(
            {
                '_id': jti
            }
        )
        return count > 0
