'use client';
import '@/styles/CollectFraction.scss';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import CollectFractionImg from "@/public/assets/collect-fraction/collect-fraction-hero-illustration.webp"
import { LoadingSpinner } from '@/components/Loading/Loading';
const CTA1Card = dynamic(() => import("@/components/CtaCards/CtaCard1"), {
  loading: () => <LoadingSpinner/>,
  ssr: false,
});
const ProductsSectionDesktop = dynamic(() => import("@/components/ProductsSectionDesktop/ProductsSectionDesktop"), {
  loading: () => <LoadingSpinner/>,
  ssr: false,
});
const ProductsSectionMobile = dynamic(() => import("@/components/ProductsSectionMobile/ProductsSectionMobile"), {
  loading: () => <LoadingSpinner/>,
  ssr: false,
});
const OpportunitiesSection = dynamic(() => import("@/components/OpportunitiesSection/OpportunitiesSection"), {
  loading: () => <LoadingSpinner/>,
  ssr: false,
});

const CollectFraction = () => {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    if (window) {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setIsMobile(true);
        } else {
          // setIsMobile(false);
        }
      };

      // Attach the event listener for window resize
      window.addEventListener('resize', handleResize);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <div className="collect-fraction">
      <div className="collect-fraction__hero">
        <div className="boxed">
          {/* <img
            src="/assets/collect-fraction/collect-fraction-hero-illustration.webp"
            alt=""
            className="collect-fraction__hero__img"
          /> */}
          <Image
            src={CollectFractionImg}
            alt="hero illustration"
            className="collect-fraction__hero__img"
          />
          <h1 className="display-2">
            <span className="highlight-silver">Collect</span>{' '}
            <span className="highlight-yellow">Fractions</span>
          </h1>
          <h2 className="heading-5">
            Select the Item you Like & Get your Fragments
          </h2>
        </div>
      </div>

      {/* Products section */}
      {isMobile ? <ProductsSectionMobile /> : <ProductsSectionDesktop />}

      <OpportunitiesSection />

      <div className="collect-fraction__cta">
        <CTA1Card />
      </div>
    </div>
  );
};

export default CollectFraction;