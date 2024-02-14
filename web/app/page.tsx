"use client"
import { useState, useEffect } from "react";
import "@/styles/Home.scss";

import TextTransition, { presets } from "react-text-transition";

// arrows for slider
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";

// SwiperJs for Carousel
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper";

// horo section text animations
const heroTexts = ["Watches", "Art", "Cars", "Wine", "Whisky", "Memorabilia"];

// data for products
import products from "@/components/Utils/productData";
import PartnersMarque from "@/components/PartnersMarque/PartnersMarque";

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
        <div className="home" suppressHydrationWarning>
            {/* Header Section */}
            <div className="home__header">
                <div className="home__hero padding">
                    <div className="boxed">
                        <div className="home__hero__content">
                            <span className="home__hero__content__heading italic">
                                <h1 className="heading-tertiary uppercase w-700">
                                    <span className="highlight-1">Invest</span>{" "}
                                    and own fractions of{" "}
                                </h1>
                                <h1 className="heading-lg uppercase">
                                    <span className="highlight-2">
                                        high-end Collectibles
                                    </span>{" "}
                                    <TextTransition
                                        springConfig={presets.gentle}
                                        direction="down"
                                    >
                                        {heroTexts[index % heroTexts.length]}
                                    </TextTransition>
                                </h1>
                            </span>

                            <div className="home__hero__content__switz-made">
                                <img
                                    src="/home/switz-icon.png"
                                    alt="Switz Logo"
                                    className="switz-logo"
                                />
                                <p className="body-small uppercase w-200">
                                    Made in Switzerland
                                </p>
                            </div>

                            <div className="home__hero__content__cta">
                                <h3 className="heading-quaternary uppercase">
                                    Trade real world asset and diversify your
                                    portfolio
                                </h3>

                                <a
                                    href="#"
                                    className="btn btn-yellow uppercase"
                                >
                                    Invest Now
                                </a>
                            </div>
                        </div>
                        <div className="home__hero__illustration">
                            <img
                                src="/home/home-hero-img.webp"
                                alt=""
                                className="home__hero__illustration__img"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* partners section */}
            <PartnersMarque />

            {/* CTA section */}
            <section className="home__cta ">
                <div className="home__cta__row-1">
                    <div className="home__cta__row-1__content">
                        <h2 className="heading-primary">
                            Invest in fraction of High-End Collectibles
                        </h2>
                        <h3 className="heading-secondary w-300">
                            Own a % of Authentic Certified Watches stored in
                            secured volts.
                        </h3>
                        <a href="#" className="btn btn-primary">
                            Learn More
                        </a>
                        {/* mob only btn */}
                        <a href="#" className="btn-link-mob">
                            <span className="text">Learn More </span>
                            <FaArrowRight className="icon" />
                        </a>
                    </div>
                    <div className="home__cta__row-1__illustration"></div>
                </div>
                <div className="home__cta__row-2">
                    <div className="home__cta__row-2__illustration"></div>
                    <div className="home__cta__row-2__content">
                        <h2 className="heading-primary">
                            Trade your fraction 24/7
                        </h2>
                        <h3 className="heading-secondary w-300">
                            Trade Fractions freely in the secondary market.
                        </h3>
                        <a href="#" className="btn btn-primary">
                            Invest Now
                        </a>

                        {/* mob only btn */}
                        <a href="#" className="btn-link-mob">
                            <div className="span text">Invest Now</div>
                            <FaArrowRight className="icon" />
                        </a>
                    </div>
                </div>
            </section>

            {/* why watches */}
            <section className="home__why-watches">
                <div className="home__why-watches__top padding">
                    <h2 className="heading-primary">
                        Why Luxury Collectibles as investment?
                    </h2>
                </div>
                <div className="home__why-watches__body padding">
                    <div className="boxed">
                        <div className="home__why-watches__content">
                            <h2 className="heading-primary">
                                Return potentiality
                            </h2>
                            <h3 className="heading-tertiary  ">
                                In the last 7 years the Luxury Watch Market
                                outperformed the S&P 500 by 117% while
                                Artprice100 index by 800%.
                            </h3>
                        </div>
                        <div className="home__why-watches__graph">
                            <img
                                src="/home/home-graph-img.webp"
                                alt=""
                                className="home__why-watches__graph__img"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* real-world assets section */}

            <section className="home__real-assets padding">
                <div className="boxed">
                    <h2 className="heading-primary w-500">Real World Assets</h2>
                    <h3 className="heading-tertiary">
                        Top-Tier Goods are characterized by Limited Supply and
                        High Demand.
                    </h3>

                    <h3 className="heading-tertiary">
                        Via The Artisan you will be able to own a % of an
                        high-end asset class with the benefits included.
                    </h3>
                </div>
            </section>

            {/* products sections */}
            <section className="home__products padding">
                {/* available */}
                <div className="home__products__available boxed">
                    <h2 className="heading-secondary uppercase">
                        Currently Available
                    </h2>

                    <div className="home__products__available__slider">
                        <IoChevronBackOutline className="prev-avail" />
                        <Swiper
                            slidesPerView="auto"
                            spaceBetween={30}
                            slidesPerGroup={1}
                            loop={true}
                            loopFillGroupWithBlank={true}
                            navigation={{
                                nextEl: ".next-avail",
                                prevEl: ".prev-avail",
                            }}
                            modules={[Navigation]}
                            className="mySwiper"
                            breakpoints={{
                                // when window width is >= 768px
                                768: {
                                    slidesPerView: 3,
                                },
                            }}
                        >
                            {products.available.map((item) => {
                                return (
                                    <SwiperSlide key={item.id}>
                                        <div className="home__products__available__slider__item">
                                            <div className="item-top">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="item-top-img"
                                                />
                                            </div>
                                            <div className="item-body">
                                                <p className="body-xs w-600">
                                                    {item.increment}
                                                </p>
                                                <div className="item-body-details">
                                                    <p className="body-small w-600  uppercase">
                                                        {item.name}
                                                    </p>
                                                    <a
                                                        href="#"
                                                        className="btn btn-primary-small "
                                                    >
                                                        INVEST
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                        <IoChevronForwardOutline className="next-avail" />
                    </div>
                </div>

                <div className="home__products__coming boxed">
                    <h2 className="heading-secondary uppercase">Coming Soon</h2>

                    <div className="home__products__coming__slider">
                        <IoChevronBackOutline className="prev-coming" />
                        <Swiper
                            slidesPerView="auto"
                            spaceBetween={30}
                            slidesPerGroup={1}
                            loop={true}
                            loopFillGroupWithBlank={true}
                            navigation={{
                                nextEl: ".next-coming",
                                prevEl: ".prev-coming",
                            }}
                            modules={[Navigation]}
                            className="mySwiper"
                            breakpoints={{
                                // when window width is >= 768px
                                768: {
                                    slidesPerView: 2,
                                },
                                1250: {
                                    slidesPerView: 3,
                                },
                            }}
                        >
                            {products.comingSoon.map((item) => {
                                return (
                                    <SwiperSlide key={item.id}>
                                        <div className="home__products__coming__slider__item">
                                            <div className="item-top">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="item-top-img"
                                                />
                                            </div>
                                            <div className="item-body">
                                                <p className="body-xs w-600">
                                                    {item.increment}
                                                </p>
                                                <div className="item-body-details">
                                                    <p className="body-small w-600  uppercase">
                                                        {item.name}
                                                    </p>
                                                    <p className="btn btn-primary-small">
                                                        {item.releaseDate}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                        <IoChevronForwardOutline className="next-coming" />
                    </div>
                </div>
            </section>

            {/* opportunities */}
            <div className="home__opportunities padding">
                <div className="boxed">
                    <h2 className="heading-secondary">
                        discover the investments opportunities:
                    </h2>

                    {/* cards grid */}
                    <div className="home__opportunities__cards">
                        <div className="home__opportunities__cards__item card-1">
                            <h3 className="heading-secondary">The Fi</h3>
                            <p className="body-regular">
                                Trade fractions of Original Certified Watches.
                            </p>
                        </div>
                        <div className="home__opportunities__cards__item card-2">
                            <h3 className="heading-secondary">The Market</h3>
                            <p className="body-regular">
                                Discover and buy original certified watches.{" "}
                            </p>
                        </div>
                        <div className="home__opportunities__cards__item card-3">
                            <h3 className="heading-secondary">The Boutique</h3>
                            <p className="body-regular">
                                Discover our investments opportunity via a
                                digital experience{" "}
                            </p>
                        </div>
                    </div>

                    {/* cta row 3 */}
                    <section className="home__cta__row-3">
                        <h2 className="heading-primary">Start Now</h2>
                        <h3 className="heading-secondary w-400">
                            register & diversify your investments
                        </h3>
                        <a href="#" className="btn btn-primary">
                            INVEST
                        </a>
                    </section>
                </div>
            </div>

            {/* cta */}

            <div className="home__bottom-cta padding">
                <div className="boxed">
                    {/* row 1 */}
                    <div className="home__bottom-cta__row-1">
                        <h2 className="heading-primary">
                            Don’t miss any opportunity
                        </h2>
                        <h3 className="heading-secondary w-300">
                            Stay updated and discover all the news in The
                            Artisan
                        </h3>

                        <div className="home__bottom-cta__row-1__sub">
                            <input
                                placeholder="Enter your Email"
                                type="text"
                                className="subscribe-input"
                            />
                            <a href="#" className="btn btn-primary">
                                {" "}
                                SUBSCRIBE
                            </a>
                        </div>
                        <a href="#" className="btn btn-primary discord-btn">
                            <img src="/assets/discord-icon.svg" alt="" className="icon" />
                            <div className="text">JOIN DISCORD COMMUNITY</div>
                        </a>
                    </div>

                    {/* row 2 */}
                    <div className="home__bottom-cta__row-2 ">
                        <h2 className="heading-primary">
                            Diversify your Portfolio & invest in Real World
                            Assets
                        </h2>
                        <h3 className="heading-secondary w-300">
                            Welcome in our high-end ownership and trade
                            platform.
                        </h3>
                        <a href="#" className="btn btn-primary uppercase">
                            Start Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
