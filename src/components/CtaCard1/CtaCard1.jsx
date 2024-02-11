import "./CtaCard1.scss";

import cta1Illustration from "../../assets/home/cta-1-illustration.webp";

import discordIcon from "../../assets/discord-icon.svg";

const CTA1Card = () => {
    return (
        <div className="cta1-card ">
            <img
                src={cta1Illustration}
                alt=""
                className="cta1-card__illustration"
            />
            <p className="caption-1">
                Stay informed and uncover all the latest news in the artisan world
            </p>
            <h3 className="display-3">Stay in The Loop</h3>

            <div className="cta1-card__sub">
                <input
                    placeholder="Enter your Email"
                    type="text"
                    className="subscribe-input"
                />
                <a href="#" className="btn btn-primary">
                    {" "}
                    SUBSCRIBE
                </a>
            </div>
            <a href="#" className="btn-cta-1 ">
                <img src={discordIcon} alt="" className="icon" />
                <div className="text">JOIN OUR DISCORD</div>
            </a>
        </div>
    );
};

export default CTA1Card;
