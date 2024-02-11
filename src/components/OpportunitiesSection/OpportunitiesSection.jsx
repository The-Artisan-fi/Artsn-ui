import "./OpportunitiesSection.scss";

// opportunitiees
import opportunity1 from "../../assets/home/meta.webp";
import opportunity2 from "../../assets/home/collect.webp";
import opportunity3 from "../../assets/home/fi.webp";

import arrowRight from "../../assets/home/arrow-right.svg";

// data for opportunities section
const opportunities = [
    {
        image: opportunity1,
        title: "The Meta Boutique",
        subtitle: "Try and Buy the Luxury Goods.",
        description: "Look around and enjoy our platform in Virtual Reality.",
        url: "#",
    },
    {
        image: opportunity2,
        title: "Collect",
        subtitle: "Own and Trade Luxury Assets.",
        description: "Buy fractions of Luxury Assets. ",
        url: "#",
    },
    {
        image: opportunity3,
        title: "The Fi",
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
                    Discover The Artisan Opportunities:
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
                                    <img
                                        src={opportunity.image}
                                        alt=""
                                        className="opportunities__cards__card__top__img"
                                    />
                                </div>
                                <div className="opportunities__cards__card__body">
                                    <p className="label-3">
                                        {opportunity.subtitle}
                                    </p>
                                    <h3 className="heading-3 gold">
                                        {opportunity.title}
                                    </h3>
                                    <div className="opportunities__cards__card__body__bottom">
                                        <p className="caption-5">
                                            {opportunity.description}
                                        </p>
                                        <a href={opportunity.url}>
                                            <img
                                                src={arrowRight}
                                                alt=""
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
