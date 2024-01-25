import "./Web3Auth.scss";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { CgGoogle } from "react-icons/cg";
import { useEffect, useState } from "react";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
// import RPC from "./solanaRPC";

import { WalletMultiButton  } from '@solana/wallet-adapter-react-ui';
function Web3AuthLogin() {
    const [web3auth, setWeb3auth] = useState(null);
    const [provider, setProvider] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);

    const clientId = "BI8MhAUT4vK4cfQZRQ_NEUYOHE3dhD4ouJif9SUgbgBeeZwP6wBlXast2pZsQJlney3nPBDb-PcMl9oF6lV67P0";
    
    function uiConsole(...args) {
        const el = document.querySelector("#console>p");
        if (el) {
          el.innerHTML = JSON.stringify(args || {}, null, 2);
        }
    }    
    
    const login = async () => {
        if (!web3auth) {
          uiConsole("web3auth not initialized yet");
          return;
        }
        const web3authProvider = await web3auth.connectTo(
          WALLET_ADAPTERS.OPENLOGIN,
          {
            loginProvider: "google",
          },
        );
        setProvider(web3authProvider);
    };

    const loginWithEmail = async (email) => {
      if (!web3auth) {
        uiConsole("web3auth not initialized yet");
        return;
      }
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "email_passwordless",
        extraLoginOptions: {
          login_hint: email, // email to send the OTP to
        },
      });
      setProvider(web3authProvider);
    };

    const logout = async () => {
        if (!web3auth) {
          uiConsole("web3auth not initialized yet");
          return;
        }
        await web3auth.logout();
        setProvider(null);
        setLoggedIn(false);
    };

    // RENDER VIEWS*******************************
    const unloggedInView = (
      <div className="web3auth-container">
        <button 
          onClick={login} 
          disabled={!termsAgreed}
          className="login-btn" 
        >
          <CgGoogle onClick={login} className="google-icon" />
          Google
        </button>
        <form 
          className="email-form"
          onSubmit={(e) => {
            e.preventDefault();
            loginWithEmail(e.target[0].value);
          }
        }>
          <input type="email" placeholder="Login with Email" />
          <button type="submit" className="email-btn" disabled={!termsAgreed}>
            Continue
          </button>
        </form>
      </div>
    );

    const loggedInView = (
        <div className="flex-container"> 
          <div>
            <button onClick={logout} className="login-btn">
              Log Out
            </button>
          </div>
        </div>
      );

    useEffect(() => {
        const init = async () => {
            try {
              const chainConfig = {
                chainNamespace: CHAIN_NAMESPACES.SOLANA,
                chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
                rpcTarget: "https://api.devnet.solana.com",
                displayName: "Solana Devnet",
                blockExplorer: "https://explorer.solana.com",
                ticker: "SOL",
                tickerName: "Solana Token",
              };
              const web3auth = new Web3AuthNoModal({
                clientId,
                chainConfig,
                web3AuthNetwork: "sapphire_mainnet",
              });
      
              setWeb3auth(web3auth);
      
              const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });
      
              const openloginAdapter = new OpenloginAdapter({
                privateKeyProvider,
                adapterSettings: {
                  uxMode: "redirect",
                }
              });
              web3auth.configureAdapter(openloginAdapter);
      
              await web3auth.init();
              setProvider(web3auth.provider);
              console.log('provider', provider)
              if (web3auth.connected) {
                setLoggedIn(true);
              }
            } catch (error) {
              console.error(error);
            }
          };
    
        init();
      }, []);

    return(
        <div className="modal-container">
            <div className="modal-header">
              <img src="src/assets/navbrand-full.webp" alt="logo" className="logo" />
              <p className="header-text">
                  Lorem epsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="login-container">
              <div className="login-option">
                  <p className="login-text">Web3 Wallet</p>
                  <WalletMultiButton 
                    disabled={!termsAgreed}
                  style={{ borderRadius: '30px', height: '4rem', minWidth: 'fit-content' }}/>
              </div>
              <div className="divider">
                <div className="vertical-line"></div>
                <div className="horizontal-line"></div>
                  <span>or</span>
                <div className="vertical-line"></div>
                <div className="horizontal-line"></div>
              </div>
              <div className="login-option">
                <p className="login-text">Social Login</p>
                  {loggedIn ? loggedInView : unloggedInView}
              </div>
            </div>
            <div className="checkbox-container">
                <input type="checkbox" onChange={() => {setTermsAgreed(!termsAgreed)}}/>
                <p className="checkbox-text">I agree to the <span className="terms">Terms and Conditions</span></p>
            </div>
        </div>
    );
}

export default Web3AuthLogin;