'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useArtisanProgramAccount } from '../protocol/protocol-data-access';
import { fetchObjectDetails } from '@/components/protocol/protocol-umi-access';
import ProductSwiper from './components/product-swiper-feature';
import AssetInfo from './components/asset-info-feature';
import PriceHistory from './components/product-price-history-feature';
import Statistics from './components/product-statistics-feature';
import InvestmentSummary from './components/product-investment-summary-feature';
import AboutBrand from './components/product-about-brand-feature';
import MetadataLinks from './components/product-metadata-feature';
import { set } from '@metaplex-foundation/umi/serializers';
import { LoadingFeature } from '../loading/loading-feature';

interface ProductData {
  offChainData: any;
  onChainData: any;
  attributes: any[];
}

const ProductFeature: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [onChainData, setOnChainData] = useState<any>(null);
  const [offChainData, setOffChainData] = useState<any>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { listingQuery, loading: isListingLoading } = useArtisanProgramAccount({ account: new PublicKey(params.id) });

  const fetchOffChainData = async (id: string) => {
    const response = await fetch('/api/data/listing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const { asset } = await response.json();
    setOffChainData(asset);
    console.log('asset:', asset);
  };


  const fetchAttributes = async (object: any) => {
    
      const details = await fetchObjectDetails(object);
      console.log('details:', details);
      setAttributes(details!.attributes!.attributeList as any);
      setOnChainData((prev: any) => {
        return {
          ...prev,
          watchUri: details!.uri
        }
      })
  };

  useEffect(() => {
    if (params.id) {
      fetchOffChainData(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    if(!isListingLoading && listingQuery.data) {
      setOnChainData(listingQuery.data);
      const _data: any = listingQuery.data;
      console.log('listing data:', _data);
      const object = _data.object;
      fetchAttributes(object);
    }
  }, [isListingLoading, listingQuery.data]);

  useEffect(() => {
    if(offChainData && onChainData && attributes.length > 0) {
      setProductData({
        offChainData,
        onChainData,
        attributes
      });
      setLoading(false);
    }
  }, [offChainData, onChainData, attributes]);

  if (loading || !productData) {
    return <LoadingFeature />;
  }

  return (
    <div className="main mt-24">
      <div className="bg-gray-light min-h-screen px-6 py-5">
        <div className="max-w-screen-xl mx-auto flex flex-wrap">
          <div className="relative w-full md:px-16 md:w-1/2">
            <ProductSwiper  images={productData.offChainData.images}/>
          </div>
          <div className="w-full md:w-1/2">
            <AssetInfo asset={productData} />
            <PriceHistory />
            <Statistics />
            <InvestmentSummary />
            <AboutBrand />
            <MetadataLinks />
          </div>
        </div>
        {/* Related products section can be added here if needed */}
      </div>
    </div>
  );
};

export default ProductFeature;