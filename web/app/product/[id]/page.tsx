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

type OffChainData = {
    associatedId: string;
    images: string[];
    assetDetails: string
    expectedNetReturn: string;
    marketValue: string;
    pastReturns: string;
    earningPotential: string;
    earningPotentialDuration: string;
    basicInfo: string;
    currency: string;
    description: string;
    model: string;
    offerViews: string;
    sold: string;
    total: string;
}

type OnChainData = {
    id: number;
    share: number;
    shareSold: number;
    startingPrice: number;
    watchKey: string;
    reference: string;
    braceletMaterial: string;
    brand: string;
    caseMaterial: string;
    dialColor: string;
    diamater: number;
    model: string;
    movement: string;
    yearOfProduction: number;
};

type Product = {
    id: number;
    reference: string;
    name: string;
    model: string;
    marketValue: number;
    price: number;
    currency: string;
    img: string;
    sold: number;
    total: number;
    stockTag: string;
    fractionLeft: number;
    pastReturns: string;
    pastReturnsSuffix: string;
    earningPotential: string;
    earningPotentialSuffix: string;
    earningPotentialDuration: string;
    expectedNetReturn: string;
    offerViews: number;
    investUrl: string;
    description: string;
    gallery: string[];
}

type FAQ = {
    key: string;
    question: string;
    answer: string;
}

type Image = {
    original: string
    thumbnail: string,
    originalHeight: number,
}


export default function ProductDetails({ params }: { params: { id: string } }) {
    const { publicKey, sendTransaction } = useWallet();
    const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
        "confirmed"
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [faqItems, setFaqItems] = useState<Array<FAQ>>();
    const [onChainData, setOnChainData] = useState<OnChainData>();
    const [offChainData, setOffChainData] = useState<OffChainData | undefined>(undefined);
    const [product, setProduct] = useState<Product>();
    const [images, setImages] = useState<Array<Image>>();
    const [isMobile, setIsMobile] = useState(true);
    const [variables, setVariables] = useState({
        associatedId: "",
      });
    const [getDetails, { loading, error, data }] = useLazyQuery(listing, {
        variables,
    });
    if(!loading && data != undefined && offChainData == undefined){
        console.log("data", data.listings[0]);
        setOffChainData(data.listings[0]);
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
            if(!product){
                console.log('no product');
                return;
            }
            const response = await fetch('/api/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: product.id,
                    reference: product.reference,
                    publicKey: publicKey.toBase58(),
                })
            })
            const txData = await response.json();
            const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
        
            const signature = await sendTransaction(tx, connection, 
                {
                    skipPreflight: true,
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
    // **************************Data Functions***********************************
    async function fetchData(accountPubkey: string) {
        const on_chain_data: OnChainData | undefined = await fetchProductDetails(accountPubkey);
        // console.log('on chain data', on_chain_data)

        const product_images = offChainData!.images.map((image: string) => {
            return {
                original: image,
                thumbnail: image,
                originalHeight: 500,
            }
        })

        const product_info ={
            id: on_chain_data!.id,
            reference: on_chain_data!.reference,
            name: on_chain_data!.brand,
            model: on_chain_data!.model,
            marketValue: parseInt(offChainData!.marketValue),
            price: on_chain_data!.startingPrice,
            currency: offChainData!.currency,
            img: offChainData!.images[0],
            sold: on_chain_data!.shareSold,
            total: on_chain_data!.share,
            stockTag: "Almost Sold Out!",
            fractionLeft: on_chain_data!.share - on_chain_data!.shareSold,
            pastReturns: offChainData!.pastReturns,
            pastReturnsSuffix: "p.a.",
            earningPotential: offChainData!.earningPotential,
            earningPotentialSuffix: "p.a.",
            earningPotentialDuration: offChainData!.earningPotentialDuration,
            expectedNetReturn: offChainData!.expectedNetReturn,
            offerViews: parseInt(offChainData!.offerViews),
            investUrl: "#",
            description: offChainData!.description,
            gallery: offChainData!.images,
        }

        const faq_items = [
            {
                key: "1",
                question: "Basic Info",
                answer: offChainData!.basicInfo,
            },
            {
                key: "2",
                question: "Product Description",
                answer: offChainData!.description,
            },
            {
                key: "3",
                question: "Certificate of Authenticity",
                answer: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
            },
            {
                key: "4",
                question: "Asset Details",
                answer: offChainData!.assetDetails,
            },
        ]
        
        setFaqItems(faq_items);
        setProduct(product_info);
        setImages(product_images);
        setIsLoading(false);
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
        const accountPubkey = params.id;
        if(accountPubkey === undefined){
            return;
        }
        if(offChainData){
            return
        }
        setVariables({
            associatedId: accountPubkey
        });
        getDetails()
        
    }, [params.id]);

    useEffect(() => {
        if(offChainData){
            fetchData(offChainData.associatedId);
        }
    }, [offChainData]);

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
                                        items={images!}
                                    />
                                </div>

                                <div className="product-details__hero__info">
                                    <div className="product-details__hero__info__header">
                                        <h1 className="heading-2">{product!.name}</h1>
                                        <h2 className="caption-1">{product!.model}</h2>
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
                                                    {product!.marketValue} €
                                                </p>
                                            </div>
                                            <div className="fraction-left">
                                                <p className="body">Market Value</p>
                                                <p className="heading-2 w-700">
                                                    {product!.marketValue} €
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
                                                        +{product!.pastReturns}%{" "}
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
                                                        (over {product!.earningPotentialDuration})
                                                    </span>
                                                </p>
                                                <p className="heading-2">
                                                    <span className="w-700">
                                                        +{product!.earningPotential}%{" "}
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
                                    {faqItems!.map((item) => (
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


