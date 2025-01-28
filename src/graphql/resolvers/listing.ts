import { connectToDatabase } from '@/config/mongodb'
import { Context } from '@/types/resolver-types'
import { IResolvers } from '@graphql-tools/utils'
import { Sort } from 'mongodb'

// Using MongoDB's Sort type instead of custom interface
interface ListingQueryOptions {
  sort?: { [key: string]: 1 | -1 }
  limit?: number
  offset?: number
}

export const listingResolvers: IResolvers<any, Context> = {
  Query: {
    getListing: async (
      _parent: any,
      { associatedId }: { associatedId: string }
    ) => {
      const { db } = await connectToDatabase()
      const listing = await db.collection('listings').findOne({ associatedId })
      return listing
    },

    getAllListings: async (
      _parent: any,
      { sort, limit, offset }: ListingQueryOptions = {}
    ) => {
      const { db } = await connectToDatabase()
      let query = db.collection('listings').find()

      // Apply sorting if provided
      if (sort) {
        query = query.sort(sort as Sort)
      }

      // Apply pagination if provided
      if (typeof offset === 'number') {
        query = query.skip(offset)
      }
      if (typeof limit === 'number') {
        query = query.limit(limit)
      }

      const listings = await query.toArray()
      return listings
    },

    getListingsByNetReturn: async (
      _parent: any,
      { limit, offset }: { limit?: number; offset?: number } = {}
    ) => {
      const { db } = await connectToDatabase()
      let query = db
        .collection('listings')
        .find()
        .sort({ expectedNetReturn: -1 } as Sort)

      if (typeof offset === 'number') {
        query = query.skip(offset)
      }
      if (typeof limit === 'number') {
        query = query.limit(limit)
      }

      return await query.toArray()
    },

    getRecentListings: async (
      _parent: any,
      { limit, offset }: { limit?: number; offset?: number } = {}
    ) => {
      const { db } = await connectToDatabase()
      let query = db
        .collection('listings')
        .find()
        .sort({ createdAt: -1 } as Sort)

      if (typeof offset === 'number') {
        query = query.skip(offset)
      }
      if (typeof limit === 'number') {
        query = query.limit(limit)
      }

      return await query.toArray()
    },

    getMostSoldListings: async (
      _parent: any,
      { limit, offset }: { limit?: number; offset?: number } = {}
    ) => {
      const { db } = await connectToDatabase()
      let query = db
        .collection('listings')
        .find()
        .sort({ sold: -1 } as Sort)

      if (typeof offset === 'number') {
        query = query.skip(offset)
      }
      if (typeof limit === 'number') {
        query = query.limit(limit)
      }

      return await query.toArray()
    },
  },
}
