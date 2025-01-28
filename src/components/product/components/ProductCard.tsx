import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PublicKey } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'

type Listing = {
  id: BN
  objectType: any
  object: PublicKey
  share: number
  shareSold: number
  price: BN
  startingTime: BN
  bump: number
}

const ProductCard = ({
  account,
  listing,
  image,
  productDetails, // Now receiving pre-fetched details
}: {
  image: string
  account: PublicKey
  listing: Listing
  productDetails: any
}) => {
  return (
    <div className="border-gray flex flex-col justify-between rounded-3xl bg-white p-3.5">
      <Image
        src={`https://artisan-solana.s3.eu-central-1.amazonaws.com/${image}-0.jpg`}
        alt="listing image"
        width={300}
        height={300}
        className="bg-gray mb-4 h-auto w-full rounded-2xl object-contain"
      />
      <div className="flex items-center justify-between">
        <div>
          <Link href="/product">
            <h3 className="text-md font-urban font-semibold text-black">
              {productDetails.name}
            </h3>
          </Link>
          <p className="flex items-center gap-2 text-gray-500">
            <svg
              width="16"
              height="16"
              viewBox="0 0 17 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                y="0.53125"
                width="7.88045"
                height="7.88045"
                rx="1.12578"
                fill="#D9D9D9"
              />
              <rect
                x="9.00641"
                y="0.53125"
                width="7.88045"
                height="7.88045"
                rx="1.12578"
                fill="black"
              />
              <rect
                x="0.000183105"
                y="9.53906"
                width="7.88045"
                height="7.88045"
                rx="1.12578"
                fill="#D9D9D9"
              />
              <rect
                x="9.00641"
                y="9.53906"
                width="7.88045"
                height="7.88045"
                rx="1.12578"
                fill="#D9D9D9"
              />
            </svg>
            Starting from {Number(listing.price.toString())}
          </p>
        </div>
        <Link
          href={`/product/${image}`}
          className="rounded-2xl bg-black px-4 py-2 text-white"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
