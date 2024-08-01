import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { IDL, ArtsnCore, PROGRAM_ID, USDC_MINT} from "@/components/Protocol/idl";
import { mplCoreProgram, manager, mint } from "@/components/Protocol/constants";
import {
    SYSVAR_INSTRUCTIONS_PUBKEY,
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
    TransactionMessage,
    VersionedTransaction,
    SimulateTransactionConfig
  } from "@solana/web3.js";
  
  import { 
    ASSOCIATED_TOKEN_PROGRAM_ID, 
    TOKEN_2022_PROGRAM_ID, 
    TOKEN_PROGRAM_ID, 
    getAssociatedTokenAddressSync, 
 } from "@solana/spl-token";
import * as b58 from "bs58";

//https://spl-token-faucet.com/?token-name=USDC-Dev
const USDC_DEV = new PublicKey(USDC_MINT);

export async function POST( request: Request ) {
    console.log('route pinged')
    const wallet = Keypair.generate();
    // const connection = new Connection(
    //     process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
    //     "confirmed"
    // );
    const keypair = Keypair.fromSecretKey(new Uint8Array([98,92,169,66,67,41,67,79,124,116,29,120,47,124,34,232,98,109,153,34,123,18,134,155,92,250,127,229,94,243,246,2,79,34,69,95,251,23,207,224,32,29,49,152,130,23,100,237,160,59,67,83,92,154,62,228,201,255,143,18,27,180,118,169]));
    // const wallet = new Wallet(keypair);
    //   const program = anchor.workspace.ArtsnCore as Program<ArtsnCore>;
    const connection = new Connection('https://devnet.helius-rpc.com/?api-key=b7faf1b9-5b70-4085-bf8e-a7be3e3b78c2', 'confirmed');
    // @ts-expect-error - wallet is dummy variable, signing is not needed
    const provider = new AnchorProvider(connection,  wallet, {commitment: "confirmed"});
    const program : Program<ArtsnCore> = new Program(IDL, provider);

    try {
        const req = await request.json();
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
        const watch = PublicKey.findProgramAddressSync([Buffer.from('watch'),  Buffer.from(reference)], program.programId)[0];
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
        const listingCurrencyAta = getAssociatedTokenAddressSync(mint, listing, true)
        const buyerCurrencyAta = getAssociatedTokenAddressSync(mint, buyer_publicKey)

        // const createAtaIx = createAssociatedTokenAccountIdempotentInstruction(
        //     buyer_publicKey,
        //     buyerFractionAta,
        //     buyer_publicKey,
        //     fraction,
        //     TOKEN_2022_PROGRAM_ID,
        //     ASSOCIATED_TOKEN_PROGRAM_ID,
        // );

        // const profileInitIx = await await program.methods
        //     .initializeProfileAccount()
        //     .accounts({
        //         user: buyer_publicKey,
        //         profile: buyerProfile,
        //         systemProgram: SystemProgram.programId,
        //     })
        //     .instruction();
        const feeKey = process.env.PRIVATE_KEY!;

        const feePayer = Keypair.fromSecretKey(b58.decode(feeKey));
        const mintAta = getAssociatedTokenAddressSync(mint, buyer_publicKey);
        const listingAta = getAssociatedTokenAddressSync(mint, listing, true);

        console.log('buyer: ', buyer_publicKey.toBase58());
        console.log('feePayer: ', feePayer.publicKey.toBase58());
        console.log('mint: ', mint.toBase58());
        console.log('listing: ', listing.toBase58());
        console.log('buyerCurrencyAta: ', buyerCurrencyAta.toBase58());
        console.log('listingCurrencyAta: ', listingCurrencyAta.toBase58());
        console.log('manager: ', manager.toBase58());
        console.log('buyer_profile: ', buyer_profile.toBase58());
        console.log('watch: ', watch.toBase58());
        console.log('fraction: ', fraction.publicKey.toBase58());
        console.log('ASSOCIATED_TOKEN_PROGRAM_ID: ', ASSOCIATED_TOKEN_PROGRAM_ID.toBase58());
        console.log('TOKEN_PROGRAM_ID: ', TOKEN_PROGRAM_ID.toBase58());
        console.log('mplCoreProgram: ', mplCoreProgram.toBase58());
        console.log('system_program: ', anchor.web3.SystemProgram.programId.toBase58());

        const buyShareIx = await program.methods
            .buyFractionalizedListing(uri)
            .accountsPartial({
                buyer: buyer_publicKey,
                payer: feePayer.publicKey,
                mint: mint,
                buyerAta: buyerCurrencyAta,
                listingAta: listingCurrencyAta,
                manager,
                buyerProfile: buyer_profile,
                listing,
                object: watch,
                fraction: fraction.publicKey,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID,
                mplCoreProgram: mplCoreProgram,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([feePayer, fraction])
            .instruction();
        console.log('buyShareIx', buyShareIx)
        const { blockhash } = await connection.getLatestBlockhash("finalized");
        
        const messageV0 = new TransactionMessage({
          payerKey: feePayer.publicKey,
          recentBlockhash: blockhash,
          instructions: [buyShareIx],
        }).compileToV0Message();
        
        const txn = new VersionedTransaction(messageV0);
        console.log('txn', txn)
        txn.sign([feePayer, fraction])

        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: feePayer.publicKey,
        });

        const base64 = Buffer.from(txn.serialize()).toString('base64'); 
        
        

        // for(let i = 0; i < amount ; i++) {
        //     console.log('buying share', i);
        //     transaction.add(buyShareIx);
        // }
        // transaction.partialSign(feePayer);
        // const serializedTransaction = transaction.serialize({
        //     requireAllSignatures: false,
        //   });
        // const base64 = serializedTransaction.toString("base64");
        // console.log('base64', base64)

        
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
