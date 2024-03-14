import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
    createTransferCheckedInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccount,
    getMint,
  } from "@solana/spl-token";

import * as b58 from "bs58";


export type MakeTransactionInputData = {
  account: string,
}

export type MakeTransactionOutputData = {
  transaction: string,
  message: string,
}

export async function GET(){
  return new Response(JSON.stringify({
    label: "The Artisan",
    icon: "https://pink-amused-vulture-511.mypinata.cloud/ipfs/QmfCtL5q7awU1MGbcynRm2zUuK3iAf5eBXG5YqnRtmh4h1?_gl=1*1lmwdln*_ga*MTM3OTYwNjQ2OS4xNjkyODk5MDEy*_ga_5RMPXG14TE*MTY5MzA1NTIwMC4zLjEuMTY5MzA1NTIwMi41OC4wLjA.",
  }))
}

   
export async function POST( request: Request ){
  try {
    const feeKey = process.env.PRIVATE_KEY!;
    const demo_keypair = Keypair.fromSecretKey(b58.decode(feeKey));
    const myWallet: string = demo_keypair.publicKey.toBase58();// Replace with your wallet address (this is the destination where the payment will be sent)
    const shopPublicKey = new PublicKey(myWallet);
    const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_DEVNET!, 'confirmed');
    const usdcAddress= new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr')

    const amount = '10';

    const amountBigNumber = new BigNumber(amount as string)

    const reference = new Keypair().publicKey

    const req = await request.json();
    const { account } = req as MakeTransactionInputData
    
    const buyerPublicKey = new PublicKey(account)
    const usdcMint = await getMint(connection, usdcAddress)
    let buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey)
    const buyerUsdcAccount = await connection.getAccountInfo(
        buyerUsdcAddress
      );
    if (buyerUsdcAccount === null) {
      const newAccount = await createAssociatedTokenAccount(
          connection,
          demo_keypair,
          usdcAddress,
          buyerPublicKey
      );

      buyerUsdcAddress = newAccount;
    }

    const shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, shopPublicKey)

    const { blockhash } = await (connection.getLatestBlockhash('finalized'))
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    })

    const transferInstruction = createTransferCheckedInstruction(
      shopUsdcAddress, // source
      usdcAddress, // mint (token address)
      buyerUsdcAddress, // destination
      shopPublicKey, // owner of source address
      (amountBigNumber.toNumber() * (10 ** usdcMint.decimals)), // amount to transfer (in units of the USDC token)
      usdcMint.decimals, // decimals of the USDC token
    )

    transferInstruction.keys.push({
      pubkey: reference,
      isSigner: false,
      isWritable: false,
    })

    transaction.add(transferInstruction)
    transaction.partialSign(demo_keypair);

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false
    })

    const base64 = serializedTransaction.toString('base64')

    const message = "Dev USDC from Artisan, enjoy!"

    return new Response(JSON.stringify({transaction: base64, message: message }), {
        headers: {
            'content-type': 'application/json',
        },
    });
  } catch (err: unknown) {
    console.error(err);
    return
  }
}
