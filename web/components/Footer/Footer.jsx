import '@/styles/Footer.scss';

import Link from 'next/link';
import { toastSuccess } from '@/helpers/toast';
const Footer = () => {
  const handleCopy = (e) => {
    console.log(e);
    navigator.clipboard.writeText(e);
    toastSuccess('Copied email to clipboard');
  };
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
              target='_blank'
            >
              <img
                src="/assets/social-icons/icon1.svg"
                alt=""
                className="footer__bottom__socials__item__icon"
              />
            </a>
            <a
              href="https://twitter.com/ArtsnFi"
              className="footer__bottom__socials__item"
              target='_blank'
            >
              <img
                src="/assets/social-icons/icon2.svg"
                alt=""
                className="footer__bottom__socials__item__icon"
              />
            </a>
            <button onClick={() => {
              handleCopy('renato@artsn.fi');
            }} className="footer__bottom__socials__item__btn">
              <img
                src="/assets/social-icons/icon4.svg"
                alt=""
                className="footer__bottom__socials__item__icon"
              />
            </button>
            <a
              href="https://t.me/rcapizz"
              className="footer__bottom__socials__item"
              target='_blank'
            >
              <img
                src="/assets/social-icons/icon6.svg"
                alt=""
                className="footer__bottom__socials__item__icon"
              />
            </a>
            <a
              href="https://discord.gg/DZHY6B7Q46"
              className="footer__bottom__socials__item"
              target='_blank'
            >
              <img
                src="/assets/social-icons/icon3.svg"
                alt=""
                className="footer__bottom__socials__item__icon"
              />
            </a>
            <a
              href="https://www.instagram.com/theartisan_nft/"
              className="footer__bottom__socials__item"
              target='_blank'
            >
              <img
                src="/assets/social-icons/icon5.svg"
                alt=""
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