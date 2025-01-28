import * as anchor from '@coral-xyz/anchor'
import {
  getArtisanProgram,
  USDC_MINT,
  ARTISAN_PROGRAM_ID as PROGRAM_ID,
  mplCoreProgram,
  MANAGER as manager,
} from '@/components/blockchain/artisan-exports'
// import { mint } from "@/components/Protocol/constants";
import {
  SYSVAR_INSTRUCTIONS_PUBKEY,
  PublicKey,
  SystemProgram,
  Keypair,
  Transaction,
  Connection,
  Ed25519Program,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token'
import * as b58 from 'bs58'

//https://spl-token-faucet.com/?token-name=USDC-Dev
const USDC_DEV = new PublicKey(USDC_MINT)

const intToBytes = (int: number): Uint8Array => {
  const buffer = new ArrayBuffer(4) // Create a buffer of 4 bytes (32 bits).
  const view = new DataView(buffer)
  view.setUint32(0, int, true) // Write the integer to the buffer. 'true' for little endian.
  return new Uint8Array(buffer)
}

const stringToBytes = (sessionId: string) => {
  return new TextEncoder().encode(sessionId)
}

const concatenateUint8Arrays = (arr1: Uint8Array, arr2: Uint8Array) => {
  const concatenatedArray = new Uint8Array(arr1.length + arr2.length)
  concatenatedArray.set(arr1, 0)
  concatenatedArray.set(arr2, arr1.length)
  return concatenatedArray
}

export async function POST(request: Request) {
  console.log('route pinged')
  const wallet = Keypair.generate()
  const connection = new Connection(
    'https://soft-cold-energy.solana-devnet.quiknode.pro/ad0dda04b536ff45a76465f9ceee5eea6a048a8f',
    'confirmed'
  )
  // @ts-expect-error - wallet is dummy variable, signing is not needed
  const provider = new anchor.AnchorProvider(connection, wallet, {})
  const programId = new PublicKey(PROGRAM_ID)
  const program = getArtisanProgram(provider)
  console.log('Program:', programId.toBase58())
  try {
    const req = await request.json()
    const buyer_publicKey = new PublicKey(req.publicKey)
    const id = req.id
    console.log('incoming req ->', req)
    // VARIABLES
    const reference = req.reference
    const amount = req.amount
    const sessionId = req.sessionId
    const uri = decodeURI(req.uri)
    console.log('uri ->', uri)
    const watch = PublicKey.findProgramAddressSync(
      [Buffer.from('object'), Buffer.from(reference)],
      program.programId
    )[0]

    console.log('watch ->', watch.toString())

    // const listing = PublicKey.findProgramAddressSync(
    //   [
    //     Buffer.from('listing'),
    //     watch.toBuffer(),
    //     new anchor.BN(id).toBuffer('le', 8),
    //   ],
    //   program.programId
    // )[0];
    const listing = new PublicKey(id)
    console.log('listing ->', listing.toString())

    const listingCurrencyAta = getAssociatedTokenAddressSync(
      USDC_DEV,
      listing,
      true
    )

    console.log('listingCurrencyAta ->', listingCurrencyAta.toString())
    const feeKey = process.env.PRIVATE_KEY!
    const feePayer = Keypair.fromSecretKey(b58.decode(feeKey))
    // const buyerCurrencyAta = getAssociatedTokenAddressSync(
    //   USDC_DEV,
    //   buyer_publicKey
    // );
    const buyerCurrencyAta = await getOrCreateAssociatedTokenAccount(
      connection,
      feePayer,
      USDC_DEV,
      buyer_publicKey,
      true,
      'finalized'
    )
    console.log('buyerCurrencyAta ->', buyerCurrencyAta.toString())

    const sigKey = process.env.SIGNING_AUTHORITY!
    const sigPayer = Keypair.fromSecretKey(b58.decode(sigKey))

    console.log('feePayer ->', feePayer.publicKey.toString())

    const message = intToBytes(amount)
    const stringBytes = stringToBytes(sessionId) // Convert string to bytes
    const combinedBytes = concatenateUint8Arrays(message, stringBytes) // Concatenate the byte arrays

    // console.log('combinedBytes ->', combinedBytes);

    const ed25519Ix = Ed25519Program.createInstructionWithPrivateKey({
      privateKey: sigPayer.secretKey,
      message: combinedBytes,
    })
    console.log(
      'preparing to buy',
      amount,
      'shares of',
      listing.toString(),
      'going to',
      buyer_publicKey.toString()
    )
    const buyer_profile = PublicKey.findProgramAddressSync(
      [Buffer.from('profile'), buyer_publicKey.toBuffer()],
      program.programId
    )[0]
    console.log('buyer_profile ->', buyer_profile.toString())
    const fraction = Keypair.generate()
    const buyShareIx = await program.methods
      //@ts-expect-error - missing arguments
      .buyFractionalizedListing(uri)
      .accountsPartial({
        buyer: buyer_publicKey,
        payer: feePayer.publicKey,
        mint: USDC_MINT,
        listing,
        object: watch,
        fraction: fraction.publicKey,
      })
      .signers([feePayer, fraction])
      .instruction()

    const ixs = []
    for (let i = 0; i < 1; i++) {
      ixs.push(ed25519Ix)
      ixs.push(buyShareIx)
    }
    const { blockhash } = await connection.getLatestBlockhash('finalized')
    // const transaction = new Transaction({
    //   recentBlockhash: blockhash,
    //   feePayer: feePayer.publicKey,
    // });
    // for (let i = 0; i < amount; i++) {
    //   console.log('buying share', i);
    //   transaction.add(ed25519Ix).add(buyShareIx);
    // }
    // transaction.partialSign(feePayer);
    // transaction.partialSign(fraction);

    // const serializedTransaction = transaction.serialize({
    //   requireAllSignatures: false,
    // });
    // const base64 = serializedTransaction.toString('base64');
    console.log('latest blockhash ->', blockhash)
    const messageV0 = new TransactionMessage({
      payerKey: feePayer.publicKey,
      recentBlockhash: blockhash,
      //   buyShareIx x amount of times
      instructions: ixs,
    }).compileToV0Message()

    const txn = new VersionedTransaction(messageV0)
    // console.log('txn', txn)
    txn.sign([feePayer, fraction])

    const base64 = Buffer.from(txn.serialize()).toString('base64')

    console.log('returning txn ->', base64)
    return new Response(JSON.stringify({ transaction: base64 }), {
      headers: {
        'content-type': 'application/json',
      },
    })
  } catch (e) {
    console.log(e)
    throw e
  }
}
