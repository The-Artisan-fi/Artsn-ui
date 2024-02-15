import "@/styles/Web3Auth.scss";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { CgGoogle, CgArrowRight } from "react-icons/cg";
import { useEffect, useState } from "react";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { WalletMultiButton  } from '@solana/wallet-adapter-react-ui';
import { useWallet } from "@solana/wallet-adapter-react";
// import RPC from "./solanaRPC";

function Web3AuthLogin() {
    const { publicKey } = useWallet();
    const [web3auth, setWeb3auth] = useState(null);
    const [provider, setProvider] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    console.log('ENV VALUE: ' + process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
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
              <img src="assets/login/login_header.svg" alt="login header" className="login-header" />
              <img src="assets/login/logo_bw.svg" alt="login header" className="logo" />
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
                    loginWithEmail(e.target[0].value);
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
                      onClick={login} 
                      className="google-login-btn" 
                    >
                      <CgGoogle onClick={login} className="google-icon" />
                      <p className="google-login-text">
                        Sign in with Google
                      </p>
                    </button>
                    ):(
                      <button onClick={logout} className="google-login-btn">
                        <CgGoogle onClick={login} className="google-icon" />
                        Log Out
                      </button>
                    )}
                  </div>
              </div>
              <div className="divider-text">OR</div>
              <div className="web3-login-option">
                <div className="wallet-icons-container">
                  <img src="assets/login/phantom_icon.svg" alt="phantom" className="phantom-wallet-icon" />
                  <img src="assets/login/solflare_icon.svg" alt="solflare" className="solflare-wallet-icon" />
                  <img src="assets/login/backpack_icon.svg" alt="backpack" className="backpack-wallet-icon" />
                  <img src="assets/login/torus_icon.svg" alt="torus" className="torus-wallet-icon" />
                  <img src="assets/login/ledger_icon.svg" alt="ledger" className="ledger-wallet-icon" />
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
    );
}

export default Web3AuthLogin;