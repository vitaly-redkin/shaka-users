import datetime

from .mongo_util import MongoUtil


class AppUser:
    """
    Class to contain all User related operations
    """

    @staticmethod
    def create(email, password_hash, first_name, last_name, role):
        """
        Creates new user.

        :param string email: User e-mail (will also serve as a primary key)
        :param string password_hash: User password hash
        :param string first_name: User first name
        :param string last_name: User last name
        :param string role: ADMIN or USER
        """
        MongoUtil.user_collection().insert_one(
            {
                '_id': email,
                'email': email,
                'password_hash': password_hash,
                'first_name': first_name,
                'last_name': last_name,
                'role': role,
                'created_on': datetime.datetime.utcnow(),
                'updated_on': datetime.datetime.utcnow()
            }
        )

    @staticmethod
    def get_all():
        """
        Returns list of all users

        :return: list of dictionaries with user data
        """
        cursor = MongoUtil.user_collection().find(
            {
            },
            {
                'email': 1,
                'first_name': 1,
                'last_name': 1,
                'role': 1,
                '_id': 0
            }
        )
        return list(cursor)

    @staticmethod
    def get_count():
        """
        Returns the total number of users

        :return: the total number of users
        """
        count = MongoUtil.user_collection().count()
        return count

    @staticmethod
    def get_by_email(email):
        """
        Returns a user with the given email

        :return: user with the given email
        """
        doc = MongoUtil.user_collection().find_one(
            {
                '_id': email
            },
            {
                'email': 1,
                'password_hash': 1,
                'first_name': 1,
                'last_name': 1,
                'role': 1,
                '_id': 0
            }
        )
        return doc

    @staticmethod
    def update(email, password_hash, first_name, last_name, role):
        """
        Updates properties of a user with the given email

        :param string email: User e-mail
        :param string password_hash: User password hash. If empty does not update it
        :param string first_name: User first name
        :param string last_name: User last name
        :param string role: ADMIN or USER
        :return: None if user not found or dictionary with the user e-mail otherwise
        """
        update_dict = \
            {
                'updated_on': datetime.datetime.utcnow(),
                'first_name': first_name,
                'last_name': last_name,
                'role': role
            }
        if password_hash != None:
            update_dict['password_hash'] = password_hash

        doc = MongoUtil.user_collection().update_one(
            {
                '_id': email
            },
            {
                '$set': update_dict
            }
        )
        return None if doc is None or doc.matched_count == 0 else {'success': True}

    @staticmethod
    def delete(email):
        """
        Deletes a user with the given email

        :param string email: User e-mail
        :return: None if user not found or dictionary with the user e-mail otherwise
        """
        doc = MongoUtil.user_collection().delete_one(
            {
                '_id': email
            }
        )
        return None if doc is None or doc.deleted_count == 0 else {'success': True}
