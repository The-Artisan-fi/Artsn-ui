import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs } from './schema'
import { IResolvers } from '@graphql-tools/utils'
import { resolvers as rawResolvers } from './resolvers'

const resolvers: IResolvers<any, any> = rawResolvers

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
