import datetime
from django.test import testcases
from graphene_django.utils.testing import GraphQLTestCase
from gw_viterbi.schema import schema
from adacs_sso_plugin.adacs_user import ADACSAnonymousUser, ADACSUser
from adacs_sso_plugin.test_client import ADACSSSOSessionClient
from adacs_sso_plugin.constants import AUTHENTICATION_METHODS


class ViterbiTestCase(GraphQLTestCase, testcases.TestCase):
    """
    Viterbi test classes should inherit from this class.

    It overrides some settings that will be common to most viterbi test cases.

    Attributes
    ----------

    GRAPHQL_SCHEMA : schema object
        Uses the viterbi schema file as the default schema.

    GRAPHQL_URL : str
        Sets the graphql url to the current viterbi url.
    """

    GRAPHQL_SCHEMA = schema
    GRAPHQL_URL = "/graphql"
    client_class = ADACSSSOSessionClient

    DEFAULT_USER = {
        "is_authenticated": True,
        "id": 1,
        "name": "buffy summers",
        "primary_email": "slayer@gmail.com",
        "emails": ["slayer@gmail.com"],
        "authentication_method": "password",
        "authenticated_at": 0,
        "fetched_at": 0,
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # We always want to see the full diff when an error occurs.
        self.maxDiff = None
        self.user = ADACSAnonymousUser()

    def authenticate(self, user=None, **kwargs):
        """Authenticate a user for testing."""
        if user is not None:
            # Django User model passed - convert to ADACS user dict
            user_dict = {
                **ViterbiTestCase.DEFAULT_USER,
                "id": user.id,
                "name": f"{user.first_name} {user.last_name}",
                "authenticated_at": datetime.datetime.now(tz=datetime.UTC).timestamp(),
                "fetched_at": datetime.datetime.now(tz=datetime.UTC).timestamp(),
                **kwargs,
            }
        else:
            # Direct user dict passed via kwargs
            user_dict = {
                **ViterbiTestCase.DEFAULT_USER,
                "authenticated_at": datetime.datetime.now(tz=datetime.UTC).timestamp(),
                "fetched_at": datetime.datetime.now(tz=datetime.UTC).timestamp(),
                **kwargs,
            }
            
        self.client.authenticate(user_dict)
        self.user = ADACSUser(**user_dict)

    def deauthenticate(self):
        self.client.deauthenticate()
        self.user = ADACSAnonymousUser()

    def assertResponseHasNoErrors(self, resp, msg=None):
        """Check that the GraphQL response has no errors"""
        return self.assertResponseNoErrors(resp, msg)

    def assertResponseHasErrors(self, resp, msg=None):
        """Check that the GraphQL response has errors"""
        content = resp.json()
        self.assertIn("errors", content, msg or content)

    # Add a .data parameter as a result of doing a query
    def query(self, *args, **kwargs):
        response = super().query(*args, **kwargs)
        response_json = response.json()
        response.data = response_json["data"] if "data" in response_json else None
        response.errors = response_json["errors"] if "errors" in response_json else None
        return response

