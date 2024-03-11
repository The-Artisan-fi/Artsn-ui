import "@/styles/CtaCard2.scss";

const CTA2Card = () => {
    return (
        <div className="cta2-card ">
            <div className="cta2-card__text">
                <h2 className="top-text">Diversify your Portfolio</h2>
                <h3 className="bottom-text">Collect Real World Assets</h3>
                <p className="sub-text">
                    Welcome in our high-end ownership and trade platform.
                </p>
            </div>
            <button className="btn-cta-2 uppercase">
                Start Now
            </button>
            <img
                src="/assets/home/cta-2-illustration.webp"
                alt=""
                className="cta2-card__illustration"
            />
        </div>
    );
};

export default CTA2Card;
