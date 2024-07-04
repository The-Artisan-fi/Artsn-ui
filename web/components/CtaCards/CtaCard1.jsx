import "@/styles/CtaCard1.scss";
import Image from "next/image";
import Illustration from "@/public/assets/home/cta-1-illustration.webp";
import Icon4 from "@/public/assets/social-icons/icon4.svg";
import DiscordIcon from "@/public/assets/discord-icon.svg";

const CTA1Card = () => {
    return (
        <div className="cta1-card ">
          <Image
            src={Illustration}
            alt="black background with diamonds on it"
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
                <Image src={Icon4} alt="" className="mail icon" />
                Join the Waitlist Now
              </a>
    
              <a
                href="https://discord.com/invite/TWPkseGJEG"
                className="sub-btn uppercase"
              >
                <Image src={DiscordIcon} alt="discord icon" className="icon" />
                <div className="text">Join Discord Community</div>
              </a>
            </div>
          </div>
        </div>
      );
};

export default CTA1Card;