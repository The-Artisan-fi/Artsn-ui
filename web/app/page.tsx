"use client"
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import "@/styles/Home.scss";
import TextTransition, { presets } from 'react-text-transition';
// import TextTransition, { presets } from "react-text-transition";
import { toastSuccess } from "@/helpers/toast";
import { useWallet } from "@solana/wallet-adapter-react";
// hero section text animations
const heroTexts = ["Watches", "Art", "Cars", "Wine", "Whisky", "Memorabilia"];

// Images
import Image from "next/image";
import solanaSwissIcon from '@/public/assets/home/solana-swiss-icons.webp';
import aboutIllustration from '@/public/assets/home/home-about-illustraiton.webp';

import homeBriefIllustration from '@/public/assets/home/home-brief-illustraiton.webp';

import overlay from "@/public/assets/home/overlay.svg"
import arrow from "@/public/assets/arrow.svg"
import arrowBlur from "@/public/assets/arrow-blur.svg"
import homeAboutIllustration2 from "@/public/assets/home/home-about-illustration-2.webp"
// how it works images
import howWorks1 from '@/public/assets/home/how-it-works-1.webp';
import howWorks2 from '@/public/assets/home/how-it-works-2.webp';
import howWorks3 from '@/public/assets/home/how-it-works-3.webp';
import howWorks4 from '@/public/assets/home/how-it-works-4.webp';
import howWorks5 from '@/public/assets/home/how-it-works-5.webp';
import { Overlay } from "antd/es/popconfirm/PurePanel";

const PartnersMarque = dynamic(() => import("@/components/PartnersMarque/PartnersMarque"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});
const CTA1Card = dynamic(() => import("@/components/CtaCards/CtaCard1"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});
const CTA2Card = dynamic(() => import("@/components/CtaCards/CtaCard2"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});
const ProductsSectionDesktop = dynamic(() => import("@/components/ProductsSectionDesktop/ProductsSectionDesktop"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});
const ProductsSectionMobile = dynamic(() => import("@/components/ProductsSectionMobile/ProductsSectionMobile"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});
const OpportunitiesSection = dynamic(() => import("@/components/OpportunitiesSection/OpportunitiesSection"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});

const howItWorks = [
    {
      img: howWorks1,
      title: 'We acquire Luxury Goods.',
      description: 'We selectively choose potential value-appreciating items.',
    },
    {
      img: howWorks2,
      title: 'Certification of authenticity.',
      description:
        'A third-party will handle the creation of the necessary documents to ensure the value of the asset.',
    },
    {
      img: howWorks3,
      title: 'We securely store assets in a third-party vault..',
      description:
        'Our trusted partners will securely store the assets in a vault, which we will then share with our users.',
    },
    {
      img: howWorks4,
      title: 'We tokenize and generate digital twins of the goods.',
      description:
        'We utilize blockchain technology to create digital tokens that legally represent ownership of the assets.',
    },
    {
      img: howWorks5,
      title: 'Available for purchase online. Your chance to buy.',
      description:
        'You can purchase the tokens representing shares of the specific asset you desire.',
    },
  ];

