import "@/styles/ProductsSectionDesktop.scss";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter }from "next/navigation";
// SwiperJs for Carousel
import { Swiper, SwiperSlide } from "swiper/react";
import EmblaCarousel from "@/components/Ui/carousel/EmblaCarousel";
import { EmblaOptionsType } from 'embla-carousel'
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

// import required modules
import { FreeMode, Mousewheel } from "swiper";
import { fetchProducts } from "@/hooks/fetchProducts";
// import products from "@/components/Utils/productData";
import ProductBorder from "@/public/assets/product-border-bg.png";
import Audemar from "@/public/assets/home/products/Audemars-piguet-Royaloak.webp";

const ProductsSectionDesktop = () => {
    const [products, setProducts] = useState({ available: [], comingSoon: [] });
    const [productsLoading, setProductsLoading] = useState(true);
    const router = useRouter();
    const OPTIONS = { slidesToScroll: 'auto' }
    useEffect(() => {
        if(products.available.length > 0) return;
        fetchProducts().then((products) => {
            setProducts(products);
        });
        setProductsLoading(false);
    }, []);
    
    return (
        <section className="products ">
            {/* Available */}
            {!productsLoading && (
            <div className="products__available ">
                <p className="caption-1">Available</p>
                <div className="products__available__slider">
                    <EmblaCarousel slides={products.availableWatches} options={OPTIONS} />   
                </div>
                <div className="products__available__slider">
                    Diamonds
                    <EmblaCarousel slides={products.availableDiamonds} options={OPTIONS} />   
                </div>
            </div>
            )}
            {/* coming soon */}
            {!productsLoading && products.comingSoonWatches.length > 0 || products.conmingSoonDiamonds.length > 0 && (
            <div className="products__coming ">
                <div className="products__coming__slider">
                    <EmblaCarousel slides={products.comingSoonWatches} options={OPTIONS} />
                </div>
                <div className="products__available__slider">
                    <EmblaCarousel slides={products.conmingSoonDiamonds} options={OPTIONS} />   
                </div>
            </div>
            )}
        </section>
    );
};

export default ProductsSectionDesktop;
