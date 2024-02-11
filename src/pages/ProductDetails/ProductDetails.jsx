import "./ProductDetails.scss";

import Navbar from "../../components/Navbar/Navbar";
import { Progress, Collapse, Slider } from "antd";

import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";

const faqItems = [
    {
        key: "1",
        question: "Basic Info",
        answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
        key: "2",
        question: "Product Description",
        answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
        key: "3",
        question: "Certificate of Authenticity",
        answer: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    },
    {
        key: "4",
        question: "Asset Details",
        answer: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    },
];
// watch images
import watch1 from "../../assets/home/products/Audemars-piguet-Royaloak.webp";

// product gallery images
import galleryImage1 from "../../assets/product-details/product-image-1.webp";
import galleryImage2 from "../../assets/product-details/product-image-2.webp";
import galleryImage3 from "../../assets/product-details/product-image-3.webp";
import galleryImage4 from "../../assets/product-details/product-image-4.webp";

// slider products
import OpportunitiesSection from "../../components/OpportunitiesSection/OpportunitiesSection";
import CTA1Card from "../../components/CtaCard1/CtaCard1";
import ProductsSection from "../../components/ProductsSection/ProductsSection";

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
        original: galleryImage2,
        thumbnail: galleryImage2,
        originalHeight: "500px",
    },
    {
        original: galleryImage1,
        thumbnail: galleryImage1,
        originalHeight: "500px",
    },

    {
        original: galleryImage3,
        thumbnail: galleryImage3,
        originalHeight: "500px",
    },
    {
        original: galleryImage4,
        thumbnail: galleryImage4,
        originalHeight: "500px",
    },
];

const ProductDetails = () => {
    const product = LocalProducts;

    return (
        <div className="product-details">
            <div className="product-details__header">
                <Navbar />
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
                                <h1 className="heading-2">{product.name}</h1>
                                <h2 className="caption-1">{product.model}</h2>
                            </div>

                            <Progress
                                percent={70}
                                status="active"
                                showInfo={true}
                                strokeColor="#23B371"
                                trailColor="transparent"
                                strokeWidth={16}
                                className="product-details__hero__info__progress"
                            />

                            <div className="product-details__hero__info__set">
                                <h3 className="heading-6">Asset Information</h3>
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
                                <h3 className="heading-6"> Performance Info</h3>
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
                        <h2 className="heading-5">About</h2>

                        <Collapse expandIconPosition={"right"} size="large">
                            {faqItems.map((item) => (
                                <Collapse.Panel
                                    key={item.key}
                                    header={item.question}
                                >
                                    <p className="body white">{item.answer}</p>
                                </Collapse.Panel>
                            ))}
                        </Collapse>
                    </div>

                    {/* net return calculations */}
                    <div className="product-details__about__calc ">
                        <h3 className="heading-6">
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
            <ProductsSection />

            {/* Opportunities section */}
            <OpportunitiesSection />

            <div className="product-details__cta padding">
                <div className="boxed">
                    <CTA1Card />
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
