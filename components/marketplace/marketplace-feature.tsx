'use client';
import { useState, useEffect } from 'react';
import Breadcrumb from "./components/breadcrumb-feature";
import SidebarFilter from "./components/sidebar-feature";
import ProductCard from "@/components/product/components/product-card-ui";
import RelatedProductCard from "@/components/product/components/product-related-feature";
import ReferralCard from "./components/referall-card-feature";
import TabSwitcher from "./components/tab-switcher-ui";
import {
  useArtisanProgram,
  useArtisanProgramAccount,
} from '@/components/protocol/protocol-data-access';
  

const products = [
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/product.png",
  },
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/product.png",
  },
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/product.png",
  },
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/product.png",
  },
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/product.png",
  },
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/product.png",
  },
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/product.png",
  },
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/product.png",
  },
];

const related_products = [
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/car.png",
  },
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/product.png",
  },
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/car.png",
  },
  {
    name: "Patek Philippe",
    price: "$1",
    imageUrl: "/images/product.png",
  },
];

export default function MarketplaceFeature() {
  const { listings, watches, profiles, getProgramAccount } = useArtisanProgram();
  const [allListings, setAllListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (listings.data) {
      console.log('all listings ->', listings.data);
      console.log('number 1 ->', listings.data[0].account.object)
      setAllListings(listings.data);
      setLoading(false)
    }
  }, [listings]);
  return (
    <div className="mt-20">
      <Breadcrumb />
      <div className="bg-gray-light min-h-screen px-6 py-5 border border-b-gray">
        <div className="max-w-screen-xl mx-auto flex mb-4">
          <div className="w-full">
            <TabSwitcher />
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto flex flex-wrap">
          {/* Sidebar Filter */}
          <div className="w-full md:w-1/4 md:pr-4 mb-4">
            <SidebarFilter />
          </div>

          {/* Product Grid */}
          {!loading && (
            <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
              {allListings.map((account, index) => (
                <>
                  {index === 6 && <ReferralCard key="referral-card" />}{" "}
                  {/* Insert ReferralCard at the 7th position */}
                  <ProductCard
                    // key={index}
                    // name={product.name}
                    // price={product.price}
                    // imageUrl={product.imageUrl}
                    key={index}
                    image={account.publicKey}
                    account={account.account.object}
                    listing={account.account}
                  />
                </>
              ))}
            </div>
          )}
        </div>
        <div className="max-w-screen-xl mx-auto flex my-6">
          <div className="w-1/4 hidden md:block"></div>
          <div className="w-full md:w-3/4 flex justify-center gap-3">
            <button className="text-gray-500 border-gray text-xs px-4 py-2.5 rounded-2xl">
              Previous
            </button>
            <button className="bg-black text-white text-xs px-4 py-2.5 rounded-2xl flex gap-2 justify-around items-center">
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="#fff"
                className="size-3 mt-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-4 my-16">
          <div className="rounded-3xl flex flex-col justify-center">
            <h1 className="min-w-52 leading-snug text-4xl">
              Other
              <span className="block italic">Categories</span>
              of Products
            </h1>
          </div>
          <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {related_products.map((product, index) => (
              <RelatedProductCard
                key={index}
                name={product.name}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
