import * as anchor from "@coral-xyz/anchor";
import { IDL, Fragment, PROGRAM_ID} from "@/components/Utils/idl";
import {
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
  } from "@solana/web3.js";
  
  import { 
    ASSOCIATED_TOKEN_PROGRAM_ID, 
    TOKEN_2022_PROGRAM_ID, 
    TOKEN_PROGRAM_ID, 
    getAssociatedTokenAddressSync, 
 } from "@solana/spl-token";
import * as b58 from "bs58";

const USDC_DEV = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");

export type MakeTransactionInputData = {
    account: string,
}
  
export type MakeTransactionOutputData = {
    transaction: string,
    message: string,
}

export async function GET( request: Request, res: Response ){
    return new Response(JSON.stringify({
      label: "The Artisan",
      icon: "https://artisan-one.vercel.app/assets/footer-logo1.png",
    }))
}

export async function POST( request: Request) {
    const wallet = Keypair.generate();
    const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
        "confirmed"
    );
    // @ts-expect-error - wallet is dummy variable, signing is not needed
    const provider = new anchor.AnchorProvider(connection, wallet, {});
    const programId = new PublicKey(PROGRAM_ID);
    const program = new anchor.Program<Fragment>(IDL, programId, provider);

    try {
        const req = await request.json();
        const { account } = req as MakeTransactionInputData
        
        const searchParams = new URLSearchParams(request.url);
        const id_string = searchParams.get('id');
        const reference = searchParams.get('reference');
        const refKey = searchParams.get('refKey');
        const id = Number(id_string!);
        const buyer_publicKey = new PublicKey(account);
        console.log('id', id)
        console.log('reference', reference)
        console.log('refKey', refKey)
        console.log('buyer_publicKey', buyer_publicKey.toBase58())


        const watch = PublicKey.findProgramAddressSync([Buffer.from('watch'),  Buffer.from(reference!)], program.programId)[0];
        const listing = PublicKey.findProgramAddressSync([Buffer.from('listing'), watch.toBuffer(), new anchor.BN(id).toBuffer("le", 8)], program.programId)[0];
        const fraction = PublicKey.findProgramAddressSync([Buffer.from('fraction'), listing.toBuffer()], program.programId)[0];
        // const metadata = PublicKey.findProgramAddressSync([Buffer.from('metadata'), fraction.toBuffer()], program.programId)[0];
        
        const auth = PublicKey.findProgramAddressSync([Buffer.from('auth')], program.programId)[0];
        // const adminState = PublicKey.findProgramAddressSync([Buffer.from('admin_state'), buyer_publicKey.toBuffer()], program.programId)[0];
      
        const buyerProfile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];
        const buyerFractionAta = getAssociatedTokenAddressSync(fraction, buyer_publicKey, false, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID)
      
        const listingCurrencyAta = getAssociatedTokenAddressSync(USDC_DEV, listing, true)
        const buyerCurrencyAta = getAssociatedTokenAddressSync(USDC_DEV, buyer_publicKey)
        const buyerProfileAccount = await connection.getAccountInfo(
            buyerProfile
        );
        
        const feeKey = process.env.PRIVATE_KEY!;
        const feePayer = Keypair.fromSecretKey(b58.decode(feeKey));

        console.log('watch', watch.toBase58())
        console.log('listing', listing.toBase58())
        console.log('fraction', fraction.toBase58())
        console.log('auth', auth.toBase58())
        console.log('buyerProfile', buyerProfile.toBase58())
        console.log('buyerFractionAta', buyerFractionAta.toBase58())
        console.log('listingCurrencyAta', listingCurrencyAta.toBase58())
        console.log('buyerCurrencyAta', buyerCurrencyAta.toBase58())
        console.log('feePayer', feePayer.publicKey.toBase58())

        const profileInitIx = await program.methods
            .initializeProfileAccount()
            .accounts({
                payer: feePayer.publicKey,
                user: buyer_publicKey,
                profile: buyerProfile,
                systemProgram: SystemProgram.programId,
            })
            .instruction();
        

        const buyShareIx = await program.methods
            .buyListing(
                false,
                '',
            )
            .accounts({
                payer: feePayer.publicKey,
                buyer: buyer_publicKey,
                buyerProfile,
                buyerCurrencyAta,
                buyerFractionAta,
                listing,
                listingCurrencyAta,
                fraction,
                currency: USDC_DEV,
                auth,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID,
                token2022Program: TOKEN_2022_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .instruction();

        const { blockhash } = await connection.getLatestBlockhash("finalized");
        
        buyShareIx.keys.push({
            pubkey: new PublicKey(refKey!),
            isSigner: false,
            isWritable: false,
        });

        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: feePayer.publicKey
        });

        if(!buyerProfileAccount){
            transaction.add(profileInitIx);
        }
        
        transaction.add(buyShareIx);

        transaction.partialSign(feePayer);

        const serializedTransaction = transaction.serialize({
            requireAllSignatures: false,
        });
        const base64 = serializedTransaction.toString("base64");

        const message = "Enjoy your Fraction from The Artisan!"

        // ****************VERSIONED TRANSACTION****************
        //     const transaction = new VersionedTransaction(
        //         new TransactionMessage({
        //             payerKey: feePayer.publicKey,
        //             recentBlockhash: blockhash,
        //             instructions: [buyShareIx],
        //         }).compileToV0Message(),
        //     );
        //     transaction.sign([feePayer]);

        //     const serializedTransaction = transaction.serialize();
        //     const base64 = Buffer.from(serializedTransaction).toString('base64');

        //     const message = "Enjoy your Fraction from The Artisan!"
            
        //     // get a simulated transaction response 
        //     const response = await connection.simulateTransaction(transaction);
        //     console.log('simulated response', response);

        return new Response(JSON.stringify({transaction: base64, message: message }), {
            headers: {
                'content-type': 'application/json',
            },
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
};

