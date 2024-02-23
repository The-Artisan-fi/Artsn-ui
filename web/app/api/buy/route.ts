import * as anchor from "@coral-xyz/anchor";
import { IDL, Fragment, PROGRAM_ID} from "@/components/Utils/idl";
import {
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection
  } from "@solana/web3.js";
  
  import { 
    ASSOCIATED_TOKEN_PROGRAM_ID, 
    TOKEN_2022_PROGRAM_ID, 
    TOKEN_PROGRAM_ID, 
    createAssociatedTokenAccountIdempotentInstruction, 
    getAssociatedTokenAddressSync, 
 } from "@solana/spl-token";

//https://spl-token-faucet.com/?token-name=USDC-Dev
const USDC_DEV = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");

export async function POST( request: Request ) {
    console.log('route pinged')
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
        const buyer_publicKey = new PublicKey(req.publicKey);
        const id = req.id;

        // VARIABLES
        const reference = 16520;
        const watch = PublicKey.findProgramAddressSync([Buffer.from('watch'),  new anchor.BN(reference).toBuffer("le", 8)], program.programId)[0];
      
        const listing = PublicKey.findProgramAddressSync([Buffer.from('listing'), watch.toBuffer(), new anchor.BN(id).toBuffer("le", 8)], program.programId)[0];
        const fraction = PublicKey.findProgramAddressSync([Buffer.from('fraction'), listing.toBuffer()], program.programId)[0];
        const metadata = PublicKey.findProgramAddressSync([Buffer.from('metadata'), fraction.toBuffer()], program.programId)[0];
        
        const auth = PublicKey.findProgramAddressSync([Buffer.from('auth')], program.programId)[0];
        const adminState = PublicKey.findProgramAddressSync([Buffer.from('admin_state'), buyer_publicKey.toBuffer()], program.programId)[0];
      
        const buyerProfile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];
        const buyerFractionAta = getAssociatedTokenAddressSync(fraction, buyer_publicKey, false, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID)
      
        const listingCurrencyAta = getAssociatedTokenAddressSync(USDC_DEV, listing, true)
        const buyerCurrencyAta = getAssociatedTokenAddressSync(USDC_DEV, buyer_publicKey)

        const createAtaIx = createAssociatedTokenAccountIdempotentInstruction(
            buyer_publicKey,
            buyerFractionAta,
            buyer_publicKey,
            fraction,
            TOKEN_2022_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
        );

        // const profileInitIx = await await program.methods
        //     .initializeProfileAccount()
        //     .accounts({
        //         user: buyer_publicKey,
        //         profile: buyerProfile,
        //         systemProgram: SystemProgram.programId,
        //     })
        //     .instruction();

        const buyShareIx = await program.methods
            .buyListing()
            .accounts({
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

        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: buyer_publicKey,
        });
    
        transaction.add(buyShareIx);

        const serializedTransaction = transaction.serialize({
            requireAllSignatures: false,
          });
        const base64 = serializedTransaction.toString("base64");

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

