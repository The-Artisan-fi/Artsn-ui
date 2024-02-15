import "@/styles/CtaCard2.scss";

const CTA2Card = () => {
    return (
        <div className="cta2-card ">
            <h2 className="display-3">Diversify your Portfolio</h2>
            <h3 className="heading-3 yellow">Collect Real World Assets</h3>
            <p className="caption-1">
                Welcome to our exclusive ownership and trading platform for high-end goods.
            </p>
            <a href="https://tally.so/r/mYWaJz" className="btn-cta-2">
                Join the Waitlist
            </a>
            <img
                src="/assets/home/cta-2-illustration.webp"
                alt=""
                className="cta2-card__illustration"
            />
        </div>
    );
};

export default CTA2Card;
