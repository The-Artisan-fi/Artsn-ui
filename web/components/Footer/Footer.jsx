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
        <div className="footer__top">
          <div className="footer-column--1">
            <Link className="footer-brand" href={'/'}>
              <img
                src="/assets/footer-logo1.png"
                alt=""
                className="footer-brand1"
              />
              <img
                src="/assets/footer-logo2.png"
                alt=""
                className="footer-brand2"
              />
            </Link>
            <p className="body-mob">Own and Collect Luxury Goods</p>
            <p className="body-regular">
              The Artisan is a digital boutique for collecting and owning
              fractionalized high-end assets.
            </p>
            <div className="icons">
              <img
                src="/assets/solana-icon.webp"
                alt=""
                className="solana-icon"
              />
              <img
                src="/assets/swiss-icon.webp"
                alt=""
                className="swiss-icon"
              />
            </div>
          </div>

          <div className="footer-column--2">
            <p className="heading">Browse</p>
            <div className="footer__list">
              <a href="#" className="footer__link">
                Start Collecting
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
            </div>
          </div>
        </div>
        <div className="hr"></div>

        <div className="footer__bottom">
          <p className="caption-5">The Artisan By TimeVerse Labs GmbH</p>
          <div className="footer__bottom__socials">
            <a
              href="https://www.linkedin.com/company/the-artisan-nft/?viewAsMember=true"
              className="footer__bottom__socials__item"
            >
              <Image
                src={Icon1}
                alt="linked in icon"
                className="footer__bottom__socials__item__icon"
              />
            </a>
            <a
              href="https://twitter.com/The_Artisan_NFT"
              className="footer__bottom__socials__item"
            >
              <Image
                src={Icon2}
                alt="twitter icon"
                className="footer__bottom__socials__item__icon"
              />
            </a>
            <a href="#" className="footer__bottom__socials__item">
              <Image
                src={Icon4}
                alt="mail icon"
                className="footer__bottom__socials__item__icon"
              />
            </a>
            <a
              href="https://t.me/rcapizz"
              className="footer__bottom__socials__item"
            >
              <Image
                src={Icon6}
                alt="telegram icon"
                className="footer__bottom__socials__item__icon"
              />
            </a>
            <a
              href="https://discord.gg/DZHY6B7Q46"
              className="footer__bottom__socials__item"
            >
              <Image
                src={Icon3}
                alt="discord icon"
                className="footer__bottom__socials__item__icon"
              />
            </a>
            <a
              href="https://www.instagram.com/theartisan_nft/"
              className="footer__bottom__socials__item"
            >
              <Image
                src={Icon5}
                alt="instagram icon"
                className="footer__bottom__socials__item__icon"
              />
            </a>
          </div>
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