import "@/styles/PartnersMarque.scss";

import Marquee from "react-fast-marquee";

const marqueeImages = [
    {
        src: "assets/home/crypto-valley.webp",
        alt: "Crypto Valley",
        link: "https://cryptovalley.swiss/"
    },
    {
        src: "assets/home/ros.webp",
        alt: "Ros Jewelier",
        link: "https://www.rosjuweliers.nl/nl/"
    },
    {
        src: "assets/home/jigen.webp",
        alt: "Jigen",
        link: "https://www.jigen.io/"
    },
    {
        src: "assets/home/node-gate.webp",
        alt: "Node Gate",
        link: "https://www.nodegate.io/"
    },
    {
        src: "assets/home/swissdao.webp",
        alt: "Swiss Dao",
        link: "https://www.linkedin.com/company/swissdaospace/?originalSubdomain=ch"
    },
    {
        src: "assets/home/monaco.svg",
        alt: "Monaco Foundry",
        link: "https://www.monacofoundry.com/"
    },
];

const PartnersMarque = () => {
    return (
        <section className="partners">
            <h2 className="heading-secondary">Partners</h2>
            <div className="partners__marquee">
                <Marquee autoFill={true}>
                    {marqueeImages.map((image) => (
                        <a
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
