"""
Utility functions.
"""


def dict_get(dictionary, name, def_value=None):
    """
    Returns the value from the dictionary or a default value if the key does not exist.

    :param dict dictionary: dictioanry to get the value from
    :param string name: name of the key
    :param object def_value: default value to use if the key does not exist
    :return: value from the dictionary or a default value if the key not exist
    """
    return dictionary[name] if name in dictionary else def_value
