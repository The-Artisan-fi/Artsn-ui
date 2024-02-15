import "./PartnersMarque.scss";

import Marquee from "react-fast-marquee";

// marquee images
import cryptoValley from "../../assets/home/crypto-valley.webp";
import ros from "../../assets/home/ros.webp";
import jigen from "../../assets/home/jigen.webp";
import nodeGate from "../../assets/home/node-gate.webp";
import swissDao from "../../assets/home/swissdao.webp";
import xReal from "../../assets/home/x-real.webp";
import monaco from "../../assets/home/monaco.svg";

const marqueeImages = [
    {
        src: cryptoValley,
        alt: "Crypto Valley",
        link: "https://cryptovalley.swiss/"
    },
    {
        src: ros,
        alt: "Ros Jewelier",
        link: "https://www.rosjuweliers.nl/nl/"
    },
    {
        src: jigen,
        alt: "Jigen",
        link: "https://www.jigen.io/"
    },
    {
        src: nodeGate,
        alt: "Node Gate",
        link: "https://www.nodegate.io/"
    },
    {
        src: swissDao,
        alt: "Swiss Dao",
        link: "https://www.linkedin.com/company/swissdaospace/?originalSubdomain=ch"
    },
    {
        src: monaco,
        alt: "Monaco Foundry",
        link: "https://www.monacofoundry.com/"
    },
];

const PartnersMarque = () => {
    return (
        <section className="partners">
            <h2 className="heading-3">Partners</h2>
            <div className="partners__marquee">
                <Marquee autoFill={true}>
                    {marqueeImages.map((image) => (
                        <a
                            key={image.alt}
                            href={image.link}
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="partners__marquee__img"
                            />
                        </a>
                    ))}
                </Marquee>
            </div>
        </section>
    );
};

export default PartnersMarque;

