import "@/styles/PartnersMarque.scss";

import Marquee from "react-fast-marquee";

const marqueeImages = [
    {
        src: "assets/home/crypto-valley.webp",
        alt: "crypto valley",
    },
    {
        src: "assets/home/ros.webp",
        alt: "ros",
    },
    {
        src: "assets/home/jigen.webp",
        alt: "jigen",
    },
    {
        src: "assets/home/node-gate.webp",
        alt: "node gate",
    },
    {
        src: "assets/home/swissdao.webp",
        alt: "swiss dao",
    },
    {
        src: "assets/home/x-real.webp",
        alt: "x real",
    },
    {
        src: Vitale,
        alt: "Vitale",
    }

];

const PartnersMarque = () => {
    return (
        <section className="partners">
            {/* <h2 className="heading-secondary">Partners</h2> */}
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
