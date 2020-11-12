import graphene
import viterbi.schema


class Query(viterbi.schema.Query, graphene.ObjectType):
    pass


class Mutation(viterbi.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
