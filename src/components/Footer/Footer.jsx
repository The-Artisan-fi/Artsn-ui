import "./Footer.scss";

// footer brand
import footerBrand from "../../assets/footer-brand.webp";

import swissIcon from "../../assets/swiss-icon.webp";
import solanaIcon from "../../assets/solana-icon.webp";

// socila icons import
import linkedIn from "../../assets/social-icons/icon1.svg";
import twitter from "../../assets/social-icons/icon2.svg";
import discord from "../../assets/social-icons/icon3.svg";
import email from "../../assets/social-icons/icon4.svg";
import insta from "../../assets/social-icons/icon5.svg";
import telegram from "../../assets/social-icons/icon6.svg";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="footer padding">
            <div className="boxed">
                <div className="footer__head">
                    <div className="footer__head__col-1">
                        <h3 className="heading-6">Join the waitlist</h3>
                        <p className="p-4">
                            Our mailing list will receive news, offers and
                            promotions
                        </p>
                        <div className="footer__head__col-1__sub">
                            <input
                                placeholder="Enter your Email"
                                type="text"
                                className="subscribe-input"
                            />
                            <a href="#" className="btn label-5">
                                {" "}
                                SUBSCRIBE
                            </a>
                        </div>
                    </div>

                    <div className="footer__head__col-2">
                        <h3 className="heading-6">Contact us</h3>
                        <a
                            href="mailto:info@theartisan-nft.com"
                            className="label-5"
                        >
                            info@theartisan-nft.com
                        </a>
                    </div>

                    <div className="footer__head__col-3">
                        <h3 className="heading-6">Join the Community</h3>
                        <div className="footer__head__col-3__socials">
                            <a
                                href="#"
                                className="footer__head__col-3__socials__item"
                            >
                                <img
                                    src={linkedIn}
                                    alt=""
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                            <a
                                href="#"
                                className="footer__head__col-3__socials__item"
                            >
                                <img
                                    src={twitter}
                                    alt=""
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                            <a
                                href="#"
                                className="footer__head__col-3__socials__item"
                            >
                                <img
                                    src={email}
                                    alt=""
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                            <a
                                href="#"
                                className="footer__head__col-3__socials__item"
                            >
                                <img
                                    src={telegram}
                                    alt=""
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                            <a
                                href="#"
                                className="footer__head__col-3__socials__item"
                            >
                                <img
                                    src={discord}
                                    alt=""
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                            <a
                                href="#"
                                className="footer__head__col-3__socials__item"
                            >
                                <img
                                    src={insta}
                                    alt=""
                                    className="footer__head__col-3__socials__item__icon"
                                />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer__top">
                    <div className="footer-column--1">
                        <Link className="footer-brand" to={"/"}>
                            <img
                                src={footerBrand}
                                alt=""
                                className="footer-brand"
                            />
                        </Link>
                        <p className="body-regular">info@theartisan-nft.com</p>
                        <p className="body-regular">
                            The Artisan is a digital boutique for investing and
                            trade fractionalized high-end collectibles.
                        </p>
                        <div className="icons">
                            <img
                                src={solanaIcon}
                                alt=""
                                className="solana-icon"
                            />
                            <img
                                src={swissIcon}
                                alt=""
                                className="swiss-icon"
                            />
                        </div>
                    </div>

                    <div className="footer-column--2">
                        <p className="footer__heading">Browse</p>
                        <ul className="footer__list">
                            <li className="footer__item">
                                <a href="/market" className="footer__link">
                                    The Market
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="/fi" className="footer__link">
                                    The Fi
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="/boutique" className="footer__link">
                                    The Boutique
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="/about" className="footer__link">
                                    About Us
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-column--3 ">
                        <p className="footer__heading">Resources</p>
                        <ul className="footer__list">
                            <li className="footer__item">
                                <a href="tos" className="footer__link">
                                    Terms and Conditions
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="/privacy" className="footer__link">
                                    Privacy Policy
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="/help" className="footer__link">
                                    Help Center
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="hr"></div>

                <div className="footer__bottom">
                    <p className="caption-5">
                        The Artisan By TimeVerse Labs GmbH
                    </p>

                    <div className="footer__bottom__right">
                        <a href="#" className="footer-link caption-5">
                            Privacy Policy
                        </a>
                        {" - "}
                        <a href="#" className="footer-link caption-5">
                            Terms and Conditions
                        </a>
                        {" - "}
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
