"use client"
import { useState, useEffect } from "react";
import "@/styles/Home.scss";

// import TextTransition, { presets } from "react-text-transition";

// hero section text animations
const heroTexts = ["Watches", "Art", "Cars", "Wine", "Whisky", "Memorabilia"];

// data for partners
import PartnersMarque from "@/components/PartnersMarque/PartnersMarque";
import OpportunitiesSection from "@/components/OpportunitiesSection/OpportunitiesSection";
import CTA1Card from "@/components/CtaCard1/CtaCard1";
import CTA2Card from "@/components/CtaCard2/CtaCard2";
import ProductsSectionDesktop from "@/components/ProductsSectionDesktop/ProductsSectionDesktop";
import ProductsSectionMobile from "@/components/ProductsSectionMobile/ProductsSectionMobile";

// Images
import Image from "next/image";
import overlay from "@/public/assets/home/overlay.svg"
import arrow from "@/public/assets/arrow.svg"
import arrowBlur from "@/public/assets/arrow-blur.svg"
import homeAboutIllustration2 from "@/public/assets/home/home-about-illustration-2.webp"

const Home = () => {
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

    useEffect(() => {
        const fadeIn = () => {
          let opacityValue = 0;
          const fadeInInterval = setInterval(() => {
            opacityValue += 1 / 90; // Increment in opacity to reach 1 in 1.5 seconds
            setOpacity(opacityValue);
            if (opacityValue >= 1) {
              clearInterval(fadeInInterval);
              setTimeout(() => {
                const fadeOutInterval = setInterval(() => {
                  opacityValue -= 1 / 90; // Decrement in opacity to reach 0 in 1.5 seconds
                  setOpacity(opacityValue);
                  if (opacityValue <= 0) {
                    clearInterval(fadeOutInterval);
                    setIndex((prevIndex) => (prevIndex + 1) % heroTexts.length);
                  }
                }, 16.67); // 1000ms / 60 frames per second ≈ 16.67ms per frame
              }, 1500); // Wait for 1.5 seconds before starting fade out
            }
          }, 16.67); // 1000ms / 60 frames per second ≈ 16.67ms per frame
        };
    
        fadeIn();
    }, [index]);

    return (
        <div className="home">
            {/* Header Section */}
            <div className="home__header">
                <div className="home__hero ">
                    <div className="container">
                        <div className="header-container">
                            <h1 className="display-2">
                                <span className="highlight">
                                    Digitally Owned
                                </span>
                            </h1>
                            {/* <TextTransition
                                style={{ color: "#fff" }}
                                springConfig={presets.molasses}
                                direction="down"
                            >
                                {heroTexts[index % heroTexts.length]}
                            </TextTransition> */}
                            <span
                                // style={{ opacity: opacity }}
                                style={{ opacity: 1 }}
                                className="hero-text-transition"
                            >
                                {heroTexts[index % heroTexts.length]}
                            </span>
                        </div>
                        <div className="bottom">
                            <h2 className="heading-1">
                                Collect & Trade Luxury Goods
                            </h2>
                            <a href="https://tally.so/r/mYWaJz" className="btn-primary">
                                JOIN THE WAITLIST
                            </a>
                        </div>
                        <div
                            className="home__hero__illustration"
                        >
                            {/* <img
                                src="/assets/home/home-hero-illustration-1.webp"
                                alt=""
                                className="home__hero__illustration"
                            /> */}
                            <Image
                                className="overlay"
                                style={{ width: "100%" }}
                                src={overlay}
                                alt="overlay"
                            />
                        </div>
                        {/* <div className="home__hero__overlay"> */}
                            
                        {/* </div> */}
                    </div>
                </div>
            </div>

            {/* partners section */}
            <PartnersMarque />

            {/* about section */}
            <section className="home__about">
                <div className="boxed">
                    <div className="home__about__illustration">
                        {/* <img
                            src="/assets/home/home-about-illustration-1.webp"
                            alt=""
                            className="home__about__illustration__img1"
                        /> */}
                        <h1 className="home__about__illustration__primary">
                            Luxury Goods 
                            <br /><span className="emphasis">Grow.</span>
                        </h1>
                        <div className="home__about__illustration__img1">
                            <Image
                                src={arrow}
                                alt="arrow"
                                className="home__about__illustration__img1"
                                loading="lazy"
                            />
                        </div>
                        <div className="home__about__illustration__img2">
                            <Image
                                src={arrowBlur}
                                alt="arrow blur"
                                className="home__about__illustration__img2"
                                loading="lazy"
                            />
                        </div>
                        <Image
                            src={homeAboutIllustration2}
                            alt="about illustration"
                            className="home__about__illustration__img3"
                            loading="lazy"
                        />
                    </div>
                    <div className="home__about__content">
                        <div className="home__about__content__col col-1">
                            {/* item 1 */}
                            <div className="home__about__content__col__item item-1">
                                <h3 className="heading-4">
                                    Collect <span className="emphasis">Fraction</span> of 
                                    <br />
                                    High-End Collectibles
                                </h3>
                                <p className="caption-2">
                                    Own a % of Authentic Certified Luxury Good stored in secured volts.
                                </p>
                            </div>

                            {/* item 2 */}
                            <div className="home__about__content__col__item item-2">
                                <h3 className="heading-4">
                                    <span className="emphasis">Gain</span> Potentially
                                </h3>
                                <p className="caption-2">
                                    In the last 7 years the Luxury Watch Market outperformed the S&P 500 by 117% while Artprice100 index by 800%.
                                </p>
                            </div>

                            {/* item 3 */}
                            <div className="home__about__content__col__item item-3">
                                <h3 className="heading-4">
                                    <span className="emphasis">Real World</span> Assets
                                </h3>
                                <p className="caption-2">
                                    Top-Tier Goods are 
                                    characterized by Limited 
                                    Supply and High Demand. 
                                </p>
                            </div>
                        </div>

                        <div className="home__about__content__col col-2">
                            {/* item 4 */}
                            <div className="home__about__content__col__item item-4">
                                <p className="soon">
                                    soon
                                </p>
                                <h3 className="heading-4">
                                    Trade Your Fractions <span className="emphasis">24/7</span>
                                </h3>
                                <p className="caption-2">
                                    Trade Fractions freely in the secondary market.
                                </p>
                            </div>

                            {/* item 5 */}
                            <div className="home__about__content__col__item item-5">
                                <p className="soon">
                                    soon
                                </p>
                                <h3 className="heading-4">
                                    New <span className="emphasis">DeFinance</span>
                                </h3>
                                <p className="caption-2">
                                    Utilize your Real World Assets for loans and more. 
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products section */}
            {isMobile ? <ProductsSectionMobile /> : <ProductsSectionDesktop />}

            {/* Opportunities sectin */}
            <OpportunitiesSection />

            {/* cta  */}
            {/* <section className="home__cta padding">
                <div className="boxed">
                    <img
                        src="/assets/brand-vertical.webp"
                        alt=""
                        className="home__cta__brand"
                    />
                    <h3 className="caption-1">
                        Register & Diversify your Portfolio
                    </h3>
                    <a href="https://tally.so/r/mYWaJz" className="btn btn-primary">
                        JOIN THE WAITLIST                    
                    </a>
                </div>
            </section> */}

            {/* cta  part 2*/}
            <div className="home__bottom-cta ">
                {/* <div className="boxed"> */}
                    <CTA1Card />
                    <CTA2Card />
                {/* </div> */}
            </div>
        </div>
    );
};

export default Home;
