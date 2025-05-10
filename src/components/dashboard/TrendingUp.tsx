// TrendingUp.tsx
'use client'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { useQuery } from '@apollo/client'
import { GET_LISTINGS_BY_SALES } from '@/graphql/queries/listing'
import { Skeleton } from '../ui/skeleton'
import { useRouter } from 'next/navigation'

const TrendingUp = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery(GET_LISTINGS_BY_SALES, {
    variables: { limit: 1 }, // Get the most sold listing
  })

  if (loading) {
    return <LoadingSkeleton />
  }
  console.log('data', data)
  if (error) {
    return (
      <Card className="h-full w-full rounded-3xl border-zinc-300 bg-bg text-secondary dark:border-zinc-700">
        <CardContent className="flex h-full items-center justify-center p-6">
          <p className="text-red-500">Failed to load trending item</p>
        </CardContent>
      </Card>
    )
  }

  const trendingListing = data?.getAllListings[0]

  if (!trendingListing) {
    return (
      <Card className="h-full w-full rounded-3xl border-zinc-300 bg-bg text-secondary dark:border-zinc-700">
        <CardContent className="flex h-full items-center justify-center p-6">
          <p>No listings available</p>
        </CardContent>
      </Card>
    )
  }

  const roi = (
    (trendingListing.expectedNetReturn / trendingListing.marketValue) *
    100
  ).toFixed(1)

  return (
    <Card
      className="h-full w-full rounded-3xl border-zinc-300 bg-bg text-secondary dark:border-zinc-700"
      onClick={() => router.push(`/product/${trendingListing.associatedId}`)}
    >
      <CardContent className="flex h-full flex-col justify-between p-6">
        <h2 className="text-xl font-semibold text-secondary">Trending Up</h2>

        <Image
          src={trendingListing.images?.[0] || '/products/watch.png'}
          alt={trendingListing.assetDetails || 'Trending Item'}
          width={200}
          height={200}
          className="max-h-1/3 w-full rounded-xl object-contain"
        />

        <div className="grid grid-cols-2 gap-10">
          <div className="flex items-end gap-1">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-zinc-300">Total Sales</p>
              <h1 className="text-3xl text-secondary">
                {trendingListing.sold}
              </h1>
            </div>
            <p className="text-sm text-zinc-300">+{roi}%</p>
          </div>
          <div className="flex items-end gap-1">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-zinc-300">Market Value</p>
              <h1 className="text-3xl text-secondary">
                ${trendingListing.marketValue.toLocaleString()}
              </h1>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Shared loading skeleton component
const LoadingSkeleton = () => {
  return (
    <Card className="h-full w-full rounded-3xl border-zinc-300 bg-bg text-secondary dark:border-zinc-700">
      <CardContent className="flex h-full flex-col justify-between p-6">
        <Skeleton className="mb-8 h-8 w-32" />
        <Skeleton className="my-8 h-44 w-full" />
        <div className="grid grid-cols-2 gap-10">
          <div>
            <Skeleton className="mb-2 h-4 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div>
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TrendingUp
