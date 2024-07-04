import * as anchor from "@coral-xyz/anchor";
import { IDL, Fragment, PROGRAM_ID} from "@/components/Utils/idl";
import {
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
    sendAndConfirmTransaction,
    ComputeBudgetProgram
  } from "@solana/web3.js";
import * as b58 from "bs58";
  

export async function POST( request: Request ) {
    const wallet = Keypair.generate();
    const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
        "confirmed"
    );
    // @ts-expect-error - wallet is dummy variable, signing is not needed
    const provider = new anchor.AnchorProvider(connection, wallet, {});
    const programId = new PublicKey(PROGRAM_ID);
    console.log('programId', programId.toBase58());
    const program = new anchor.Program<Fragment>(IDL, programId, provider);
    const uri = 'www.example.com'
    try {
        const req = await request.json();
        const buyer_publicKey = new PublicKey(req.publicKey);

        // VARIABLES
        const buyerProfile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];
        const feeKey = process.env.PRIVATE_KEY!;
        const feePayer = Keypair.fromSecretKey(b58.decode(feeKey));
        const profileInitIx = await program.methods
            .initializeProfileAccount()
            .accounts({
                payer: feePayer.publicKey,
                user: buyer_publicKey,
                profile: buyerProfile,
                systemProgram: SystemProgram.programId,
            })
            .instruction()

        const { blockhash } = await connection.getLatestBlockhash("finalized");
        console.log('blockhash', blockhash);
        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: feePayer.publicKey,
        });
        
        transaction.add(profileInitIx);

        const PRIORITY_RATE = 100; // MICRO_LAMPORTS 
        const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({microLamports: PRIORITY_RATE});

        transaction.add(PRIORITY_FEE_IX);
        transaction.partialSign(feePayer);
        console.log('transaction', transaction);
        const signature = await sendAndConfirmTransaction(connection, transaction, [feePayer], {
            commitment: "confirmed",
            skipPreflight: true,
            maxRetries: 3,
        });
        console.log('Signature from buyer init:', signature);
        return new Response(JSON.stringify({signature: signature }), {
            headers: {
                'content-type': 'application/json',
            },
        });

    } catch (e: any) {
        console.log(e);
        // Catch the `SendTransactionError` and call `getLogs()` on it for full details.
        if (e.logs) {
            console.error("Transaction failed:", e.logs);
        }
        throw e;
    }
};
