import graphene
import viterbi.schema
import adacs_sso_plugin.schema


class Query(viterbi.schema.Query, adacs_sso_plugin.schema.Query, graphene.ObjectType):
    pass


class Mutation(viterbi.schema.Mutation, adacs_sso_plugin.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
