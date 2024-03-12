import "@/styles/ProductsSectionMobile.scss";
import { useEffect, useState } from "react";
import { useRouter }from "next/navigation";
<<<<<<< HEAD
// import products from "@/components/Utils/productData";
import { fetchProducts } from "@/hooks/fetchProducts";
const ProductsSectionMobile = () => {
    const [products, setProducts] = useState({ available: [], comingSoon: [] });
    const router = useRouter();
    useEffect(() => {
        fetchProducts().then((products) => {
            console.log('listed products', products)
            setProducts(products);
        });
    }, []);
=======
import products from "@/components/Utils/productData";
import { fetchProducts } from "@/hooks/fetchProducts";
const ProductsSectionMobile = () => {
    // const [products, setProducts] = useState({ available: [], comingSoon: [] });
    const router = useRouter();
    // useEffect(() => {
    //     fetchProducts().then((products) => {
    //         console.log('listed products', products)
    //         setProducts(products);
    //     });
    // }, []);
>>>>>>> @{-1}
    return (
        <section className="products ">
            {/* available */}
            <div className="products__available ">
<<<<<<< HEAD
                <h2 className="display-3 uppercase">Currently Available</h2>
=======
                <h2 className="display">Currently available</h2>
>>>>>>> @{-1}

                <div className="products__available__slider">
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
                                    <h3 className="heading-6">
                                        {item.name} <br/>
                                        {item.description}
                                    </h3>

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

                                    <button 
                                        className="collect-btn"
                                        onClick={() => {
                                            // router.push(`/product/${item.accountPubkey.toString()}`)
                                            router.push(`/product/1`);
                                        }}
                                    >
                                        <p className="text">COLLECT NOW (TESTNET)</p>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="products__coming ">
                <h2 className="display">Coming soon</h2>

                <div className="products__coming__slider">
                    {products.comingSoon.map((item) => {
                        return (
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
                                <div className="item-body coming-soon" style={{marginTop: "20px"}}>
                                    <h3 className="heading-6">
                                        {item.name} <br/>
                                        {item.description}
                                    </h3>

                                    <div className="item-body-details">
                                        <div className="item-body-details-set">
                                            <p className="label-5 release">RELEASE</p>
                                            <p className="label-3 release-date">
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
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProductsSectionMobile;
