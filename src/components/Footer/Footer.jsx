import "./Footer.scss";

// footer brand
import footerBrand from "../../assets/footer-brand.webp";
import swissIcon from "../../assets/swiss-icon.webp";

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
                <div className="footer__top">
                    <div className="footer-column--1">
                        <Link className="footer-brand" to={"/"}>
                            <img
                                src={footerBrand}
                                alt=""
                                className="footer-brand"
                            />
                        </Link>
                        <p className="heading-quaternary">
                            info@theartisan-nft.com
                        </p>
                        <p className="heading-quaternary">
                            The Artisan is a digital boutique for investing and
                            trade fractionalized high-end collectibles.
                        </p>
                        <img src={swissIcon} alt="" className="swiss-icon" />
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
                <div className="footer__socials">
                    <a href="#" className="footer__socials__item">
                        <img
                            src={linkedIn}
                            alt=""
                            className="footer__socials__item__icon"
                        />
                    </a>
                    <a href="#" className="footer__socials__item">
                        <img
                            src={twitter}
                            alt=""
                            className="footer__socials__item__icon"
                        />
                    </a>
                    <a href="#" className="footer__socials__item">
                        <img
                            src={email}
                            alt=""
                            className="footer__socials__item__icon"
                        />
                    </a>
                    <a href="#" className="footer__socials__item">
                        <img
                            src={telegram}
                            alt=""
                            className="footer__socials__item__icon"
                        />
                    </a>
                    <a href="#" className="footer__socials__item">
                        <img
                            src={discord}
                            alt=""
                            className="footer__socials__item__icon"
                        />
                    </a>
                    <a href="#" className="footer__socials__item">
                        <img
                            src={insta}
                            alt=""
                            className="footer__socials__item__icon"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
