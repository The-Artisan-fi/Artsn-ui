import "./PartnersMarque.scss";

import Marquee from "react-fast-marquee";

// marquee images
import cryptoValley from "../../assets/home/crypto-valley.webp";
import ros from "../../assets/home/ros.webp";
import jigen from "../../assets/home/jigen.webp";
import nodeGate from "../../assets/home/node-gate.webp";
import swissDao from "../../assets/home/swissdao.webp";
import xReal from "../../assets/home/x-real.webp";

const marqueeImages = [
    {
        src: cryptoValley,
        alt: "crypto valley",
    },
    {
        src: ros,
        alt: "ros",
    },
    {
        src: jigen,
        alt: "jigen",
    },
    {
        src: nodeGate,
        alt: "node gate",
    },
    {
        src: swissDao,
        alt: "swiss dao",
    },
    {
        src: xReal,
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
                        <img
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
