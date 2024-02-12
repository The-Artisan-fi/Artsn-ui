import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.scss";

import TextTransition, { presets } from "react-text-transition";

// image imports
// hero illustration
import heroIllustration from "../../assets/home/home-hero-illustration.webp";

// about
import aboutIllustration from "../../assets/home/home-about-illustration-1.webp";

// brand verticalcta
import brandVertical from "../../assets/brand-vertical.webp";

// horo section text animations
const heroTexts = [
    "Watches",
    "Art",
    "Cars",
    "Wine",
    "Whisky",
    "Memorabilia",
];

// data for partners
import PartnersMarque from "../../components/PartnersMarque/PartnersMarque";
import OpportunitiesSection from "../../components/OpportunitiesSection/OpportunitiesSection";
import CTA1Card from "../../components/CtaCard1/CtaCard1";
import CTA2Card from "../../components/CtaCard2/CtaCard2";
import ProductsSection from "../../components/ProductsSection/ProductsSection";

const Home = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(
            () => setIndex((index) => index + 1),
            3000 // every 3 seconds
        );
        return () => clearTimeout(intervalId);
    }, []);

    return (
        <div className="home">
            {/* Header Section */}
            <div className="home__header">
                <Navbar />
                <div className="home__hero ">
                    <div className="container">
                        <h1 className="display-2  uppercase">
                            <span className="highlight">Own Digitally</span>{" "}
                            <TextTransition
                                style={{ color: "#fff" }}
                                springConfig={presets.gentle}
                                direction="down"
                            >
                                {heroTexts[index % heroTexts.length]}
                            </TextTransition>
                        </h1>
                        <h2 className="heading-1">
                            Collect & Trade Luxury Goods
                        </h2>
                        <a href="https://tally.so/r/mYWaJz" className="btn btn-gold">
                            JOIN THE WAITLIST
                        </a>

                        <div
                            src={heroIllustration}
                            alt=""
                            className="home__hero__illustration"
                        ></div>
                    </div>
                </div>
            </div>

            {/* partners section */}
            <PartnersMarque />

            {/* about section */}
            <section className="home__about padding">
                <div className="boxed">
                    <div className="home__about__illustration">
                        <img
                            src={aboutIllustration}
                            alt=""
                            className="home__about__illustration__img"
                        />
                    </div>
                    <div className="home__about__content">
                        <div className="home__about__content__col col-1">
                            {/* item 1 */}
                            <div className="home__about__content__col__item item-1">
                                <h3 className="heading-4">
                                    Collect Fractions of High-End Collectibles
                                </h3>
                                <p className="caption-2">
                                    Own a percentage of a Certified Authentic Luxury Good
                                    stored in secured vaults.
                                </p>
                            </div>

                            {/* item 2 */}
                            <div className="home__about__content__col__item item-2">
                                <h3 className="heading-4">
                                    Historical Returns
                                </h3>
                                <p className="caption-2">
                                    In the past 7 years, both the Luxury Watch 
                                    Market and the Artprice100 index have 
                                    outperformed the S&P 500, respectively by 
                                    117% and 800%.
                                </p>
                            </div>

                            {/* item 3 */}
                            <div className="home__about__content__col__item item-3">
                                <h3 className="heading-4">Real World Assets</h3>
                                <p className="caption-2">
                                    Top-tier goods are distinguished by limited supply and high demand
                                </p>
                            </div>
                        </div>

                        <div className="home__about__content__col col-2">
                            {/* item 4 */}
                            <div className="home__about__content__col__item item-4">
                                <h3 className="heading-4">
                                    Trade Your Fractions 24/7
                                </h3>
                                <p className="caption-2">
                                    Trade Fractions freely in the secondary
                                    market.{" "}
                                </p>
                            </div>

                            {/* item 5 */}
                            <div className="home__about__content__col__item item-5">
                                <h3 className="heading-4">Get access to our Decentralize Finance Protocol</h3>
                                <p className="caption-2">
                                    Use your Real World Assets as a collateral for loans and
                                    more.{" "}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products section */}
            {<ProductsSection />}

            {/*<OpportunitiesSection />*/}

            {/* cta  */}
            <section className="home__cta padding">
                <div className="boxed">
                    <img
                        src={brandVertical}
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
            </section>

            {/* cta  part 2*/}
            <div className="home__bottom-cta padding">
                <div className="boxed">
                    <CTA1Card />
                    <CTA2Card />
                </div>
            </div>
        </div>
    );
};

export default Home;
