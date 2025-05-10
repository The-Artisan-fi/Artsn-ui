'use client'
// import { useState, useEffect } from 'react';
// import Breadcrumb from "./components/Breadcrumb";
// import SidebarFilter from "./components/Sidebar";
// import ProductCard from "@/components/product/components/ProductCard";
// import RelatedProductCard from "@/components/product/components/ProductRelated";
// import ReferralCard from "./components/ReferralCard";
// import TabSwitcher from "./components/TabSwitcher";
// import {
//   useArtisanProgram,
// } from '@/components/blockchain/protocolAccess';

// const products = [
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/images/product.png",
//   },
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/images/product.png",
//   },
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/images/product.png",
//   },
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/images/product.png",
//   },
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/images/product.png",
//   },
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/images/product.png",
//   },
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/images/product.png",
//   },
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/images/product.png",
//   },
// ];

// const related_products = [
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/products/car5.svg",
//     icon: "/icons/car-icon.svg",
//   },
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/products/freak-watch.png",
//     icon: "/icons/watch-icon.svg",
//   },
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/products/car7.png",
//     icon: "/icons/car-icon.svg",
//   },
//   {
//     name: "Patek Philippe",
//     price: "$1",
//     imageUrl: "/products/diamonds2.png",
//     icon: "/icons/diamond-icon.svg",
//   },
// ];

// export default function Marketplace() {
//   const { listings, watches, profiles, getProgramAccount } = useArtisanProgram();
//   const [allListings, setAllListings] = useState<any[]>([]);
//   const [allWatches, setAllWatches] = useState<any[]>([]);
//   const [allDiamonds, setAllDiamonds] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     if (listings.data && allListings.length === 0) {
//       console.log('listings', listings.data);
//       // filter out the watches and diamonds based on the listings.data[0].account.objectType , it is either listings.data[0].account.objectType.watch or listings.data[0].account.objectType.diamond
//       const allWatches = listings.data.filter((listing: any) => listing.account.objectType === 'watch');
//       const allDiamonds = listings.data.filter((listing: any) => listing.account.objectType === 'diamond');
//       setAllWatches(allWatches);
//       setAllDiamonds(allDiamonds);
//       setAllListings(listings.data);
//       setLoading(false)
//     }
//   }, [listings]);
//   return (
//     <div className="mt-20">
//       <Breadcrumb />
//       <div className="bg-gray-light min-h-screen px-6 py-5 border border-b-gray">
//         {/* <div className="max-w-screen-xl mx-auto flex mb-4">
//           <div className="w-full">
//             <TabSwitcher />
//           </div>
//         </div> */}
//         <div className="max-w-screen-xl mx-auto flex flex-wrap">
//           {/* Sidebar Filter */}
//           <div className="hidden md:flex w-full md:w-1/4 md:pr-4 mb-4">
//             <SidebarFilter />
//           </div>

//           {/* Product Grid */}
//           {!loading && (
//             <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
//               {allListings.map((account, index) => (
//                 <>
//                   {index === 2 && <ReferralCard key="referral-card" />}{" "}
//                   {/* Insert ReferralCard at the 7th position */}
//                   <ProductCard
//                     // key={index}
//                     // name={product.name}
//                     // price={product.price}
//                     // imageUrl={product.imageUrl}
//                     key={index}
//                     image={account.publicKey}
//                     account={account.account.object}
//                     listing={account.account}
//                   />
//                 </>
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="max-w-screen-xl mx-auto flex my-6">
//           <div className="w-1/4 hidden md:block"></div>
//           {/* <div className="w-full md:w-3/4 flex justify-center gap-3">
//             <button className="text-gray-500 border-gray text-xs px-4 py-2.5 rounded-2xl">
//               Previous
//             </button>
//             <button className="bg-black text-white text-xs px-4 py-2.5 rounded-2xl flex gap-2 justify-around items-center">
//               Next
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={3}
//                 stroke="#fff"
//                 className="size-3 mt-0.5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="m8.25 4.5 7.5 7.5-7.5 7.5"
//                 />
//               </svg>
//             </button>
//           </div> */}
//         </div>

