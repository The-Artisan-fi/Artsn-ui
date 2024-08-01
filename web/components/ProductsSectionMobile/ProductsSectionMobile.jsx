import "@/styles/ProductsSectionMobile.scss";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { useRouter }from "next/navigation";
// import products from "@/components/Utils/productData";
import { fetchProducts } from "@/hooks/fetchProducts";
import EmblaCarousel from "@/components/Ui/carousel/EmblaCarousel";
import { LoadingSpinner } from "@/components/Loading/Loading";
import ProductBorder from "@/public/assets/product-border-bg.png";
import Audemar from "@/public/assets/home/products/Audemars-piguet-Royaloak.webp";
import { set } from "date-fns";
const ProductsSectionMobile = () => {
    const [products, setProducts] = useState({ available: [], comingSoon: [] });
    const [tabIndex, setTabIndex] = useState(0);
    const [productsLoading, setProductsLoading] = useState(true);
    const router = useRouter();
    const OPTIONS = { slidesToScroll: 'auto' }
    const handleTabChange = (index) => {
        // divide products by 3, then round up to the nearest whole number
        const maxIndex = Math.ceil(products.available.length / 3) - 1;

        if(index <= maxIndex) { 
            setTabIndex(index);
        } else {
            setTabIndex(0);
        }
    };

    useEffect(() => {
        if(products.available.length > 0) return;
        fetchProducts().then((products) => {
            setProducts(products);
        });
        setProductsLoading(false);
    }, []);

    useEffect(() => {
        if(products.available.length > 3) {
            const interval = setInterval(() => {
                handleTabChange(tabIndex + 1);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [products.available, tabIndex]);
    
    return (
        <section className="products ">
            {/* available */}
            <div className="products__available ">
                {productsLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="products__available__slider">
                        <EmblaCarousel slides={products.available} options={OPTIONS} />
                    </div>
                )}
            </div>
            {products.comingSoon.length > 0 && (
                <div className="products__coming ">
                    <h2 className="display">Coming soon</h2>
                    {productsLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="products__coming__slider">
                            {products.comingSoon.map((item) => {
                                return (
                                    <div
                                        key={item.id}
                                        className="products__coming__slider__item"
                                    >
                                        <EmblaCarousel slides={products.comingSoon} options={OPTIONS} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default ProductsSectionMobile;