const Home = () => {
    const { publicKey } = useWallet();
    const [index, setIndex] = useState(0);
    const [opacity, setOpacity] = useState(0);
    const [isMobile, setIsMobile] = useState(true);

    // create a function that increases the opacity state by 0.1 every 150ms, when it reaches 1 start to decrease it by 0.1 every 150ms
    function increaseOpacity() {
        if (opacity < 1) {
            setOpacity((prev) => prev + 0.1);
            setTimeout(increaseOpacity, 150);
        } else {
            decreaseOpacity();
        }
    }

    function decreaseOpacity() {
        if (opacity > 0) {
            setOpacity((prev) => prev - 0.1);
            setTimeout(decreaseOpacity, 150);
        } else {
            increaseOpacity();
        }
    }

    
    useEffect(() => {
        if(window){
            const handleResize = () => {
                if(window.innerWidth < 768){
                    setIsMobile(true);
                } else {
                    // setIsMobile(false);
                }
            };

            // Attach the event listener for window resize
            window.addEventListener("resize", handleResize);

            // Clean up the event listener on component unmount
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    // useEffect(() => {
    //     const fadeIn = () => {
    //       let opacityValue = 0;
    //       const fadeInInterval = setInterval(() => {
    //         opacityValue += 1 / 90; // Increment in opacity to reach 1 in 1.5 seconds
    //         setOpacity(opacityValue);
    //         if (opacityValue >= 1) {
    //           clearInterval(fadeInInterval);
    //           setTimeout(() => {
    //             const fadeOutInterval = setInterval(() => {
    //               opacityValue -= 1 / 90; // Decrement in opacity to reach 0 in 1.5 seconds
    //               setOpacity(opacityValue);
    //               if (opacityValue <= 0) {
    //                 clearInterval(fadeOutInterval);
    //                 setIndex((prevIndex) => (prevIndex + 1) % heroTexts.length);
    //               }
    //             }, 16.67); // 1000ms / 60 frames per second ≈ 16.67ms per frame
    //           }, 1500); // Wait for 1.5 seconds before starting fade out
    //         }
    //       }, 16.67); // 1000ms / 60 frames per second ≈ 16.67ms per frame
    //     };
    
    //     fadeIn();
    // }, [index]);
    
    useEffect(() => {
        const intervalId = setInterval(
          () => setIndex((index) => index + 1),
          3000 // every 3 seconds
        );
        return () => clearTimeout(intervalId);
    }, []);

    useEffect(() => {
      if(publicKey){
        toastSuccess("Public key found");
      }
    }, [publicKey]);

    return (
        <div className="home">
          <div className="home__hero padding">
            {/* <div className="hero-overlay"></div> */}
            <Image
              className="hero-overlay"
              src={overlay}
              alt="overlay"
            />
            <div className="home__hero__content">
              <h2 className="display-2 highlight">Digitally Owned</h2>
              <TextTransition
                style={{ color: '#fff' }}
                springConfig={presets.molasses}
                direction="down"
              >
                <h2 className="transition-text">
                  {heroTexts[index % heroTexts.length]}
                </h2>
              </TextTransition>{' '}
              <h3 className="heading-5">Collect & Trade Luxury Goods</h3>
              <a href="https://tally.so/r/mYWaJz" className="btn btn-gold">
                JOIN THE WAITLIST
              </a>
              <Image className="solana-swiss-icons" src={solanaSwissIcon} alt="" />
            </div>
          </div>
    
          {/* partners section */}
          <PartnersMarque />
    
          <div className="home__about padding">
            <div className="boxed">
              <div className="home__about__illustration">
                <Image
                  className="home__about__illustration__img"
                  src={aboutIllustration}
                  alt="about illustration"
                />
              </div>
              <div className="home__about__content">
                <p className="heading-6">
                  In the past decade, certain Luxury Assets have demonstrated
                  superior performance compared to the S&P 500.
                </p>
                <p className="heading-6">
                  Luxury Markets and Vintage collections tend to appreciate over
                  time, yet they often remain out of reach for the majority of
                  individuals.
                </p>
                <p className="heading-6">
                  {' '}
                  We offer the opportunity to access these markets through
                  digitization with a starting investment of just $100.
                </p>
              </div>
            </div>
          </div>
    
          {/* Briefing section */}
          <section className="home__brief padding">
            <div className="boxed">
              {/* top */}
              <div className="home__brief__top">
                <div className="home__brief__top__content">
                  <h2 className="heading-2">
                    You collect shares of goods, we handle everything else.
                  </h2>
                  <p className="caption-1">
                    All Luxury Goods on our platform are authenticated, certified,
                    and securely stored in a third-party vault.
                  </p>
                  <p className="caption-1">
                    We carefully curate assets, selecting only those identified by
                    our expert team as having potential for value appreciation.
                  </p>
                  <div className="home__brief__cta">
                    <a href="#" className="home__brief__button">
                      + certified & authentic goods
                    </a>
                    <a href="#" className="home__brief__button">
                      + transparency
                    </a>
                  </div>
                </div>
    
                <div className="home__brief__top__illustration">
                  <Image
                    className="home__brief__top__illustration__img"
                    src={homeBriefIllustration}
                    alt="about illustration"
                  />
                </div>
              </div>
    
              {/* bottom */}
              <div className="home__brief__bottom">
                {/* card light */}
                <div className="home__brief__bottom__card-light">
                  <h2 className="heading-2">Designed for non-experts.</h2>
                  <h3 className="heading-5">(Enjoy a seamless Web3 experience)</h3>
                  <p className="caption-1">
                    Thanks to our Solana-based solution, you have the flexibility to
                    choose how to connect and pay on the platform, ensuring a
                    straightforward experience and the transparency of Web3
                    technology.
                  </p>
    
                  <div className="home__brief__cta">
                    <a href="#" className="home__brief__button">
                      sign in with email or wallet
                    </a>
                    <a href="#" className="home__brief__button">
                      pay with credit card or crypto
                    </a>
                  </div>
                </div>
    
                {/* card dark */}
                <div className="home__brief__bottom__card-dark">
                  <h2 className="heading-2">
                    Collect and admire your curated collection.{' '}
                  </h2>
                <p className="caption-1">
                    You will have the ability to trade your shares and redeem the
                    value you&apos;ve accrued over time with The Artisan.
                </p>
    
                  <div className="home__brief__cta">
                    <a href="#" className="home__brief__button light-button">
                      value appreciation &uarr;
                    </a>
                    <a href="#" className="home__brief__button light-button">
                      metaverse ready
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
    
          {/* products section */}
          <section className="home__featured padding">
            <div className="boxed">
              <h2 className="heading-1">
                Explore the collections available on the platform.
              </h2>
    
              <div className="home__featured__items-cont">
                {/* Products section */}
                {isMobile ? <ProductsSectionMobile /> : <ProductsSectionDesktop />} 
              </div>
            </div>
          </section>
    
          <div className="home__bottom-cta padding">
            {/* <div className="boxed"> */}
            <CTA1Card />
    
            {/* hwo it works section */}
            <section className="home__working ">
              <div className="boxed">
                <h2 className="heading-1">How It Works</h2>
                <div className="home__working__steps">
                  {howItWorks.map((step, index) => {
                    return (
                      <div key={index} className="home__working__item">
                        <Image
                          src={step.img}
                          alt="how it works"
                          className="home__working__item__img"
                        />
                        <h3 className="heading-3">{step.title}</h3>
                        <p className="caption-3">{step.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
    
            <CTA2Card />
            {/* </div> */}
          </div>
        </div>
    );
};

export default Home;
