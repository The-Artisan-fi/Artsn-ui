import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Transaction, Keypair, SystemProgram } from '@solana/web3.js';
// import { encodeURL } from '@solana/pay';
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

type MakeTransactionGetResponse = {
  label: string,
  icon: string,
}

export type MakeTransactionOutputData = {
  transaction: string,
  message: string,
}

type ErrorOutput = {
  error: string
}


// CONSTANTS


// async function generateUrl(
//   recipient: PublicKey,
//   splToken: PublicKey,
//   amount: BigNumber,
//   reference: PublicKey,
//   label: string,
//   message: string,
//   memo: string,
// ) {
//   const url: URL = encodeURL({
//     recipient,
//     splToken,
//     amount,
//     reference,
//     label,
//     message,
//     memo,
//   });
//   return { url };
// }

export async function GET( request: Request, res: Response ){
  return new Response(JSON.stringify({
    label: "The Artisan",
    icon: "https://pink-amused-vulture-511.mypinata.cloud/ipfs/QmfCtL5q7awU1MGbcynRm2zUuK3iAf5eBXG5YqnRtmh4h1?_gl=1*1lmwdln*_ga*MTM3OTYwNjQ2OS4xNjkyODk5MDEy*_ga_5RMPXG14TE*MTY5MzA1NTIwMC4zLjEuMTY5MzA1NTIwMi41OC4wLjA.",
  }))
}

   
export async function POST( request: Request, res: Response ){
  try {
    const feeKey = process.env.PRIVATE_KEY!;
    const demo_keypair = Keypair.fromSecretKey(b58.decode(feeKey));
    const myWallet: string = demo_keypair.publicKey.toBase58();// Replace with your wallet address (this is the destination where the payment will be sent)
    const shopPublicKey = new PublicKey(myWallet);
    const solanaConnection = new Connection(process.env.NEXT_PUBLIC_HELIUS_DEVNET!, 'confirmed');
    const dev_connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    // Get details about the USDC token - Mainnet
    // const usdcAddress = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    
    // Get details about the USDC token - Devnet
    const usdcAddress= new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr')
    console.log('usdc address', usdcAddress.toBase58());
    // We pass the selected items in the query, calculate the expected cost
    const amount = '20';

    const amountBigNumber = new BigNumber(amount as string)

    // We pass the reference to use in the query
    const reference = new Keypair().publicKey


    // We pass the buyer's public key in JSON body
    const req = await request.json();
    const account = req.publicKey;
    
    const buyerPublicKey = new PublicKey(account)
    console.log('buyer pubkey', buyerPublicKey.toBase58());
    console.log('usdc address', usdcAddress.toBase58())
    // Get details about the USDC token
    const usdcMint = await getMint(solanaConnection, usdcAddress)
    console.log('usdc mint', usdcMint.decimals);
    // Get the buyer's USDC token account address
    let buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey)
    console.log('buyer usdc address', buyerUsdcAddress.toBase58());
    const buyerUsdcAccount = await solanaConnection.getAccountInfo(
        buyerUsdcAddress
      );
    if (buyerUsdcAccount === null) {
        const newAccount = await createAssociatedTokenAccount(
            solanaConnection,
            demo_keypair,
            usdcAddress,
            buyerPublicKey
        );

        buyerUsdcAddress = newAccount;
    }
    // Check if the buyerUsdcAddress has any data

    // Get the shop's USDC token account address
    const shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, shopPublicKey)

    // Get a recent blockhash to include in the transaction
    const { blockhash } = await (solanaConnection.getLatestBlockhash('finalized'))

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      // The buyer pays the transaction fee
      feePayer: shopPublicKey,
    })

    // Create the instruction to send USDC from the buyer to the shop
    const transferInstruction = createTransferCheckedInstruction(
      shopUsdcAddress, // source
      usdcAddress, // mint (token address)
      buyerUsdcAddress, // destination
      shopPublicKey, // owner of source address
      (amountBigNumber.toNumber() * (10 ** usdcMint.decimals)), // amount to transfer (in units of the USDC token)
      usdcMint.decimals, // decimals of the USDC token
    )

    // // create instructions for a transfer of .5 sol from shop to buyer
    // const transferInstruction2 = SystemProgram.transfer({
    //   fromPubkey: shopPublicKey,
    //   toPubkey: buyerPublicKey,
    //   lamports: 500000000,
    // });

    // Add the reference to the instruction as a key
    // This will mean this transaction is returned when we query for the reference
    transferInstruction.keys.push({
      pubkey: reference,
      isSigner: false,
      isWritable: false,
    })
    // transferInstruction2.keys.push({
    //   pubkey: reference,
    //   isSigner: false,
    //   isWritable: false,
    // })
    // Add the instruction to the transaction
    transaction.add(transferInstruction)
    // transaction.add(transferInstruction2)
    transaction.partialSign(demo_keypair);

    // Serialize the transaction and convert to base64 to return it
    const serializedTransaction = transaction.serialize({
      // We will need the buyer to sign this transaction after it's returned to them
      requireAllSignatures: false
    })
    const base64 = serializedTransaction.toString('base64')

    // Insert into database: reference, amount
    const message = "Dev Sol and USDC from Artisan, enjoy!"
    // Return the serialized transaction
    return new Response(JSON.stringify({transaction: base64, message: message }), {
        headers: {
            'content-type': 'application/json',
        },
    });
  } catch (err) {
    console.error(err);

    return
  }
}
