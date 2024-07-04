"use client"
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "@/styles/Navbar.scss";
// import { Link, useLocation } from "react-router-dom";
import Link from "next/link";
import Image from "next/image";

// import navbrand from "../../assets/navbrand-full.webp";
import { CgProfile } from "react-icons/cg";
import { IoMenu, IoClose } from "react-icons/io5";
import { useWallet } from "@solana/wallet-adapter-react";
import Web3AuthLogin from "../Web3Auth/Web3Auth";
import { checkLogin } from "@/components/Web3Auth/solanaRPC";
import ProfileModal from "@/components/Profile/ProfileModal";
import 'react-toastify/dist/ReactToastify.css';

import NavBrand from "@/public/assets/navbrand-full.webp";
import Logo from "@/public/assets/navbrand-logo-bw.png";

function Navbar() {
    // navbar state
    const [navbar, setNavbar] = useState(false);
    const [displayLogin, setDisplayLogin] = useState(false);
    const [web3AuthPublicKey, setWeb3AuthPublicKey] = useState(null);
    const [displayProfileModal, setDisplayProfileModal] = useState(false);
    const [buyerProfileExists, setBuyerProfileExists] = useState(false);
    const pathname = usePathname()
    const router = useRouter();
    // get current path
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
      to: '/collect-fraction',
      name: 'Fragment'
    },
    {
      to: '/about',
      name: 'About Us',
    },
  ];

  const mobileNavLinks = [
    {
      to: '/market',
      name: 'The Market',
    },
    {
      to: '/fi',
      name: 'TheFi',
    },
    {
      to: 'https://theboutique-vr.com/',
      name: 'The Boutique',
    },
    {
      to: '/faq',
      name: 'FAQs',
    },
    {
      to: '/collect-fraction',
      name: 'Fragment'
    },
    {
      to: '/about',
      name: 'About Us',
    },
  ];

  async function checkBuyerProfile(key) {
    try {
      const response = await fetch('/api/getProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: key,
        }),
      });
      const profile = await response.json();
      console.log('profile***', profile.profile)
      if(profile.profile != false) {
        setBuyerProfileExists(profile.profile);
      } else {
        setDisplayProfileModal(true);
      }
    } catch (error) {
      console.error('Error sending transaction', error);
    }
  }

  useEffect(() => {
    if (!publicKey && !web3AuthPublicKey) {
      return;
    }
    if (publicKey) {
      checkBuyerProfile(publicKey.toBase58());
    }
    if (web3AuthPublicKey) {
      checkBuyerProfile(web3AuthPublicKey);
    }
    // if(!displayProfileModal && publicKey){
    //   checkBuyerProfile(publicKey.toBase58());
    // }
    // if(!displayProfileModal && web3AuthPublicKey){
    //   checkBuyerProfile(web3AuthPublicKey);
    // }
  }, [publicKey, web3AuthPublicKey]);

  useEffect(() => {
      if(web3AuthPublicKey == null && !publicKey) {
          checkLogin().then((res) => {
              if(res.connected){
                  setWeb3AuthPublicKey(res.account);
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
                <Image className="navbrand-img" src={NavBrand} alt="brand image" />{" "}
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
              {(!buyerProfileExists && publicKey && pathname != "/") || 
                (!buyerProfileExists && web3AuthPublicKey && pathname != "/") && 
                (
                  <button
                    className="btn"
                    onClick={()=> {
                      setDisplayProfileModal(!displayProfileModal)
                    }}
                  >
                      Create Profile
                  </button>
              )}
              {!publicKey && !web3AuthPublicKey && (
                  <button
                      className="btn"
                      onClick={()=> {
                          setDisplayLogin(!displayLogin)
                      }}
                  >
                      Login 
                  </button>
              )}
              {((publicKey && !web3AuthPublicKey) || (web3AuthPublicKey && !publicKey)) && (
                  <CgProfile className="profile-icon" 
                      onClick={()=> {
                        if(buyerProfileExists){
                          router.push("/dashboard")
                        } else {
                          setDisplayProfileModal(true)
                        }
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
                      <Image className="navbrand-img" src={Logo} alt="logo" />{" "}
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
                <Image className="navbrand-img" src={NavBrand} alt="brand image" />{" "}
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
                  className={isActive ? 'active-link' : 'nav-link'}
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '20px',
                    fontWeight: '500',
                    letterSpacing: '0.1rem',
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
                onClick={() => {
                  if (!publicKey && !web3AuthPublicKey) {
                    setDisplayLogin(!displayLogin);
                    toggleNavbar();
                  } else {
                    setDisplayProfileModal(!displayProfileModal);
                    toggleNavbar();
                  }
                }}
              >
                {!publicKey && !web3AuthPublicKey
                  ? 'Login'
                  : 'Start Collecting'}
              </button>
            )}

            {publicKey | web3AuthPublicKey && buyerProfileExists && (
              <CgProfile
                className="profile-icon"
                onClick={() => {
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
          <div
            className="backdrop"
            onClick={() => {
              setDisplayLogin(false);
            }}
          />
          {/* <div className="close-login" onClick={()=> {setDisplayLogin(false)}}>
                        <span className="material-symbols-outlined">
                            <IoClose className="close-icon" />
                        </span>
                    </div> */}
          <Web3AuthLogin
            showModal={displayLogin}
            handleClose={() => {
              setDisplayLogin(false);
            }}
          />
        </div>
      )}
      {displayProfileModal && (
        <div className="login-container">
          <div
            className="backdrop"
            onClick={() => {
              setDisplayProfileModal(false);
            }}
          />
          <ProfileModal
            showModal={displayProfileModal}
            handleClose={() => {
              setDisplayProfileModal(false);
            }}
            handleCloseThenCheck={() => {
              setDisplayProfileModal(false);
              if(publicKey){
                checkBuyerProfile(publicKey.toBase58());
              } else if(web3AuthPublicKey){
                checkBuyerProfile(web3AuthPublicKey);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Navbar;