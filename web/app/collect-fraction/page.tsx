'use client';
import CTA1Card from '@/components/CtaCard1/CtaCard1';
import '../../styles/CollectFraction.scss';
import { useState, useEffect } from 'react';
import ProductsSectionMobile from '@/components/ProductsSectionMobile/ProductsSectionMobile';
import ProductsSectionDesktop from '@/components/ProductsSectionDesktop/ProductsSectionDesktop';
import OpportunitiesSection from '@/components/OpportunitiesSection/OpportunitiesSection';

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
          <img
            src="/assets/collect-fraction/collect-fraction-hero-illustration.webp"
            alt=""
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