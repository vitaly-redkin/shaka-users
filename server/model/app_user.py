import datetime
import pymongo

from .mongo_util import MongoUtil

# Fields to return from single user
_user_fields = {
    'email': 1,
    'passwordHash': 1,
    'firstName': 1,
    'lastName': 1,
    'role': 1,
    '_id': 0
}

# Fields to return for user list
_user_fields_for_list = {
    'email': 1,
    'firstName': 1,
    'lastName': 1,
    'role': 1,
    '_id': 0
}


class AppUser:
    """
    Class to contain all User related operations
    """

    @staticmethod
    def create(email, passwordHash, firstName, lastName, role):
        """
        Creates new user.

        :param string email: User e-mail (will also serve as a primary key)
        :param string passwordHash: User password hash
        :param string firstName: User first name
        :param string lastName: User last name
        :param string role: ADMIN or USER
        """
        MongoUtil.user_collection().insert_one(
            {
                '_id': email,
                'email': email,
                'passwordHash': passwordHash,
                'firstName': firstName,
                'lastName': lastName,
                'role': role,
                'createdOn': datetime.datetime.utcnow(),
                'updatedOn': datetime.datetime.utcnow()
            }
        )

        return AppUser.get_by_email(email)

    @staticmethod
    def get_all():
        """
        Returns list of all users

        :return: list of dictionaries with user data
        """
        cursor = MongoUtil.user_collection().find(
            {
            },
            _user_fields_for_list
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
            _user_fields
        )
        return doc

    @staticmethod
    def update(email, passwordHash, firstName, lastName, role):
        """
        Updates properties of a user with the given email

        :param string email: User e-mail
        :param string passwordHash: User password hash. If empty does not update it
        :param string firstName: User first name
        :param string lastName: User last name
        :param string role: ADMIN or USER
        :return: None if user not found or dictionary with the user properties otherwise
        """
        update_dict = \
            {
                'updatedOn': datetime.datetime.utcnow(),
                'firstName': firstName,
                'lastName': lastName,
                'role': role
            }
        if passwordHash != None:
            update_dict['passwordHash'] = passwordHash

        doc = MongoUtil.user_collection().find_one_and_update(
            {
                '_id': email
            },
            {
                '$set': update_dict
            },
            projection=_user_fields,
            return_document=pymongo.ReturnDocument.AFTER
        )
        return doc

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
        return None if doc is None or doc.deleted_count == 0 else {'email': email}
