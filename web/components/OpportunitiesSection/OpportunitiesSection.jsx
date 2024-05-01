import "@/styles/OpportunitiesSection.scss";
import Image from "next/image";
import ArrowRight from "@/public/assets/home/arrow-right.svg";
import MetaBoutique from "@/public/assets/home/meta.webp";
import Collect from "@/public/assets/home/collect.webp";
import Fi from "@/public/assets/home/fi.webp";
// data for opportunities section
const opportunities = [
    {
        image: MetaBoutique,
        title: "The Meta Boutique",
        subtitle: "Try and Buy the Luxury Goods.",
        description: "Look around and enjoy our platform in Virtual Reality.",
        url: "https://theboutique-vr.com/",
    },
    {
        image: Collect,
        title: "Collect",
        subtitle: "Own and Trade Luxury Assets.",
        description: "Buy fractions of Luxury Assets. ",
        url: "/collect-fraction",
    },
    {
        image: Fi,
        title: "TheFi",
        subtitle: "Navigate Secondary Market",
        description: "Trade, Get Loans, Get Insurance.",
        url: "#",
    },
];

const OpportunitiesSection = () => {
    return (
        <section className="opportunities padding">
            <div className="boxed">
                <h2 className="heading-1">
                    Discover our services:
                </h2>

                {/* cards grid */}
                <div className="opportunities__cards">
                    {opportunities.map((opportunity) => {
                        return (
                            <div
                                key={opportunity.title}
                                className="opportunities__cards__card"
                            >
                                <div className="opportunities__cards__card__top">
                                    <Image
                                        src={opportunity.image}
                                        alt={opportunity.title}
                                        className="opportunities__cards__card__top__img"
                                    />
                                </div>
                                <div className="opportunities__cards__card__body">
                                    {/*<p className="label-3">
                                        {opportunity.subtitle}
                                    </p>*/}
                                    <h3 className="heading-3 gold">
                                        {opportunity.title}
                                    </h3>
                                    <div className="opportunities__cards__card__body__bottom">
                                        <p className="caption-5">
                                            {opportunity.description}
                                        </p>
                                        <a href={opportunity.url}>
                                            <Image
                                                src={ArrowRight}
                                                alt="arrow pointing right"
                                                className="icon"
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default OpportunitiesSection;
