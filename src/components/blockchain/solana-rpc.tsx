import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";
import { USDC_MINT } from "./artisan-exports";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi"
import { CustomChainConfig, IProvider } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";
import * as b58 from "bs58";
import { get } from "http";
import { getAccount, getAssociatedTokenAddress, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { rpcManager } from '@/lib/rpc/rpc-manager';
const RPC = rpcManager.getConnection();

  export default class SolanaRpc {
    private provider: IProvider;
    private solanaWallet: SolanaWallet;
  
    constructor(provider: IProvider) {
      this.provider = provider;
      this.solanaWallet = new SolanaWallet(this.provider);
    }
  
    private async getConnection(): Promise<Connection> {
      // const connectionConfig = await this.solanaWallet.request<string[], CustomChainConfig>({
      //   method: "solana_provider_config",
      //   params: [],
      // });
      // return new Connection(connectionConfig.rpcTarget);
      return RPC;
    }
  
    async getAccounts(): Promise<string[]> {
      try {
        return await this.solanaWallet.requestAccounts();
      } catch (error) {
        console.error("Error getting accounts:", error);
        return [];
      }
    }
  
    async getBalance(): Promise<{sol: any, usdc: any}> {
      try {
        const conn = await this.getConnection();
        const accounts = await this.getAccounts();
        console.log('accounts  ---->:', accounts);
        const balance = await conn.getBalance(new PublicKey(accounts[0]));
        console.log('balance***:', balance);
        const usdcAta = await getAssociatedTokenAddress(new PublicKey(accounts[0]), new PublicKey(USDC_MINT));
        console.log('usdcAta:', usdcAta.toString());
        // const usdcBalance = await conn.getTokenAccountBalance(usdcAta);
        // console.log('usdcBalance****:', usdcBalance);
        // // const amount = Number(usdcBalance.amount);
        // console.log('usdcBalance:', usdcBalance);
        const obj = {
          sol: (balance / LAMPORTS_PER_SOL),
          usdc: 27,
        }
        return obj;
      } catch (error) {
        console.error("Error getting balance:", error);
        return {sol: 0, usdc: 0};
      }
    }
  
    async signMessage(message: string = "Test Signing Message"): Promise<string> {
      try {
        const msg = Buffer.from(message, "utf8");
        const res = await this.solanaWallet.signMessage(msg);
        return res.toString();
      } catch (error) {
        console.error("Error signing message:", error);
        return "";
      }
    }
  
    async sendTransaction(amount: number = 0.01): Promise<string> {
      try {
        const accounts = await this.getAccounts();
        const connection = await this.getConnection();
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized");
  
        const transaction = new Transaction({
          feePayer: new PublicKey(accounts[0]),
          blockhash,
          lastValidBlockHeight,
        }).add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(accounts[0]),
            toPubkey: new PublicKey(accounts[0]),
            lamports: amount * LAMPORTS_PER_SOL,
          })
        );
  
        const { signature } = await this.solanaWallet.signAndSendTransaction(transaction);
        return signature;
      } catch (error) {
        console.error("Error sending transaction:", error);
        return "";
      }
    }
  
    async signTransaction(tx: any): Promise<string> {
      try {
        console.log('signing and sending transaction w/ web3auth');
        const accounts = await this.getAccounts();
        // const connection = await this.getConnection();
        const connection = new Connection("https://soft-cold-energy.solana-devnet.quiknode.pro/ad0dda04b536ff45a76465f9ceee5eea6a048a8f");
        const { blockhash } = await connection.getLatestBlockhash("finalized");
  
        const umi = createUmi('https://soft-cold-energy.solana-devnet.quiknode.pro/ad0dda04b536ff45a76465f9ceee5eea6a048a8f');
        const UMI_KEY: string = process.env.NEXT_PUBLIC_UMI_KEY!;
        const UMI_KEY_JSON = JSON.parse(UMI_KEY);
        const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(UMI_KEY_JSON));
        console.log('UMI KEYPAIR ->', keypair.publicKey.toString());
        const _signer = createSignerFromKeypair(umi, keypair);
        umi.use(signerIdentity(_signer));
  
        const signedTx = await this.solanaWallet.signAndSendTransaction(tx);
        console.log('signedTx:', signedTx);
        // Convert the signed transaction to a format compatible with Umi
        // const umiTx = umi.transactions.deserialize(signedTx.serialize());
        // console.log('umiTx:', umiTx);
        // const signature = await umi.rpc.sendTransaction(umiTx, {
        //   skipPreflight: true,
        // });
        const signature = signedTx.signature;
        console.log('SIGNATURE ->', signature);
        // const confirmResult = await umi.rpc.confirmTransaction(signature, {
        // strategy: { type: 'blockhash', ...(await umi.rpc.getLatestBlockhash()) },
        // })

        // console.log('Transaction confirmed:', confirmResult);
        
        return signature.toString() || "";
      } catch (error) {
        console.error("Error signing transaction:", error);
        return "";
      }
    }
  
    async sendVersionedTransaction(): Promise<string> {
      try {
        const accounts = await this.getAccounts();
        const connection = await this.getConnection();
        const { blockhash } = await connection.getLatestBlockhash("finalized");
  
        const instruction = SystemProgram.transfer({
          fromPubkey: new PublicKey(accounts[0]),
          toPubkey: new PublicKey(accounts[0]),
          lamports: 0.01 * LAMPORTS_PER_SOL,
        });
  
        const messageV0 = new TransactionMessage({
          payerKey: new PublicKey(accounts[0]),
          recentBlockhash: blockhash,
          instructions: [instruction],
        }).compileToV0Message();
  
        const transaction = new VersionedTransaction(messageV0);
        const { signature } = await this.solanaWallet.signAndSendTransaction(transaction);
        
        return signature;
      } catch (error) {
        console.error("Error sending versioned transaction:", error);
        return "";
      }
    }
  
    async signVersionedTransaction({ tx }: { tx: VersionedTransaction}): Promise<string> {
      try {
        console.log('signing and sending transaction w/ web3auth');
        const accounts = await this.getAccounts();
        // const connection = await this.getConnection();
        const connection = rpcManager.getConnection()
        const umi = rpcManager.getUmi();
        const UMI_KEY: string = process.env.NEXT_PUBLIC_UMI_KEY!;
        const UMI_KEY_JSON = JSON.parse(UMI_KEY);
        const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(UMI_KEY_JSON));
        const _signer = createSignerFromKeypair(umi, keypair);
        umi.use(signerIdentity(_signer));
  
        const signedTx = await this.solanaWallet.signTransaction(tx);
        console.log('signedTx:', signedTx);
        // Convert the signed transaction to a format compatible with Umi
        const umiTx = umi.transactions.deserialize(signedTx.serialize());
        
        const signature = await umi.rpc.sendTransaction(umiTx, {
        skipPreflight: true,
        });
        const confirmResult = await umi.rpc.confirmTransaction(signature, {
        strategy: { type: 'blockhash', ...(await umi.rpc.getLatestBlockhash()) },
        })

        console.log('Transaction confirmed:', confirmResult);
        const string = b58.encode(Buffer.from(signature));
        return string;
      } catch (error) {
        console.error("Error signing versioned transaction:", error);
        throw error;
      }
    }
  
    async signAllTransactions(count: number = 3): Promise<Transaction[]> {
      try {
        const accounts = await this.getAccounts();
        const connection = await this.getConnection();
        const { blockhash } = await connection.getLatestBlockhash("finalized");
  
        const transactions = Array(count).fill(null).map((_, i) => 
          new Transaction({
            feePayer: new PublicKey(accounts[0]),
            recentBlockhash: blockhash,
          }).add(
            SystemProgram.transfer({
              fromPubkey: new PublicKey(accounts[0]),
              toPubkey: new PublicKey(accounts[0]),
              lamports: (0.01 * (i + 1)) * LAMPORTS_PER_SOL,
            })
          )
        );
  
        return await this.solanaWallet.signAllTransactions(transactions);
      } catch (error) {
        console.error("Error signing all transactions:", error);
        throw error;
      }
    }
  
    async signAllVersionedTransactions(count: number = 3): Promise<VersionedTransaction[]> {
      try {
        const accounts = await this.getAccounts();
        const connection = await this.getConnection();
        const { blockhash } = await connection.getLatestBlockhash("finalized");
  
        const transactions = Array(count).fill(null).map((_, i) => {
          const instruction = SystemProgram.transfer({
            fromPubkey: new PublicKey(accounts[0]),
            toPubkey: new PublicKey(accounts[0]),
            lamports: (0.01 * (i + 1)) * LAMPORTS_PER_SOL,
          });
  
          const messageV0 = new TransactionMessage({
            payerKey: new PublicKey(accounts[0]),
            recentBlockhash: blockhash,
            instructions: [instruction],
          }).compileToV0Message();
  
          return new VersionedTransaction(messageV0);
        });
  
        return await this.solanaWallet.signAllTransactions(transactions);
      } catch (error) {
        console.error("Error signing all versioned transactions:", error);
        throw error;
      }
    }
  
    async getPrivateKey(): Promise<string> {
      try {
        return await this.provider.request({
          method: "solanaPrivateKey",
        }) as string;
      } catch (error) {
        console.error("Error getting private key:", error);
        return "";
      }
    }
  }