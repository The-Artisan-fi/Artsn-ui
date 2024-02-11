import "./CtaCard2.scss";
import cta2Illustration from "../../assets/home/cta-2-illustration.webp"; // cta section

const CTA2Card = () => {
    return (
        <div className="cta2-card ">
            <h2 className="display-3">Diversify your Portfolio</h2>
            <h3 className="heading-3 yellow">Collect Real World Assets</h3>
            <p className="caption-1">
                Welcome in our high-end ownership and trade platform.
            </p>
            <a href="#" className="btn-cta-2">
                Start Now
            </a>
            <img
                src={cta2Illustration}
                alt=""
                className="cta2-card__illustration"
            />
        </div>
    );
};

export default CTA2Card;
