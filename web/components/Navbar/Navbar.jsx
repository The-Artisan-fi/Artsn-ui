"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/Navbar.scss";
// import { Link, useLocation } from "react-router-dom";
import Link from "next/link";

// import navbrand from "../../assets/navbrand-full.webp";
import { CgProfile } from "react-icons/cg";
import { IoMenu, IoClose } from "react-icons/io5";
import { useWallet } from "@solana/wallet-adapter-react";
import Web3AuthLogin from "../Web3Auth/Web3Auth";
import { checkLogin } from "../Web3Auth/checkLogin";
import ProfileModal from "../Profile/ProfileModal";

function Navbar() {
    // navbar state
    const [navbar, setNavbar] = useState(false);
    const [displayLogin, setDisplayLogin] = useState(false);
    const [web3AuthPublicKey, setWeb3AuthPublicKey] = useState(null);
    const [displayProfileModal, setDisplayProfileModal] = useState(false);
    const [buyerProfileExists, setBuyerProfileExists] = useState(false);
    const router = useRouter();
    // get current path
    const pathname = router.pathname;
    const { publicKey } = useWallet();
    // navbar toggle
    const toggleNavbar = () => {
        setNavbar(!navbar);
    };

    const navLinks = [
        // {
        //     to: "/market",
        //     name: "The Market",
        // },
        // {
        //     to: "/fi",
        //     name: "TheFi",
        // },
        // {
        //     to: "https://theboutique-vr.com/",
        //     name: "The Boutique",
        // },
        // {
        //     to: "/faq",
        //     name: "FAQs",
        // },
        {
            to: "/about",
            name: "About Us",
        },
    ];

    const mobileNavLinks = [
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

    async function checkBuyerProfile(key) {        
        try {
            console.log('checking profile')
            const response = await fetch('/api/getProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    publicKey: key,
                })
            })
            const profile = await response.json();
            console.log('profile', profile.profile);
            setBuyerProfileExists(profile.profile);
        } catch (error) {
            console.error('Error sending transaction', error);
        }
    }

    useEffect(() => {
        if(!publicKey && !web3AuthPublicKey) {
            return;
        }
        if(publicKey) {
            checkBuyerProfile(publicKey.toBase58());
        }
        if(web3AuthPublicKey) {
            console.log('checking profile', web3AuthPublicKey)
            checkBuyerProfile(web3AuthPublicKey);
        }
    }, [publicKey, displayProfileModal, web3AuthPublicKey]);

    useEffect(() => {
        if(web3AuthPublicKey == null) {
            console.log('checking login');
            checkLogin().then((res) => {
                console.log('res', res)
                if(res.connected){
                    console.log('web3pubkey', localStorage.getItem("web3pubkey"));
                    const web3pubkey = localStorage.getItem("web3pubkey");
                    if(web3pubkey){
                        setWeb3AuthPublicKey(web3pubkey);
                    }
                }
            });
        }
    }, []);

    return (
        <div className="navbar" >
            <header className="">
                <div className="boxed">
                    <div className="header-content">
                        <Link className="navbrand" href="/">
                            <img className="navbrand-img" src="/assets/navbrand-full.webp" />{" "}
                        </Link>
                        {/* <div className="header-left">
                            
                        </div> */}
                        <div className="header-right">
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
                                {!buyerProfileExists && (
                                    <button
                                        className="btn"
                                        onClick={()=> {
                                            if(!publicKey && !web3AuthPublicKey) {
                                                setDisplayLogin(!displayLogin)
                                            } else{
                                                setDisplayProfileModal(!displayProfileModal)
                                            }
                                        }}
                                    >
                                        {!publicKey && !web3AuthPublicKey ? 'Login' : 'Start Collecting'}  
                                    </button>
                                )}
                                {publicKey && !web3AuthPublicKey &&(
                                    <CgProfile className="profile-icon" 
                                        onClick={()=> {
                                            setDisplayLogin(!displayLogin)
                                        }}
                                    />
                                )}
                                {web3AuthPublicKey && !publicKey &&(
                                    <CgProfile className="profile-icon" 
                                        onClick={()=> {
                                            setDisplayLogin(!displayLogin)
                                        }}
                                    />
                                )}
                        </div>
                        
                        <div className="header-container-mob">
                            <div className="header-left-mob">
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
                            <div className="header-center-mob">
                                <Link className="navbrand-mob" href="/">
                                    <img className="navbrand-img" src="/assets/navbrand-logo-bw.png" />{" "}
                                </Link>
                            </div>
                            <div className="header-right-mob">
                                <CgProfile className="profile-icon" 
                                    onClick={()=> {
                                        setDisplayLogin(!displayLogin)
                                    }}
                                />
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
                        {mobileNavLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <Link
                                    className={
                                        isActive ? "active-link" : "nav-link"
                                    }
                                    style={{
                                        fontFamily: "Inter",
                                        fontSize: "20px",
                                        fontWeight: "500",
                                        letterSpacing: "0.1rem",
                                    }}
                                    href={link.to}
                                    key={link.name}
                                    onClick={() => setNavbar(false)}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        {!buyerProfileExists && (
                            <button
                                className="btn"
                                onClick={()=> {
                                    if(!publicKey && !web3AuthPublicKey) {
                                        setDisplayLogin(!displayLogin);
                                        toggleNavbar();
                                    } else {
                                        setDisplayProfileModal(!displayProfileModal);
                                        toggleNavbar();
                                    }
                                }}
                            >
                                {!publicKey && !web3AuthPublicKey ? 'Login' : 'Start Collecting'}  
                            </button>
                        )}

                        {publicKey | web3AuthPublicKey && buyerProfileExists && (
                            <CgProfile className="profile-icon" 
                                onClick={()=> {
                                    setDisplayLogin(!displayLogin);
                                    toggleNavbar();
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
            {displayLogin && (
                <div className="login-container">
                    <div className="backdrop" onClick={()=> {setDisplayLogin(false)}} />
                    {/* <div className="close-login" onClick={()=> {setDisplayLogin(false)}}>
                        <span className="material-symbols-outlined">
                            <IoClose className="close-icon" />
                        </span>
                    </div> */}
                    <Web3AuthLogin 
                        showModal={displayLogin}
                        handleClose={() => {setDisplayLogin(false)}}
                    />
                </div>
            )}
            {displayProfileModal && (
                <div className="login-container">
                    <div className="backdrop" onClick={()=> {setDisplayProfileModal(false)}} />
                    <ProfileModal 
                        showModal={displayProfileModal}
                        handleClose={() => {setDisplayProfileModal(false)}}
                    />
                </div>
            )}
        </div>
    );
}

export default Navbar;
