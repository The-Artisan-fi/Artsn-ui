import '@/styles/Footer.scss';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

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
                <img
                  src="/assets/social-icons/icon1.svg"
                  alt=""
                  className="footer__head__col-3__socials__item__icon"
                />
              </a>
              <a
                href="https://twitter.com/The_Artisan_NFT"
                className="footer__head__col-3__socials__item"
              >
                <img
                  src="/assets/social-icons/icon2.svg"
                  alt=""
                  className="footer__head__col-3__socials__item__icon"
                />
              </a>
              <a href="#" className="footer__head__col-3__socials__item">
                <img
                  src="/assets/social-icons/icon4.svg"
                  alt=""
                  className="footer__head__col-3__socials__item__icon"
                />
              </a>
              <a
                href="https://t.me/rcapizz"
                className="footer__head__col-3__socials__item"
              >
                <img
                  src="/assets/social-icons/icon6.svg"
                  alt=""
                  className="footer__head__col-3__socials__item__icon"
                />
              </a>
              <a
                href="https://discord.gg/DZHY6B7Q46"
                className="footer__head__col-3__socials__item"
              >
                <img
                  src="/assets/social-icons/icon3.svg"
                  alt=""
                  className="footer__head__col-3__socials__item__icon"
                />
              </a>
              <a
                href="https://www.instagram.com/theartisan_nft/"
                className="footer__head__col-3__socials__item"
              >
                <img
                  src="/assets/social-icons/icon5.svg"
                  alt=""
                  className="footer__head__col-3__socials__item__icon"
                />
              </a>
            </div>
            <span className="label mobile">info@artsn.fi</span>
          </div>
        </div>
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
              The Artisan is a digital boutique specializing in fractionalized
              high-end collectibles
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