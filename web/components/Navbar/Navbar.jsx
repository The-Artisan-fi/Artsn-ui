"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/Navbar.scss";
// import { Link, useLocation } from "react-router-dom";
import Link from "next/link";

// import navbrand from "../../assets/navbrand-full.webp";
import { CgProfile } from "react-icons/cg";
import { IoMenu, IoClose } from "react-icons/io5";
import Web3AuthLogin from "../Web3Auth/Web3Auth";

function Navbar() {
    // navbar state
    const [navbar, setNavbar] = useState(false);
    const [displayLogin, setDisplayLogin] = useState(false);
    const router = useRouter();
    // get current path
    const pathname = router.pathname;

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
            to: "https://theboutique-vr.com/",
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
        <div className="navbar" >
            <header className="padding">
                <div className="boxed">
                    <div className="header-content">
                        <Link className="navbrand" href="/">
                            <img className="navbrand-img" src="/assets/navbrand-full.webp" />{" "}
                        </Link>
                        <div className="header-left">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.to;

                                return (
                                    <Link
                                        href={link.to}
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
                            <CgProfile className="profile-icon" 
                                onClick={()=> {
                                    setDisplayLogin(!displayLogin)
                                }}
                            />
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
                        <Link className="navbrand" href="/">
                            <img className="navbrand-img" src="/assets/navbrand.webp" />{" "}
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
                                    href={link.to}
                                    key={link.name}
                                    onClick={() => setNavbar(false)}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        <CgProfile className="profile-icon" 
                            onClick={()=> {
                                setDisplayLogin(!displayLogin)
                                toggleNavbar()
                            }}
                        />
                    </div>
                </div>
            </div>
            {displayLogin && (
                <div className="login-container">
                    <div className="backdrop" onClick={()=> {setDisplayLogin(false)}} />
                    {/* display x that when clicked it setDisplayLogin(false) this will only appear on mobile */}
                    <div className="close-login" onClick={()=> {setDisplayLogin(false)}}>
                        <span className="material-symbols-outlined">
                            <IoClose className="close-icon" />
                        </span>
                    </div>
                    <Web3AuthLogin />
                </div>
            )}
        </div>
    );
}

export default Navbar;
