"use client"
import "@/styles/ProductDetails.scss";

import { Progress, Collapse, Slider } from "antd";

// import { useParams } from "react-router-dom";

// arrows for slider
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";

// SwiperJs for Carousel
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper";

import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";

const faqItems = [
    {
        key: "1",
        label: "Basic Info",
        children: <p className="body white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
    },
    {
        key: "2",
        label: "Product Description",
        children: <p className="body white">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
    },
    {
        key: "3",
        label: "Certificate of Authenticity",
        children: <p className="body white">Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
    },
    {
        key: "4",
        label: "Asset Details",
        children: <p className="body white">Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
    },
];
// watch images
import watch1 from "../../../public/home/products/Audemars-piguet-Royaloak.webp";

// product gallery images
import galleryImage1 from "../../../public/product-details/product-image-1.webp";
import galleryImage2 from "../../../public/product-details/product-image-2.webp";
import galleryImage3 from "../../../public/product-details/product-image-3.webp";
import galleryImage4 from "../../../public/product-details/product-image-4.webp";

// slider products
import products from "@/components/Utils/productData";

// products data
const LocalProducts = {
    id: 1,
    name: "Audemars Piguet",
    model: "Royal Oak (extra thin)",
    price: 100,
    currency: "CHF",
    img: watch1,
    sold: 150,
    total: 300,
    stockTag: "Almost Sold Out!",

    // stats
    fractionLeft: 0,
    pastReturns: "+22,00%",
    pastReturnsSuffix: "p.a.",
    earningPotential: "+8,1%",
    earningPotentialSuffix: "p.a.",
    earningPotentialDuration: "Over 5 years",

    // product page
    expectedNetReturn: "+8,1%",
    offerViews: 3002,

    investUrl: "#",

    // description
    description:
        "Experience the iconic Royal Oak, whose pioneering design and craftsmanship embody Audemars Piguet's uncompromising vision of luxury.",
    gallery: [galleryImage1, galleryImage2, galleryImage3, galleryImage4],
};

const images = [
    {
        original: "/product-details/product-image-2.webp",
        thumbnail: "/product-details/product-image-2.webp",
        originalHeight: 500,
    },
    {
        original: "/product-details/product-image-1.webp",
        thumbnail: "/product-details/product-image-1.webp",
        originalHeight: 500,
    },

    {
        original: "/product-details/product-image-3.webp",
        thumbnail: "/product-details/product-image-3.webp",
        originalHeight: 500,
    },
    {
        original: "/product-details/product-image-4.webp",
        thumbnail: "/product-details/product-image-4.webp",
        originalHeight: 500,
    },
];

const ProductDetails = () => {
    // const { id } = useParams();

    const product = LocalProducts;

    return (
        <div className="product-details">
            <div className="product-details__header">
                <div className="product-details__hero padding">
                    <div className="boxed">
                        <div className="product-details__hero__illustration">
                            <ImageGallery
                                showNav={false}
                                showPlayButton={false}
                                showBullets={true}
                                items={images}
                            />
                        </div>

                        <div className="product-details__hero__info">
                            <div className="product-details__hero__info__header">
                                <h1 className="heading-1">{product.name}</h1>
                                <h2 className="heading-2">{product.model}</h2>
                            </div>

                            <Progress
                                percent={70}
                                status="active"
                                showInfo={true}
                                strokeColor="#23B371"
                                trailColor="transparent"
                                size={16}
                                className="product-details__hero__info__progress"
                            />

                            <div className="product-details__hero__info__set">
                                <h3 className="heading-3">Asset Information</h3>
                                <div className="product-details__hero__info__set__cont">
                                    <div className="market-value">
                                        <p className="body">Market Value</p>
                                        <p className="heading-2 w-700">
                                            35,000 €
                                        </p>
                                    </div>
                                    <div className="fraction-left">
                                        <p className="body">Market Value</p>
                                        <p className="heading-2 w-700">
                                            35,000 €
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="product-details__hero__info__set">
                                <h3 className="heading-3"> Performance Info</h3>
                                <div className="product-details__hero__info__set__cont">
                                    <div className="past-returns">
                                        <p className="body">Past Returns</p>
                                        <p className="heading-2">
                                            <span className="w-700">
                                                +21,87%{" "}
                                            </span>
                                            <span className="body-xs">
                                                p.a.
                                            </span>
                                        </p>
                                    </div>
                                    <div className="earning-potential">
                                        <p className="body">
                                            <span>Earning Potential</span>
                                            <span className="body-tiny">
                                                (over 5 years)
                                            </span>
                                        </p>
                                        <p className="heading-2">
                                            <span className="w-700">
                                                +8,7%{" "}
                                            </span>
                                            <span className="body-xs">
                                                p.a.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <a href="#" className="btn btn-white">
                                INVEST IN FRACTIONS
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-details__about padding">
                <div className="boxed">
                    {/* faqs (about) section */}
                    <div className="product-details__about__faq ">
                        <h2 className="heading-2">About</h2>

                        <Collapse expandIconPosition={"end"} size="large" items={faqItems} defaultActiveKey={['1']} className="body white">
                            {/* {faqItems.map((item) => (
                                <Collapse.Panel
                                    key={item.key}
                                    header={item.question}
                                >
                                    <p className="body white">{item.answer}</p>
                                </Collapse.Panel>
                            ))} */}
                        </Collapse>
                    </div>

                    {/* net return calculations */}
                    <div className="product-details__about__calc ">
                        <h3 className="heading-3">
                            Calculate your Earning Potential
                        </h3>
                        <p className="body">1 = 100 USDC</p>
                        <Slider
                            className="product-details__about__calc__range"
                            defaultValue={30}
                        />
                        <div className="product-details__about__calc__returns">
                            <p>Expected Net Return</p>
                            <p className="green">+27,61 USDC</p>
                        </div>
                    </div>
                </div>
            </div>

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
                            <h3 className="heading-secondary">Invest</h3>
                            <p className="body-regular">
                                Trade fractions of Original Certified Watches.
                            </p>
                        </div>
                        <div className="home__opportunities__cards__item card-2">
                            <h3 className="heading-secondary">
                                The Marketplace
                            </h3>
                            <p className="body-regular">
                                Discover and buy original certified watches.{" "}
                            </p>
                        </div>
                        <div className="home__opportunities__cards__item card-3">
                            <h3 className="heading-secondary">
                                The Meta Boutique
                            </h3>
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

export default ProductDetails;