//         {/* <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-4 my-16">
//           <div className="rounded-3xl flex flex-col justify-center">
//             <h1 className="min-w-52 leading-snug text-4xl">
//               Other
//               <span className="block italic">Categories</span>
//               of Products
//             </h1>
//           </div>
//           <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-3">
//             {related_products.map((product, index) => (
//               <RelatedProductCard
//                 key={index}
//                 name={product.name}
//                 imageUrl={product.imageUrl}
//                 icon={product.icon}
//               />
//             ))}
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Breadcrumb from './components/Breadcrumb'
import SidebarFilter from './components/Sidebar'
import ProductCard from '@/components/product/components/ProductCard'
import ReferralCard from './components/ReferralCard'
import { useArtisanProgram } from '@/components/blockchain/protocolAccess'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'

export type ObjectType = 'all' | 'watch' | 'diamond'

export interface FilterState {
  objectType: ObjectType
  model: string[]
  color: string[]
  movement: string[]
  priceRange: {
    min: number
    max: number
  }
}

export interface AvailableFilters {
  objectTypes: ObjectType[]
  models: string[]
  colors: string[]
  movements: string[]
}

export interface SidebarFilterProps {
  filters: FilterState
  onFilterChange: (newFilters: Partial<FilterState>) => void
  availableFilters: AvailableFilters
}

