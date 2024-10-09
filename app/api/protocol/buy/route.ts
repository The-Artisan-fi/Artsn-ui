import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import {
    SYSVAR_INSTRUCTIONS_PUBKEY,
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
    TransactionMessage,
    VersionedTransaction,
    SimulateTransactionConfig,
    Cluster
  } from "@solana/web3.js";
  
  import { 
    ASSOCIATED_TOKEN_PROGRAM_ID, 
    TOKEN_2022_PROGRAM_ID, 
    TOKEN_PROGRAM_ID, 
    getAssociatedTokenAddressSync, 
 } from "@solana/spl-token";
import * as b58 from "bs58";
import { getArtisanProgram, getArtisanProgramId, USDC_MINT, MANAGER, mplCoreProgram} from "@/components/solana/protocol/artisan-exports";
import { useMemo } from "react";
import { useCluster } from "@/components/cluster/cluster-data-access";
import { useAnchorProvider } from "@/components/solana/solana-provider";

//https://spl-token-faucet.com/?token-name=USDC-Dev
const USDC_DEV = new PublicKey(USDC_MINT);

export async function POST( request: Request ) {
    const connection = new Connection('https://soft-cold-energy.solana-devnet.quiknode.pro/ad0dda04b536ff45a76465f9ceee5eea6a048a8f', "confirmed");
    const wallet = Keypair.generate();
    // @ts-expect-error - wallet is dummy variable, signing is not needed
    const provider = new AnchorProvider(connection,  wallet, {commitment: "confirmed"});
    const program = getArtisanProgram(provider);
    console.log('program id ->', program.programId.toBase58());
    try {
        const req = await request.json();
        console.log('incoming request ->', req);
        const fraction = Keypair.generate();
        console.log('fraction', fraction.publicKey.toBase58());

        console.log('req', req)
        const buyer_publicKey = new PublicKey(req.publicKey);
        console.log('buyer_publicKey', buyer_publicKey.toBase58());
        const id = req.id;
        const uri = req.uri;

        console.log('id', id);
        console.log('uri', uri);
        // const id = 10817;
        // VARIABLES
        const reference = req.reference;
        const amount = req.amount;
        console.log('reference', reference);
        console.log('amount', amount);
        const watch = PublicKey.findProgramAddressSync([Buffer.from('object'),  Buffer.from(reference)], program.programId)[0];
        const listing = PublicKey.findProgramAddressSync([Buffer.from('listing'), new anchor.BN(id).toBuffer("le", 8)], program.programId)[0];
        // const fraction = PublicKey.findProgramAddressSync([Buffer.from('fraction'), listing.toBuffer()], program.programId)[0];
        // const metadata = PublicKey.findProgramAddressSync([Buffer.from('metadata'), fraction.toBuffer()], program.programId)[0];
        console.log('watch :', watch.toBase58());
        console.log('listing :', listing.toBase58());
        const auth = PublicKey.findProgramAddressSync([Buffer.from('auth')], program.programId)[0];
        // const adminState = PublicKey.findProgramAddressSync([Buffer.from('admin_state'), buyer_publicKey.toBuffer()], program.programId)[0];
      
        const buyer_profile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];
        // const buyerFractionAta = getAssociatedTokenAddressSync(fraction, buyer_publicKey, false, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID)
        console.log('buyer_profile :', buyer_profile.toBase58());
        const listingCurrencyAta = getAssociatedTokenAddressSync(USDC_MINT, listing, true)
        const buyerCurrencyAta = getAssociatedTokenAddressSync(USDC_MINT, buyer_publicKey)

        // const createAtaIx = createAssociatedTokenAccountIdempotentInstruction(
        //     buyer_publicKey,
        //     buyerFractionAta,
        //     buyer_publicKey,
        //     fraction,
        //     TOKEN_2022_PROGRAM_ID,
        //     ASSOCIATED_TOKEN_PROGRAM_ID,
        // );

        // const profileInitIx = await await program.methods
        //     .initializeProfile()
        //     .accounts({
        //         user: buyer_publicKey,
        //         profile: buyerProfile,
        //         systemProgram: SystemProgram.programId,
        //     })
        //     .instruction();
        const feeKey = process.env.PRIVATE_KEY!;

        const feePayer = Keypair.fromSecretKey(b58.decode(feeKey));


        console.log('buyer: ', buyer_publicKey.toBase58());
        console.log('feePayer: ', feePayer.publicKey.toBase58());
        console.log('mint: ', USDC_MINT.toBase58());
        console.log('listing: ', listing.toBase58());
        console.log('buyerCurrencyAta: ', buyerCurrencyAta.toBase58());
        console.log('listingCurrencyAta: ', listingCurrencyAta.toBase58());
        // console.log('manager: ', MANAGER.toBase58());
        console.log('buyer_profile: ', buyer_profile.toBase58());
        console.log('watch: ', watch.toBase58());
        console.log('fraction: ', fraction.publicKey.toBase58());
        // console.log('ASSOCIATED_TOKEN_PROGRAM_ID: ', ASSOCIATED_TOKEN_PROGRAM_ID.toBase58());
        // console.log('TOKEN_PROGRAM_ID: ', TOKEN_PROGRAM_ID.toBase58());
        // console.log('mplCoreProgram: ', mplCoreProgram.toBase58());
        // console.log('system_program: ', anchor.web3.SystemProgram.programId.toBase58());

        const buyShareIx = await program.methods
            // @ts-ignore - missing accounts
            .buyFractionalizedListing(uri)
            .accountsPartial({
                buyer: buyer_publicKey,
                payer: feePayer.publicKey,
                mint: USDC_MINT,
                object: watch,
                fraction: fraction.publicKey,
                listing: listing,
            })
            .signers([feePayer, fraction])
            .instruction();
        // console.log('buyShareIx', buyShareIx)
        const { blockhash } = await connection.getLatestBlockhash("finalized");
        
        let ixs = [];
        for (let i = 0; i < 1; i++) {
            ixs.push(buyShareIx);
        }

        const messageV0 = new TransactionMessage({
          payerKey: feePayer.publicKey,
          recentBlockhash: blockhash,
        //   buyShareIx x amount of times
          instructions: ixs,
        }).compileToV0Message();
        
        const txn = new VersionedTransaction(messageV0);
        // console.log('txn', txn)
        txn.sign([feePayer, fraction])

        const base64 = Buffer.from(txn.serialize()).toString('base64'); 

        
        // console.log(
        //     'simulate transaction', 
        //     await connection.simulateTransaction(
        //         txn,
        //         config
        //     ))
        return new Response(JSON.stringify({transaction: base64 }), {
            headers: {
                'content-type': 'application/json',
            },
        });

    } catch (e) {
        console.log(e);
        throw e;
    }
};
