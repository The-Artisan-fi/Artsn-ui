import "./Footer.scss";

// footer brand
import footerBrand from "../../assets/footer-brand.webp";

import swissIcon from "../../assets/swiss-icon.webp";
import solanaIcon from "../../assets/solana-icon.webp";
import mailIcon from "../../assets/social-icons/icon4.svg";


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
                <div className="footer__top">
                    <div className="footer-column--1">
                        <Link className="footer-brand" to={"/"}>
                            <img
                                src={footerBrand}
                                alt=""
                                className="footer-brand"
                            />
                        </Link>
                        <p className="body-regular">info@artsn.fi</p>
                        <p className="body-regular">
                            The Artisan is a digital boutique specializing in fractionalized high-end collectibles
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
                                    TheFi
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
                                <a href="https://leonardo-donatacci.notion.site/ARTSN-Privacy-Policy-6ec675287a134d7a9eead54d2aa91905?pvs=74" className="footer__link">
                                    Privacy Policy
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="https://tally.so/r/wgMGzP" className="footer__link">
                                    Contact Us
                                </a>
                            </li>
                            <li className="footer__item">
                                <div className="footer__head__col-3__socials">
                                    <a
                                        href="https://www.linkedin.com/company/the-artisan-nft/?viewAsMember=true"
                                        className="footer__head__col-3__socials__item"
                                    >
                                        <img
                                            src={linkedIn}
                                            alt=""
                                            className="footer__head__col-3__socials__item__icon"
                                        />
                                    </a>
                                    <a
                                        href="https://twitter.com/The_Artisan_NFT"
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
                                        href="https://t.me/rcapizz"
                                        className="footer__head__col-3__socials__item"
                                    >
                                        <img
                                            src={telegram}
                                            alt=""
                                            className="footer__head__col-3__socials__item__icon"
                                        />
                                    </a>
                                    <a
                                        href="https://discord.gg/DZHY6B7Q46"
                                        className="footer__head__col-3__socials__item"
                                    >
                                        <img
                                            src={discord}
                                            alt=""
                                            className="footer__head__col-3__socials__item__icon"
                                        />
                                    </a>
                                    <a
                                        href="https://www.instagram.com/theartisan_nft/"
                                        className="footer__head__col-3__socials__item"
                                    >
                                        <img
                                            src={insta}
                                            alt=""
                                            className="footer__head__col-3__socials__item__icon"
                                        />
                                    </a>
                                </div>
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
                        <a href="#https://leonardo-donatacci.notion.site/ARTSN-Privacy-Policy-6ec675287a134d7a9eead54d2aa91905?pvs=4" className="footer-link caption-5">
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
    );
};

export default Footer;
