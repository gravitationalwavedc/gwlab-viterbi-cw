from django.test import testcases
from graphql_jwt.testcases import JSONWebTokenClient
from gw_viterbi.schema import schema
from graphql_jwt.shortcuts import get_token
from graphql_jwt.settings import jwt_settings


class ViterbiJSONWebTokenClient(JSONWebTokenClient):
    """Viterbi test client with a custom authentication method."""

    def authenticate(self, user, is_ligo=False):
        """Payload for authentication in viterbi requires a special userID parameter."""
        if user:
            self._credentials = {
                jwt_settings.JWT_AUTH_HEADER_NAME: "{0} {1}".format(
                    jwt_settings.JWT_AUTH_HEADER_PREFIX, get_token(user, userId=user.id, isLigo=is_ligo)
                ),
            }
        else:
            self._credentials = {}


class ViterbiTestCase(testcases.TestCase):
    """
    Viterbi test classes should inherit from this class.

    It overrides some settings that will be common to most viterbi test cases.

    Attributes
    ----------

    GRAPHQL_SCHEMA : schema object
        Uses the viterbi schema file as the default schema.

    GRAPHQL_URL : str
        Sets the graphql url to the current viterbi url.

    client_class : class
        Sets client to be a special viterbi specific object that uses a custom authentication.
        method.
    """

    GRAPHQL_SCHEMA = schema
    GRAPHQL_URL = "/graphql"
    client_class = ViterbiJSONWebTokenClient
