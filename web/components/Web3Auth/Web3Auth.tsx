import "@/styles/Web3Auth.scss";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CgGoogle, CgArrowRight } from "react-icons/cg";
import { WalletMultiButton  } from '@solana/wallet-adapter-react-ui';
import { useWallet } from "@solana/wallet-adapter-react";
import {
  checkLogin,
  login,
  loginWithEmail,
  logout,
} from "./solanaRPC";
// import RPC from "./solanaRPC";
import LoginHeader from "@/public/assets/login/login_header.svg";
import Logo from "@/public/assets/login/logo_bw.svg";
import Phantom from "@/public/assets/login/phantom_icon.svg"
import Solflare from "@/public/assets/login/solflare_icon.svg"
import Backpack from "@/public/assets/login/backpack_icon.svg"
import Torus from "@/public/assets/login/torus_icon.svg"
import Ledger from "@/public/assets/login/ledger_icon.svg"

interface ProfileModalProps {
  showModal: boolean;
  handleClose: () => void;
}


const Web3AuthLogin: React.FC<ProfileModalProps> = ({showModal, handleClose}) => {
    const { publicKey } = useWallet();
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
      if(!loggedIn) {
        checkLogin().then((res) => {
          if(res) {
            setLoggedIn(res.connected);
          }
        });
      }
    }, [loggedIn]);

    return(
      <>
        {showModal && (
          <div className="modal-container">
            <div className="modal-header">
              <Image src={LoginHeader} alt="login header" className="login-header" />
              <Image src={Logo} alt="login header" className="logo" />
              <div className="header-text-container">
                <p className="header-text">
                    Welcome to the Artisan
                </p>
                <p className="header-subtext">
                  By continuing using The Artisan, you agree to our Terms of Service and Privacy Policy.
                </p>
                <form 
                  className="email-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    loginWithEmail(e.currentTarget.querySelector("input")?.value || "");
                  }
                }>
                  <input type="email" placeholder="Login with Email" />
                  <button type="submit" className="email-btn">
                    <CgArrowRight  className="email-icon"/>
                  </button>
                </form>
              </div>
            </div>
            <div className="login-container">
              <div className="social-login-option">
                  <p className="social-login-text">Login with Social Accounts</p>             
                  <div className="web3auth-container">
                    {!loggedIn ? (
                      <button 
                        onClick={() => login().then((res) => {
                          if(res) {
                            setLoggedIn(true);
                          }
                        })} 
                        className="google-login-btn" 
                      >
                        <CgGoogle className="google-icon" />
                        <p className="google-login-text">
                          Sign in with Google
                        </p>
                      </button>
                    ) : (
                      <button 
                        onClick={() => logout().then((res) => {
                          if(res) {
                            setLoggedIn(false);
                          }
                        })} 
                        className="google-login-btn" 
                      >
                        <CgGoogle className="google-icon" />
                        <p className="google-login-text" style={{width: 'fit-content'}}>
                          Log Out
                        </p>
                      </button>
                    )}
                  </div>
              </div>
              <div className="divider-text">OR</div>
              <div className="web3-login-option">
                <div className="wallet-icons-container">
                  <Image src={Phantom} alt="phantom logo" className="phantom-wallet-icon" />
                  <Image src={Solflare} alt="solflare logo" className="solflare-wallet-icon" />
                  <Image src={Backpack} alt="backpack logo" className="backpack-wallet-icon" />
                  <Image src={Torus} alt="torus logo" className="torus-wallet-icon" />
                  <Image src={Ledger} alt="ledger logo" className="ledger-wallet-icon" />
                </div>
                <WalletMultiButton
                  className="wallet-btn"
                  style={{ 
                    borderRadius: '7px', 
                    height: '36px', 
                    width: '100%',
                    background: 'linear-gradient(92.89deg, rgba(255, 153, 0, 0.26) 6.43%, rgba(151, 71, 255, 0.26) 100%), linear-gradient(93.85deg, #ff9900d3 1.67%, #9747ffd2 100%)',
                    fontFamily: 'Inter',
                    fontWeight: '300',
                    fontStyle: 'normal',
                    fontSize: '1.2rem',
                    lineHeight: '16px',
                    letterSpacing: '-2.6%',
                    border: '1px solid linear-gradient(92.89deg, rgba(255, 153, 0, 0.26) 6.43%, rgba(151, 71, 255, 0.26) 100%), linear-gradient(93.85deg, #FF9900 1.67%, #9747FF 100%)',
                  }}
                > 
                  {
                    publicKey ?
                    <span>Connected</span> :
                    <span>Connect Web3 Wallet</span>
                  }
                </WalletMultiButton>
              </div>
            </div>
          </div>
        )}
      </>
    );
}

export default Web3AuthLogin;