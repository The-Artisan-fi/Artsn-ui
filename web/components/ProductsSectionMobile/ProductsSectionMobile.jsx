import "@/styles/ProductsSectionMobile.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter }from "next/navigation";
// import products from "@/components/Utils/productData";
import { fetchProducts } from "@/hooks/fetchProducts";
import ProductBorder from "@/public/assets/product-border-bg.png";
import Audemar from "@/public/assets/home/products/Audemars-piguet-Royaloak.webp";
const ProductsSectionMobile = () => {
    const [products, setProducts] = useState({ available: [], comingSoon: [] });
    const [productsLoading, setProductsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if(products.available.length > 0) return;
        fetchProducts().then((products) => {
            setProducts(products);
        });
        setProductsLoading(false);
    }, []);
    
    return (
        <section className="products ">
            {/* available */}
            <div className="products__available ">
                {productsLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="products__available__slider">
                        {products.available.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className="products__available__slider__item"
                                >
                                    <Image
                                        src={ProductBorder}
                                        alt="product border"
                                        className="products__available__slider__item__bg"
                                    />
                                    <div className="item-top">
                                        <Image
                                            src={Audemar}
                                            // src={item.image}
                                            alt="product"
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
                                                router.push(`/product/${item.accountPubkey.toString()}`)
                                                // router.push(`/product/1`);
                                            }}
                                        >
                                            <p className="text">COLLECT NOW</p>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* <div className="products__coming ">
                <h2 className="display">Coming soon</h2>
                {productsLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="products__coming__slider">
                        {products.comingSoon.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className="products__coming__slider__item"
                                >
                                    <Image
                                        src={ProductBorder}
                                        alt="product border"
                                        className="products__coming__slider__item__bg"
                                    />
                                    <div className="item-top">
                                        <Image
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
                )}
            </div> */}
        </section>
    );
};

export default ProductsSectionMobile;
