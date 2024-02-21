import "@/styles/ProductsSectionDesktop.scss";
import { useState, useEffect } from "react";
import { useRouter }from "next/navigation";
// SwiperJs for Carousel
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

// import required modules
import { FreeMode, Mousewheel } from "swiper";
import { fetchProducts } from "@/hooks/fetchProducts";

const ProductsSectionDesktop = () => {
    const [products, setProducts] = useState({ available: [], comingSoon: [] });
    const router = useRouter();
    useEffect(() => {
        fetchProducts().then((products) => {
            setProducts(products);
        });
    }, []);
    
    return (
        <section className="products ">
            {/* Available */}
            <div className="products__available ">
                <div className="products__available__slider">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={20}
                        slidesPerGroup={1}
                        loop={false}
                        freeMode={true}
                        mousewheel={true}
                        modules={[FreeMode, Mousewheel]}
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
                        <SwiperSlide>
                            <div className="products__available__slider__item-1">
                                <h2 className="display-3 uppercase">
                                    Currently Available
                                </h2>
                            </div>
                        </SwiperSlide>
                        {products.available.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className="products__available__slider__item"
                                    onClick={() => {
                                        router.push(`/product/${item.accountPubkey.toString()}`)
                                    }}
                                >
                                    <img
                                        src="/assets/product-border-bg.png"
                                        alt=""
                                        className="products__available__slider__item__bg"
                                    />
                                    <div className="item-top">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="item-top-img"
                                        />
                                    </div>
                                    <div className="item-body">
                                        <h3 className="heading-6">{item.name}</h3>

                                        <div className="item-body-details">
                                            <div className="item-body-details-set">
                                                <p className="label-5">
                                                    FRACTIONS LEFT
                                                </p>
                                                <p className="label-3">
                                                    {item.fractionsLeft}
                                                </p>
                                            </div>

                                            <div className="item-body-details-set">
                                                <p className="label-5">
                                                    STARTING FROM
                                                </p>
                                                <p className="label-3">
                                                    {item.startingPrice}
                                                </p>
                                            </div>

                                            <div className="item-body-details-set">
                                                <p className="label-5">
                                                    EARNING POTENTIAL
                                                </p>
                                                <p className="label-3 green">
                                                    {item.earningPotential}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
            {/* coming soon */}
            <div className="products__coming ">
                <div className="products__coming__slider">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={20}
                        slidesPerGroup={1}
                        loop={false}
                        freeMode={true}
                        mousewheel={true}
                        modules={[FreeMode, Mousewheel]}
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
                        <SwiperSlide>
                            <div className="products__coming__slider__item-1">
                                <h2 className="display-3 uppercase">
                                    Coming Soon
                                </h2>
                            </div>
                        </SwiperSlide>
                        {products.comingSoon.map((item) => {
                            return (
                                <SwiperSlide key={item.id}>
                                    <div
                                        key={item.id}
                                        className="products__coming__slider__item"
                                    >
                                        <img
                                            src="/assets/product-border-bg.png"
                                            alt=""
                                            className="products__coming__slider__item__bg"
                                        />
                                        <div className="item-top">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="item-top-img"
                                            />
                                        </div>
                                        <div className="item-body">
                                            <h3 className="heading-6">
                                                {item.name}
                                            </h3>

                                            <div className="item-body-details">
                                                <div className="item-body-details-set">
                                                    <p className="label-5">
                                                        RELEASE
                                                    </p>
                                                    <p className="label-3">
                                                        {item.releaseDate}
                                                    </p>
                                                </div>

                                                <div className="item-body-details-set">
                                                    <p className="label-5">
                                                        STARTING FROM
                                                    </p>
                                                    <p className="label-3">
                                                        {item.startingPrice}
                                                    </p>
                                                </div>

                                                <div className="item-body-details-set">
                                                    <p className="label-5">
                                                        EARNING POTENTIAL
                                                    </p>
                                                    <p className="label-3 green">
                                                        {item.earningPotential}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default ProductsSectionDesktop;