const Marketplace = () => {
  const { listings } = useArtisanProgram()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState(12)
  const [visibleProducts, setVisibleProducts] = useState<any[]>([])
  const loadMoreRef = useRef<HTMLDivElement>(null)
  
  const [filters, setFilters] = useState<FilterState>({
    objectType: 'all',
    model: [],
    color: [],
    movement: [],
    priceRange: {
      min: 0,
      max: Infinity,
    },
  })

  const umi = useMemo(
    () =>
      createUmi(
        'https://soft-cold-energy.solana-devnet.quiknode.pro/ad0dda04b536ff45a76465f9ceee5eea6a048a8f'
      ),
    []
  )
  
  // Define filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Apply objectType filter
      if (
        filters.objectType !== 'all' &&
        getObjectType(product.account.objectType) !== filters.objectType
      ) {
        return false
      }

      // Apply model filter
      if (
        filters.model.length > 0 &&
        !filters.model.includes(product.details?.model || '')
      ) {
        return false
      }

      // Apply color filter
      if (
        filters.color.length > 0 &&
        !filters.color.includes(product.details?.color || '')
      ) {
        return false
      }

      // Apply movement filter
      if (
        filters.movement.length > 0 &&
        !filters.movement.includes(product.details?.movement || '')
      ) {
        return false
      }

      // Apply price filter
      if (
        Number(product.account.price.toString()) < filters.priceRange.min ||
        (filters.priceRange.max !== Infinity &&
          Number(product.account.price.toString()) > filters.priceRange.max)
      ) {
        return false
      }

      return true
    })
  }, [products, filters])

  // Initialize visibleProducts when filteredProducts changes
  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, pageSize))
  }, [filteredProducts, pageSize])

  // Implement intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && filteredProducts.length > visibleProducts.length) {
          setVisibleProducts(prev => [
            ...prev, 
            ...filteredProducts.slice(prev.length, prev.length + pageSize)
          ])
        }
      },
      { threshold: 0.1 }
    )

    // Store the current value of the ref in a variable
    const currentRef = loadMoreRef.current
    
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [filteredProducts, visibleProducts.length, pageSize])

  // Fetch product details with batching and error handling
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!listings.data) return

      try {
        setLoading(true)
        setError(null)
        
        // Process in batches of 10 to avoid overwhelming the network
        const batchSize = 10
        const batches: any[][] = []
        
        for (let i = 0; i < listings.data.length; i += batchSize) {
          batches.push(listings.data.slice(i, i + batchSize))
        }
        
        let allProducts: any[] = []
        
        for (const batch of batches) {
          const productPromises = batch.map(async (listing: any) => {
            try {
              const productDetails = await fetchCollectionV1(
                umi,
                publicKey(listing.account.object.toString())
              )
  
              return {
                ...listing,
                details: productDetails,
                type: listing.account.objectType,
              }
            } catch (err) {
              console.error('Error fetching product details:', err)
              return null
            }
          })
  
          const batchResults = await Promise.all(productPromises)
          allProducts = [...allProducts, ...batchResults.filter((product: any) => product !== null)]
          
          // Update products incrementally as each batch completes
          setProducts(prevProducts => [...prevProducts, ...batchResults.filter((product: any) => product !== null)])
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product details:', error)
        setError('Failed to load products. Please try again later.')
        setLoading(false)
      }
    }

    // Reset products when listings change
    setProducts([])
    setVisibleProducts([])
    fetchProductDetails()
  }, [listings.data, umi])

  const getObjectType = (objectType: any): string => {
    if (objectType?.watch !== undefined) return 'watch'
    if (objectType?.diamond !== undefined) return 'diamond'
    return 'unknown'
  }

  // Inside your Marketplace component:
  const availableFilters: AvailableFilters = useMemo(() => {
    const initialFilters = {
      objectTypes: ['watch', 'diamond'] as ObjectType[],
      models: [] as string[],
      colors: [] as string[],
      movements: [] as string[],
    }

    if (!products?.length) return initialFilters

    products.forEach((product) => {
      // Get the correct object type
      const type = getObjectType(product.account.objectType)

      // Get all attributes from the product
      const attributes = product.details?.attributeList || []

      attributes.forEach((attr: any) => {
        const { key, value } = attr

        if (value) {
          switch (key) {
            case 'brand':
              if (!initialFilters.models.includes(value)) {
                initialFilters.models.push(value)
              }
              break
            case 'dialColor':
            case 'color':
              if (!initialFilters.colors.includes(value)) {
                initialFilters.colors.push(value)
              }
              break
            case 'movement':
              if (!initialFilters.movements.includes(value)) {
                initialFilters.movements.push(value)
              }
              break
          }
        }
      })
    })

    console.log('Available filters:', initialFilters)
    return initialFilters
  }, [products])

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    console.log('Applying filters:', newFilters)
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }

  return (
    <div className="mt-20">
      <Breadcrumb />
      <div className="bg-gray-light border-b-gray min-h-screen border px-6 py-5">
        <div className="mx-auto flex max-w-screen-xl flex-wrap">
          {/* <div className="hidden md:flex w-full md:w-1/4 md:pr-4 mb-4">
          <SidebarFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
            availableFilters={availableFilters}
          />
          </div> */}

          {error && (
            <div className="w-full rounded-md bg-red-50 p-4 text-center text-red-600">
              {error}
              <button 
                onClick={() => window.location.reload()} 
                className="ml-2 underline"
              >
                Try again
              </button>
            </div>
          )}

          {loading && products.length === 0 ? (
            <div className="flex w-full justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-black"></div>
            </div>
          ) : (
            <>
              <div className="grid w-full grid-cols-1 gap-3 md:w-full md:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.map((product, index) => (
                  <React.Fragment key={`${product.publicKey.toString()}-${index}`}>
                    {index === 2 && <ReferralCard />}
                    <ProductCard
                      image={product.publicKey}
                      account={product.account.object}
                      listing={product.account}
                      productDetails={product.details}
                    />
                  </React.Fragment>
                ))}
              </div>
              
              {visibleProducts.length < filteredProducts.length && (
                <div 
                  ref={loadMoreRef} 
                  className="mt-8 flex w-full justify-center py-4"
                >
                  <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-black"></div>
                </div>
              )}
              
              {visibleProducts.length === 0 && !loading && (
                <div className="flex w-full justify-center py-10 text-gray-500">
                  No products match your filters.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Marketplace
