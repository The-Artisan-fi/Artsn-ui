import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";
import {
  useArtisanProgramAccount,
} from '@/components/protocol/protocol-data-access';
import { LoadingFeature } from '@/components/loading/loading-feature';
import { BN } from '@coral-xyz/anchor';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'
import { set } from "@metaplex-foundation/umi/serializers";
type Listing = {
  id: BN;
  objectType: any;
  object: PublicKey;
  share: number;
  shareSold: number;
  price: BN;
  startingTime: BN;
  bump: number;
};

const ProductCard = ({ account, listing, image }: { image: string, account: PublicKey, listing: Listing }) => {
  console.log('account ->', account.toString())
  const [loading, setLoading] = useState<boolean>(true);
  const [obj, setObj] = useState<any>(null);
  const umi = createUmi('https://soft-cold-energy.solana-devnet.quiknode.pro/ad0dda04b536ff45a76465f9ceee5eea6a048a8f'); 
  const _pubkey = publicKey(account.toString());
  const getObjInfo = async () => {
    const watch = await fetchCollectionV1(umi, _pubkey);
    console.log('watch ->', watch)
    setObj(watch.attributes?.attributeList);
    setLoading(false);
  };

  useEffect(() => {
    getObjInfo();
  }, []);

  return (
    <>
      {loading && <LoadingFeature />}
      {!loading && (

    <div className="bg-white rounded-3xl p-3.5 flex border-gray flex-col justify-between">
      <Image 
        src={`https://artisan-solana.s3.eu-central-1.amazonaws.com/${image}-0.jpg`}
        alt='listing image'
        width={300}
        height={300}
        className="w-full h-auto object-contain mb-4 rounded-2xl bg-gray"
      />
      <div className="flex justify-between items-center">
        <div>
          <Link href="/product">
            <h3 className="text-md text-black font-semibold font-urban">
              {obj[0].value.toString()} - {obj[1].value.toString()}
            </h3>
          </Link>
          <p className="text-gray-500 flex items-center gap-2">
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
        <Link href={`/product/${image}`} className="bg-black text-white px-4 py-2 rounded-2xl">
          Collect
        </Link>
      </div>
    </div>
    )}
    </>
  );
};

export default ProductCard;