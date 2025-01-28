'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, Flame, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getListingByWatch } from '@/components/blockchain/umiAccess'
import { set } from '@metaplex-foundation/umi/serializers'
import { useRouter } from 'next/navigation'
// Sample data
const artisans = [
  {
    id: 1,
    name: 'John Doe',
    subName: '@johndoe',
    value: 5000,
    price: 10000,
    marketCap: 80000,
    totalOffer: 200,
  },
  {
    id: 2,
    name: 'Jane Smith',
    subName: '@janesmith',
    value: 6000,
    price: 12000,
    marketCap: 90000,
    totalOffer: 180,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    subName: '@bobjohnson',
    value: 4500,
    price: 9000,
    marketCap: 70000,
    totalOffer: 220,
  },
]

type TableProps = {
  assets?: any
}

const ArtisansTable = ({ assets }: TableProps) => {
  const [data] = useState(artisans)
  const [sortedAssets, setSortedAssets] = useState<
    { asset: any; quantity: number }[]
  >([])
  console.log('table ** assets ->', assets)
  const router = useRouter()
  // incoming assets need to be sorted because there are duplicates, so we need to into an array of objects { asset, quatity } and increment the quantity if the asset is already in the array
  //sort the array by asset name
  //return the sorted array
  const sortAssets = async (assets: any) => {
    const listingArray: any[] = []

    for (let i = 0; i < assets.length; i++) {
      const listing = await getListingByWatch(assets[i].grouping[0].group_value)

      if (!listing) {
        continue
      }

      if (listingArray.find((item) => item.associatedId === listing.listing)) {
        const index = listingArray.findIndex(
          (item) => item.associatedId === listing.listing
        )
        listingArray[index].quantity += 1
        continue
      }

      listingArray.push({
        ...assets[i],
        shares: listing.shares,
        sharesSold: listing.sharesSold,
        associatedId: listing.listing,
        price: listing.price,
        quantity: 1,
      })
    }

    listingArray.sort((a, b) => {
      if (!a.associatedId || !b.associatedId) return 0
      return a.associatedId.localeCompare(b.associatedId)
    })

    console.log('sortedAssets', listingArray)
    setSortedAssets(listingArray)
  }

  useEffect(() => {
    if (assets) {
      sortAssets(assets)
    }
  }, [assets])
  return (
    <>
      {sortedAssets.length > 0 ? (
        <Card className="w-ful rounded-3xl border-zinc-300 bg-bg text-secondary dark:border-zinc-700">
          <CardContent className="p-6">
            <div className="w-full bg-bg text-secondary">
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-2xl font-semibold">My Items</h2>
                <span className="text-sm text-zinc-300">{assets.length}</span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Market Cap</TableHead>
                    <TableHead>Total Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAssets.map((asset: any, index) => (
                    <TableRow
                      key={index}
                      onClick={() =>
                        router.push(`/product/${asset.associatedId}`)
                      }
                      className="cursor-pointer"
                    >
                      <TableCell className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage
                            src={`https://artisan-solana.s3.eu-central-1.amazonaws.com/${asset.associatedId}-0.jpg`}
                          />
                          <AvatarFallback>
                            {asset.content.metadata.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{asset.name}</div>
                          <div className="text-sm text-gray-500">
                            {asset.associatedId.slice(0, 4)}..
                            {asset.associatedId.slice(-4)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row items-center justify-center space-x-1">
                          {asset.quantity}
                          <TrendingUp size={16} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row items-center justify-center space-x-1">
                          <span>${asset.price.toLocaleString()}</span>
                          <Flame size={16} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row items-center justify-center space-x-1">
                          ${asset.shares * asset.price}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row items-center justify-center space-x-1">
                          <span>{asset.shares - asset.sharesSold}</span>
                          {/* <Flame size={16} /> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <SkeletonCard />
      )}
    </>
  )
}

const SkeletonCard = () => {
  return (
    <Card className="w-full rounded-3xl border-zinc-300 bg-bg text-secondary dark:border-zinc-700">
      <CardContent className="p-6">
        <div className="w-full bg-bg text-secondary">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="animate-pulse text-2xl font-semibold">
              Loading Items...
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead>Total Remaining</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(1)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="mb-1 h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="mb-1 h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default ArtisansTable
