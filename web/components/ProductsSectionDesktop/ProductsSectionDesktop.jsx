import "@/styles/ProductsSectionDesktop.scss";
// SwiperJs for Carousel
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

// import required modules
import { FreeMode, Mousewheel } from "swiper";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, Connection } from "@coral-xyz/anchor";
import { IDL, PROGRAM_ID } from "@/components/Utils/idl";

const formatDateToDddMmm = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const minute = date.getMinutes();

    const paddedDay = day.toString().padStart(2, '0');
    const paddedMinute = minute.toString().padStart(2, '0');

    return `${paddedDay}::${paddedMinute}`;
};

const ProductsSectionDesktop = () => {
    const [products, setProducts] = useState({ available: [], comingSoon: [] });

    useEffect(() => {
        const fetchProducts = async () => {
            const provider = new AnchorProvider(new Connection("http://localhost:8899"), null, {});
            const program = new Program(IDL, PROGRAM_ID, provider);

            try {
                const productList = await program.account.listing.all();
                const currentTime = Math.floor(Date.now() / 1000);
                
                const availableProducts = productList.filter(product => product.account.starting_time < currentTime);
                const comingSoonProducts = productList.filter(product => product.account.starting_time >= currentTime);

                setProducts({
                    available: availableProducts.map(product => ({
                        id: product.account.id,
                        name: product.account.name,
                        image: product.account.img,
                        fractionsLeft: `${product.account.share_sold} / ${product.account.share}`,
                        startingPrice: `${product.account.price} USD`,
                        earningPotential: "TBD",
                    })),
                    comingSoon: comingSoonProducts.map(product => ({
                        id: product.account.id,
                        name: product.account.name,
                        image: product.account.img,
                        releaseDate: formatDateToDddMmm(product.account.starting_time),
                        startingPrice: `${product.account.price} USD`,
                        earningPotential: "TBD",
                    })),
                });
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
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
                        {products.comingSoon.map((item) => {
                            return (
                                <SwiperSlide key={item.id}>
                                    <div
                                        key={item.id}
                                        className="products__available__slider__item"
                                    >
                                        <img
                                            src={borderBg}
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
