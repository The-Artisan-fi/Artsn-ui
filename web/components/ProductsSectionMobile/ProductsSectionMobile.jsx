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
            console.log(products);
            setProducts(products);
        });
        setProductsLoading(false);
    }, []);

    
    return (
        <section className="products ">
            {productsLoading && <LoadingSpinner />}
            {/* available */}
            {!productsLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <p className="caption-1" style={{ marginBottom: '2rem' }}>Available Watches</p>
                    <div className="products__available" >
                        <div className="products__available__slider">
                            <EmblaCarousel slides={products.availableWatches} options={OPTIONS} />   
                        </div>
                    </div>
                    <p className="caption-1" style={{ marginBottom: '2rem' }}>Available Diamonds</p>
                    <div className="products__available" >
                        
                        <div className="products__available__slider">
                            <EmblaCarousel slides={products.availableDiamonds} options={OPTIONS} />   
                        </div>
                    </div>
                </div>
            )}
            {/* {!productsLoading && products.comingSoonWatches && products.comingSoonWatches.length > 0 || products.conmingSoonDiamonds.length > 0 && (
                <div className="products__coming ">
                    <h2 className="display">Coming soon</h2>
                    <div className="products__coming__slider">
                        <EmblaCarousel slides={products.comingSoonWatches} options={OPTIONS} />
                    </div>
                    <div className="products__available__slider">
                        <EmblaCarousel slides={products.conmingSoonDiamonds} options={OPTIONS} />   
                    </div>
                </div>
            )} */}
        </section>
    );
};

export default ProductsSectionMobile;
