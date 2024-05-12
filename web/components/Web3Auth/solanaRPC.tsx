import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, IProvider, CustomChainConfig } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { SolanaWallet } from "@web3auth/solana-provider";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

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

function uiConsole(...args: string[] | object[]) {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
  }
} 

export async function init() {
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


    const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

    const openloginAdapter = new OpenloginAdapter({
      privateKeyProvider,
      adapterSettings: {
        uxMode: "redirect",
      }
    });
    web3auth.configureAdapter(openloginAdapter);

    await web3auth.init();
    
    return web3auth;
  } catch (error) {
    console.error(error);
  }
}

export const checkLogin = async () => {
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


    const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

    const openloginAdapter = new OpenloginAdapter({
      privateKeyProvider,
      adapterSettings: {
        uxMode: "redirect",
      }
    });
    web3auth.configureAdapter(openloginAdapter);

    await web3auth.init();
  
  if (web3auth.connected) {
    const rpc = new SolanaRpc(web3auth.provider!);
    const account = await rpc.getAccounts();
    return {
      connected: true,
      account: account[0],
      rpc: rpc,
    };
  } else {
    return {
      connected: false,
      rpc: null,
    };
  }
}

export const login = async () => {
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


    const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

    const openloginAdapter = new OpenloginAdapter({
      privateKeyProvider,
      adapterSettings: {
        uxMode: "redirect",
      }
    });
    web3auth.configureAdapter(openloginAdapter);

    await web3auth.init();

    const web3authProvider: IProvider | null = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "google",
      },
    );

    if(!web3authProvider) {
      console.log('web3authProvider not initialized yet')
      uiConsole("web3authProvider not initialized yet");
      return;
    }

    return true;
  } catch (error) {
    console.error(error);
  }
};

export const logout = async () => {
  console.log('logging out')
  try{
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


  const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

  const openloginAdapter = new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings: {
      uxMode: "redirect",
    }
  });
  web3auth.configureAdapter(openloginAdapter);

  await web3auth.init();

  const web3authProvider: IProvider | null = await web3auth.connectTo(
    WALLET_ADAPTERS.OPENLOGIN,
    {
      loginProvider: "google",
    },
  );

  // if(!web3authProvider) {
  //   console.log('web3authProvider not initialized yet')
  //   uiConsole("web3authProvider not initialized yet");
  //   return;
  // }

  await web3auth.logout();
  
  return true;
  } catch (error) {
    console.error(error);
  }
};

export const loginWithEmail = async (email: string) => {
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
  if(!web3authProvider) {
    uiConsole("web3authProvider not initialized yet");
    return;
  }
};
  
export default class SolanaRpc {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }
  
  getAccounts = async (): Promise<string[]> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const acc = await solanaWallet.requestAccounts();
      return acc;
    } catch (error) {
      return error as string[];
    }
  };

  getBalance = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
        method: "solana_provider_config",
        params: [],
      });
      const conn = new Connection(connectionConfig.rpcTarget);

      const accounts = await solanaWallet.requestAccounts();
      const balance = await conn.getBalance(new PublicKey(accounts[0]));
      return balance.toString();
    } catch (error) {
      return error as string;
    }
  };

  signMessage = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const msg = Buffer.from("Test Signing Message ", "utf8");
      const res = await solanaWallet.signMessage(msg);
      return res.toString();
    } catch (error) {
      return error as string;
    }
  };

  sendTransaction = async (tx: Transaction): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);

      const { signature } = await solanaWallet.signAndSendTransaction(
        tx
      );
      return signature;
    } catch (error) {
      return error as string;
    }
  };

  signAllTransaction = async (tx: TransactionInstruction): Promise<Transaction[]> => {

      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getRecentBlockhash("finalized");

      const transaction = new Transaction({ recentBlockhash: blockhash, feePayer: new PublicKey(pubKey[0]) }).add(tx);

      const signedTx = await solanaWallet.signAllTransactions([transaction]);
      return signedTx;
  };
}