import "./CtaCard1.scss";

import cta1Illustration from "../../assets/home/cta-1-illustration.webp";

import discordIcon from "../../assets/discord-icon.svg";
import mailIcon from "../../assets/social-icons/icon4.svg";

const CTA1Card = () => {
    return (
        <div className="cta1-card ">
            <img
                src={cta1Illustration}
                alt=""
                className="cta1-card__illustration"
            />
            <h3 className="display-3">Stay in The Loop</h3>

            <div className="cta1-card__sub">
                <a href="https://tally.so/r/nrAPvX" className="btn btn-primary">
                    <img src={mailIcon} alt="" className="icon" />
                    Get our Newsletter
                </a>

                <a href="https://discord.com/invite/TWPkseGJEG" className="btn btn-primary">
                    <img src={discordIcon} alt="" className="icon" />
                    <div className="text">JOIN OUR DISCORD</div>
                </a>

            </div>
            
        </div>
    );
};

export default CTA1Card;
