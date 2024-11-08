import { connectToDatabase } from '@/config/mongodb';
import { Context } from '@/types/resolver-types';
import { IResolvers } from '@graphql-tools/utils';

export const listingResolvers: IResolvers<any, Context> = {
  Query: {
    getListing: async (_parent: any, { associatedId }: { associatedId: string }) => {
      const { db } = await connectToDatabase();
      const listing = await db.collection('listings').findOne({ associatedId });
      return listing;
    },

    getAllListings: async () => {
      const { db } = await connectToDatabase();
      const listings = await db.collection('listings').find().toArray();
      return listings;
    }
  },
};
