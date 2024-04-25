import "@/styles/PartnersMarque.scss";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import CryptoValley from "@/public/assets/home/crypto-valley.webp";
import Ros from "@/public/assets/home/ros.webp";
import Jigen from "@/public/assets/home/jigen.webp";
import NodeGate from "@/public/assets/home/node-gate.webp";
import SwissDao from "@/public/assets/home/swissdao.webp";
import XReal from "@/public/assets/home/x-real.webp";

const marqueeImages = [
    {
        src: CryptoValley,
        alt: "crypto valley",
    },
    {
        src: Ros,
        alt: "ros",
    },
    {
        src: Jigen,
        alt: "jigen",
    },
    {
        src: NodeGate,
        alt: "node gate",
    },
    {
        src: SwissDao,
        alt: "swiss dao",
    },
    {
        src: XReal,
        alt: "x real",
    },
];

const PartnersMarque = () => {
    return (
        <section className="partners">
            <h2 className="heading-secondary">Partners</h2>
            <div className="partners__marquee">
                <Marquee autoFill={true}>
                    {marqueeImages.map((image) => (
                        <Image
                            key={image.alt}
                            src={image.src}
                            alt={image.alt}
                            className="partners__marquee__img"
                        />
                    ))}
                </Marquee>
            </div>
        </section>
    );
};

export default PartnersMarque;
