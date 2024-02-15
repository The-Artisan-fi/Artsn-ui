import "@/styles/CtaCard1.scss";

const CTA1Card = () => {
    return (
        <div className="cta1-card ">
            <img
                src="/assets/home/cta-1-illustration.webp"
                alt=""
                className="cta1-card__illustration"
            />
            <h3 className="display-3">Stay in The Loop</h3>

            <div className="cta1-card__sub">
                <a href="https://tally.so/r/nrAPvX" className="btn btn-primary">
                    <img src="/assets/social-icons/icon4.svg" alt="" className="icon" />
                    Get our Newsletter
                </a>

                <a href="https://discord.com/invite/TWPkseGJEG" className="btn btn-primary">
                    <img src="/assets/discord-icon.svg" alt="" className="icon" />
                    <div className="text">JOIN OUR DISCORD</div>
                </a>

            </div>
            
        </div>
    );
};

export default CTA1Card;
