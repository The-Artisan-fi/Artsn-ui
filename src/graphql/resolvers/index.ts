import { merge } from 'lodash'
import { userResolvers } from './user'
import { listingResolvers } from './listing'
import { IResolvers } from '@graphql-tools/utils'
import { Context } from '@/types/resolver-types'
import { GraphQLScalarType, Kind } from 'graphql'

// JSON scalar type
const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value) {
    return value // Value sent to the client
  },
  parseValue(value) {
    return value // Value from the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value);
      } catch (e) {
        return null;
      }
    }
    return null;
  },
})

export const resolvers: IResolvers<any, Context> = merge(
  {
    JSON: JSONScalar,
  },
  userResolvers,
  listingResolvers
)
