import { merge } from 'lodash';
import { userResolvers } from './user';
import { authResolvers } from './auth';
import { listingResolvers } from './listing';
import { IResolvers } from '@graphql-tools/utils';
import { Context } from '@/types/resolver-types';

export const resolvers: IResolvers<any, Context> = merge(
  {},
  userResolvers,
  authResolvers,
  listingResolvers
);