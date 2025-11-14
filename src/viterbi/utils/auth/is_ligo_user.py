from adacs_sso_plugin.constants import AUTHENTICATION_METHODS


def is_ligo_user(user):
    """
    Check if a user is a LIGO user based on their authentication method.
    
    :param user: The user object to check
    :return: True if the user is authenticated via LIGO Shibboleth, False otherwise
    """
    return (
        not user.is_anonymous 
        and hasattr(user, 'authentication_method')
        and user.authentication_method == AUTHENTICATION_METHODS["LIGO_SHIBBOLETH"]
    )
