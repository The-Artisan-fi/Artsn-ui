import "@/styles/Footer.scss";
import Link from "next/link";
import Image from "next/image";
import Icon1 from "@/public/assets/social-icons/icon1.svg";
import Icon2 from "@/public/assets/social-icons/icon2.svg";
import Icon3 from "@/public/assets/social-icons/icon3.svg";
import Icon4 from "@/public/assets/social-icons/icon4.svg";
import Icon5 from "@/public/assets/social-icons/icon5.svg";
import Icon6 from "@/public/assets/social-icons/icon6.svg";
import FooterLogo1 from "@/public/assets/footer-logo1.png";
import FooterLogo2 from "@/public/assets/footer-logo2.png";
import SolanaIcon from "@/public/assets/solana-icon.webp";
import SwissIcon from "@/public/assets/swiss-icon.webp";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    return null;
  }

  return (
    <div className="footer padding">
      <div className="boxed">
        <div className="footer__head">
          <div className="footer__head__col-1">
            <a href="https://tally.so/r/mYWaJz" className="heading-6">
              Launching Soon
            </a>
            <span className="email-form__label">
              Sign up with the mail for receiving news, offers and promotions
            </span>
            <a href="https://tally.so/r/mYWaJz" className="btn-primary">
              JOIN THE WAITLIST
            </a>
          </div>

          <div className="footer__head__col-2">
            <a href="https://tally.so/r/wgMGzP" className="heading-6">
              Contact Us
            </a>
            <span className="label">info@theartisan-nft.com</span>
          </div>

                    <div className="footer__head__col-3">
                        <h3 className="heading-6">Join our Community</h3>
                        <div className="footer__head__col-3__socials">
                            <a
                                href="https://www.linkedin.com/company/the-artisan-nft/?viewAsMember=true"
                                className="footer__head__col-3__socials__item"
                            >
                                <Image
                                    src={Icon1}
                                    alt="social icon"
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                            <a
                                href="https://twitter.com/The_Artisan_NFT"
                                className="footer__head__col-3__socials__item"
                            >
                                <Image
                                    src={Icon2}
                                    alt="social icon"
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                            <a
                                href="#"
                                className="footer__head__col-3__socials__item"
                            >
                                <Image
                                    src={Icon4}
                                    alt="social icon"
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                            <a
                                href="https://t.me/rcapizz"
                                className="footer__head__col-3__socials__item"
                            >
                                <Image
                                    src={Icon6}
                                    alt="social icon"
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                            <a
                                href="https://discord.gg/DZHY6B7Q46"
                                className="footer__head__col-3__socials__item"
                            >
                                <Image
                                    src={Icon3}
                                    alt="social icon"
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                            <a
                                href="https://www.instagram.com/theartisan_nft/"
                                className="footer__head__col-3__socials__item"
                            >
                                <Image
                                    src={Icon5}
                                    alt="social icon"
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                        </div>
                        <span className="label mobile">
                            info@artsn.fi
                        </span>
                    </div>
                </div>
                <div className="footer__top">
                    <div className="footer-column--1">
                        <Link className="footer-brand" href={"/"}>
                            <Image
                                src={FooterLogo1}
                                alt="footer logo"
                                className="footer-brand1"
                            />
                            <Image
                                src={FooterLogo2}
                                alt="footer logo"
                                className="footer-brand2"
                            />
                        </Link>
                        <p className="body-mob">
                            Own and Collect Luxury Goods
                        </p>
                        <p className="body-regular">
                            The Artisan is a digital boutique specializing in fractionalized high-end collectibles
                        </p>
                        <div className="icons">
                            <Image
                                src={SolanaIcon}
                                alt="solana icon"
                                className="solana-icon"
                            />
                            <Image
                                src={SwissIcon}
                                alt="switzerland icon"
                                className="swiss-icon"
                            />
                        </div>
                    </div>

          <div className="footer-column--2">
            <p className="heading">Browse</p>
            <div className="footer__list">
              <a href="/market" className="footer__link">
                The Market
              </a>
              <a href="/fi" className="footer__link">
                TheFi
              </a>
              <a href="https://theboutique-vr.com/" className="footer__link">
                The Boutique
              </a>
              <a href="/about" className="footer__link">
                About Us
              </a>
            </div>
          </div>
          <div className="footer-column--3 ">
            <p className="heading">Resources</p>
            <div className="footer__list">
              <a href="tos" className="footer__link">
                Terms and Conditions
              </a>
              <a href="/privacy" className="footer__link">
                Privacy Policy
              </a>
              <a href="/help" className="footer__link">
                Help Center
              </a>
            </div>
          </div>
        </div>
        <div className="hr"></div>

        <div className="footer__bottom">
          <p className="caption-5">The Artisan By TimeVerse Labs GmbH</p>

          <div className="footer__bottom__right">
            <a href="#" className="footer-link caption-5">
              Privacy Policy
            </a>
            {' - '}
            <a href="#" className="footer-link caption-5">
              Terms and Conditions
            </a>
            {' - '}
            <a href="#" className="footer-link caption-5">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;