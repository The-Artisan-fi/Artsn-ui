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
            <div className="products__available ">
                <div className="products__available__slider">
                    <EmblaCarousel slides={products.available} options={OPTIONS} />   
                </div>
            </div>
            {/* coming soon */}
            <div className="products__coming ">
                <div className="products__coming__slider">
                    <EmblaCarousel slides={products.comingSoon} options={OPTIONS} />
                </div>
            </div>
        </section>
    );
};

export default ProductsSectionDesktop;
