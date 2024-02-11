import { useState } from "react";
import "./Navbar.scss";
import { Link, useLocation } from "react-router-dom";

import navbrand from "../../assets/navbrand-full.webp";
import { CgProfile } from "react-icons/cg";
import { IoMenu, IoClose } from "react-icons/io5";

function Navbar() {
    // navbar state
    const [navbar, setNavbar] = useState(false);

    // get current path
    const { pathname } = useLocation();

    // navbar toggle
    const toggleNavbar = () => {
        setNavbar(!navbar);
    };

    const navLinks = [
        {
            to: "/market",
            name: "The Market",
        },
        {
            to: "/fi",
            name: "TheFi",
        },
        {
            to: "/boutique",
            name: "The Boutique",
        },
        {
            to: "/faq",
            name: "FAQs",
        },
        {
            to: "/about",
            name: "About Us",
        },
    ];

    return (
        <div className="navbar">
            <header className="padding">
                <div className="boxed">
                    <div className="header-content">
                        <Link className="navbrand" to={"/"}>
                            <img className="navbrand-img" src={navbrand} />{" "}
                        </Link>
                        <div className="header-left">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.to;

                                return (
                                    <Link
                                        to={link.to}
                                        className={
                                            isActive
                                                ? "nav-link active-link"
                                                : "nav-link"
                                        }
                                        key={link.name}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="header-right">
                            <CgProfile className="profile-icon" />
                        </div>

                        <div className="header-right-mob">
                            <div className="open-header" onClick={toggleNavbar}>
                                <span className="material-symbols-outlined">
                                    <IoMenu
                                        className="icon-menu"
                                        width={25}
                                        height={25}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div
                className="header-mob padding"
                style={{ display: navbar ? "block" : "none" }}
            >
                <div className="box">
                    <div className="header-mob-head padding">
                        <Link className="navbrand" to={"/"}>
                            <img className="navbrand-img" src={navbrand} />{" "}
                        </Link>
                        <div className="header-mob-head-right">
                            <div
                                className="close-header"
                                onClick={toggleNavbar}
                            >
                                <span className="material-symbols-outlined">
                                    <IoClose className="close-icon" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="header-mob-body">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <Link
                                    className={
                                        isActive ? "active-link" : "nav-link"
                                    }
                                    to={link.to}
                                    key={link.name}
                                    onClick={() => setNavbar(false)}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        <CgProfile className="profile-icon" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
