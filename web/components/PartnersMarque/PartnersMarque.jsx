import "@/styles/PartnersMarque.scss";

import Marquee from "react-fast-marquee";

const marqueeImages = [
    {
        src: "/home/crypto-valley.webp",
        alt: "crypto valley",
    },
    {
        src: "/home/ros.webp",
        alt: "ros",
    },
    {
        src: "/home/jigen.webp",
        alt: "jigen",
    },
    {
        src: "/home/node-gate.webp",
        alt: "node gate",
    },
    {
        src: "/home/swissdao.webp",
        alt: "swiss dao",
    },
    {
        src: "/home/x-real.webp",
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
