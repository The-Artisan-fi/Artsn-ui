"use client"
import "@/styles/ProductDetails.scss";
import { useState, useEffect } from "react";
import { Progress, Collapse, Slider } from "antd";
import { fetchProductDetails } from "@/hooks/fetchProductDetails";
import ProductsSectionDesktop from "@/components/ProductsSectionDesktop/ProductsSectionDesktop";
import ProductsSectionMobile from "@/components/ProductsSectionMobile/ProductsSectionMobile";
import OpportunitiesSection from "@/components/OpportunitiesSection/OpportunitiesSection";
import CTA1Card from "@/components/CtaCard1/CtaCard1";
import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";
import { useLazyQuery } from "@apollo/client";
import { listing } from "@/lib/queries";
import { Transaction, Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { toast } from "react-toastify";

type ProductDetails = {
    id: number;
    mint: string;
    name: string;
    image: string;
    fractionsLeft: string;
    startingPrice: string;
    earningPotential: string;
};

// const faqItems = [
//     {
//         key: "1",
//         question: "Basic Info",
//         answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     },
//     {
//         key: "2",
//         question: "Product Description",
//         answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
//     },
//     {
//         key: "3",
//         question: "Certificate of Authenticity",
//         answer: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
//     },
//     {
//         key: "4",
//         question: "Asset Details",
//         answer: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
//     },
// ];


// products data
// const LocalProducts = {
//     id: 1,
//     name: "Audemars Piguet",
//     model: "Royal Oak (extra thin)",
//     price: 100,
//     currency: "CHF",
//     img: "/assets/home/products/Audemars-piguet-Royaloak.webp",
//     sold: 150,
//     total: 300,
//     stockTag: "Almost Sold Out!",

//     // stats
//     fractionLeft: 0,
//     pastReturns: "+22,00%",
//     pastReturnsSuffix: "p.a.",
//     earningPotential: "+8,1%",
//     earningPotentialSuffix: "p.a.",
//     earningPotentialDuration: "Over 5 years",

//     // product page
//     expectedNetReturn: "+8,1%",
//     offerViews: 3002,

//     investUrl: "#",

//     // description
//     description:
//         "Experience the iconic Royal Oak, whose pioneering design and craftsmanship embody Audemars Piguet's uncompromising vision of luxury.",
//     gallery: [
//         "/assets/product-details/product-image-1.webp",
//         "/assets/public/product-details/product-image-2.webp",
//         "/assets/public/product-details/product-image-3.webp",
//         "/assets/public/product-details/product-image-4.webp",
//     ],
// };

// const images = [
//     {
//         original: "/assets/product-details/product-image-2.webp",
//         thumbnail: "/assets/product-details/product-image-2.webp",
//         originalHeight: 500,
//     },
//     {
//         original: "/assets/product-details/product-image-1.webp",
//         thumbnail: "/assets/product-details/product-image-1.webp",
//         originalHeight: 500,
//     },

//     {
//         original: "/assets/product-details/product-image-3.webp",
//         thumbnail: "/assets/product-details/product-image-3.webp",
//         originalHeight: 500,
//     },
//     {
//         original: "/assets/product-details/product-image-4.webp",
//         thumbnail: "/assets/product-details/product-image-4.webp",
//         originalHeight: 500,
//     },
// ];

export default function ProductDetails({ params }: { params: { id: string } }) {
    const { publicKey, sendTransaction } = useWallet();
    const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
        "confirmed"
    );
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([
        {
            original: "/assets/product-details/product-image-2.webp",
            thumbnail: "/assets/product-details/product-image-2.webp",
            originalHeight: 500,
        },
        {
            original: "/assets/product-details/product-image-1.webp",
            thumbnail: "/assets/product-details/product-image-1.webp",
            originalHeight: 500,
        },

        {
            original: "/assets/product-details/product-image-3.webp",
            thumbnail: "/assets/product-details/product-image-3.webp",
            originalHeight: 500,
        },
        {
            original: "/assets/product-details/product-image-4.webp",
            thumbnail: "/assets/product-details/product-image-4.webp",
            originalHeight: 500,
        },
    ]);
    const [faqItems, setFaqItems] = useState([
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
    ]);
    const [product, setProduct] = useState({
        id: null,
        name: "Audemars Piguet",
        model: "Royal Oak (extra thin)",
        marketValue: 100,
        price: 100,
        currency: "CHF",
        img: "/assets/home/products/Audemars-piguet-Royaloak.webp",
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
        gallery: [
            "/assets/product-details/product-image-1.webp",
            "/assets/public/product-details/product-image-2.webp",
            "/assets/public/product-details/product-image-3.webp",
            "/assets/public/product-details/product-image-4.webp",
        ],
    });
    // const [product, setProduct] = useState();
    const [isMobile, setIsMobile] = useState(true);
    const [variables, setVariables] = useState({
        associatedId: "",
      });
    const [getDetails, { loading, error, data }] = useLazyQuery(listing, {
        variables,
    });
    if(!loading && data != undefined && product.id === null){
        console.log("data", data.listings[0]);
        const listing = {
            id: data.listings[0]._id,
            name: "Audemars Piguet", // on chain - name
            model: data.listings[0].model, // not listed
            marketValue: data.listings[0].marketValue,
            price: 100, //on chain - starting price
            currency: data.listings[0].currency, // not listed 
            img: "/assets/home/products/Audemars-piguet-Royaloak.webp", // on chain - image
            sold: data.listings[0].sold, // not listed
            total: data.listings[0].total, // not listed
            stockTag: "Almost Sold Out!", // not listed
            
            // stats
            fractionLeft: 0, // not listed
            pastReturns: data.listings[0].pastReturns,
            pastReturnsSuffix: "p.a.", // not listed
            earningPotential: data.listings[0].earningPotential,
            earningPotentialSuffix: "p.a.", // not listed
            earningPotentialDuration: data.listings[0].earningPotentialDuration, 
        
            // product page
            expectedNetReturn: data.listings[0].expectedNetReturn,
            offerViews: data.listings[0].offerViews, // not listed
        
            investUrl: "#",
        
            // description
            description: data.listings[0].description,
            gallery: [
                ...data.listings[0].images
            ],
        };
        const listing_info = [
            {
                key: "1",
                question: "Basic Info",
                answer: data.listings[0].basicInfo,
            },
            {
                key: "2",
                question: "Product Description",
                answer: data.listings[0].description,
            },
            {
                key: "3",
                question: "Certificate of Authenticity",
                answer: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
            },
            {
                key: "4",
                question: "Asset Details",
                answer: data.listings[0].assetDetails,
            }
        ];
        // const product_images = data.listings[0].images.map((image: string) => {
        //     return {
        //         original: image,
        //         thumbnail: image,
        //         originalHeight: 500,
        //     }
        // });
        // map the product images but also sort them by their ending so they are in order, they will end in -1, -2, -3, -4
        const product_images = data.listings[0].images.map((image: string) => {
            return {
                original: image,
                thumbnail: image,
                originalHeight: 500,
            }
        }).sort((a: any, b: any) => {
            console.log("a", typeof a.original);
            const aEnding = a.original.split("-").pop();
            const bEnding = b.original.split("-").pop();
            return parseInt(aEnding) - parseInt(bEnding);
        });
       

        setProduct(listing);
        setFaqItems(listing_info);
        setImages(product_images);
    }
    if(!loading && error != undefined){
        console.log("error", error);
    }

    // BUY FRACTION FUNCTIONALITY*************************************************
    async function buyListing() {        
        console.log('buying listing')
        try {
            if(!publicKey){
                console.log('no public key');
                return;
            }
            const response = await fetch('/api/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: variables.associatedId,
                    publicKey: publicKey.toBase58(),
                })
            })
            const txData = await response.json();
            const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
        
            const signature = await sendTransaction(tx, connection, 
                {
                    skipPreflight: true,
                    preflightCommitment: "confirmed",
                },
            );
            console.log(
                `Transaction sent: https://explorer.solana.com/tx/${signature}?cluster=devnet`
              );
            toast.success(<Link href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}> Transaction sent </Link>);
        } catch (error) {
            console.error('Error sending transaction', error);
            toast.error('Error sending transaction');
        }
    }
    // ***************************************************************************

    useEffect(() => {
        if(window){
            const handleResize = () => {
                if(window.innerWidth < 768){
                    setIsMobile(true);
                } else {
                    // setIsMobile(false);
                }
            };

            // Attach the event listener for window resize
            window.addEventListener("resize", handleResize);

            // Clean up the event listener on component unmount
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    useEffect(() => {
        if(product.id !== null){
            return;
        }
        const accountPubkey = params.id;
        setVariables({
            associatedId: accountPubkey
        });
        // fetchProductDetails(accountPubkey)
        //     .then((res) => {
        //         console.log('res', res)
        //     })
        //     .catch((err) => {
        //         console.log('err', err)
        //     });

        getDetails().then(() => {
            // console.log('data', data.listings[0]);
            
        })
        .catch((err) => {
            console.log('err', err);
        });
        // setProduct(res);
        setIsLoading(false)
            
    }, [product.id]);

    return (
        <>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
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
                                                    {product.marketValue} €
                                                </p>
                                            </div>
                                            <div className="fraction-left">
                                                <p className="body">Market Value</p>
                                                <p className="heading-2 w-700">
                                                    {product.marketValue} €
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
                                                        +{product.pastReturns}%{" "}
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
                                                        (over {product.earningPotentialDuration})
                                                    </span>
                                                </p>
                                                <p className="heading-2">
                                                    <span className="w-700">
                                                        +{product.earningPotential}%{" "}
                                                    </span>
                                                    <span className="body-xs">
                                                        p.a.
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <a onClick={buyListing} className="btn btn-white" style={{ justifyContent: "center" }}>

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
                    {isMobile ? <ProductsSectionMobile /> : <ProductsSectionDesktop />}

                    {/* Opportunities section */}
                    <OpportunitiesSection />

                    <div className="product-details__cta padding">
                        <div className="boxed">
                            <CTA1Card />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


