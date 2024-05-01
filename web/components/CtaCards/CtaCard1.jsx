import '@/styles/CtaCard1.scss';

const CTA1Card = () => {
  return (
    <div className="cta1-card ">
      <img
        src="/assets/home/cta-1-illustration.webp"
        alt=""
        className="cta1-card__illustration"
      />
      <div className="cta1-card__content">
        <div className="cta1-card__content__title">
          <p className="caption-1">
            Get Updated And Discover All The News in The Artisan
          </p>
          <h3 className="heading-1">
            Gain priority access by joining the waitlist.
          </h3>
        </div>
        <div className="cta1-card__sub">
          <a href="https://tally.so/r/nrAPvX" className="sub-btn uppercase">
            <img src="/assets/social-icons/icon4.svg" alt="" className="icon" />
            Join the Waitlist Now
          </a>

          <a
            href="https://discord.com/invite/TWPkseGJEG"
            className="sub-btn uppercase"
          >
            <img src="/assets/discord-icon.svg" alt="" className="icon" />
            <div className="text">Join Discord Community</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CTA1Card;