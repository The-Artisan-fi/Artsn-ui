import * as anchor from "@coral-xyz/anchor";
import { IDL, ArtsnCore, PROGRAM_ID} from "@/components/Protocol/idl";
import {
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
    sendAndConfirmTransaction,
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
    const program = new anchor.Program<ArtsnCore>(IDL, provider);
    
    try {
        const req = await request.json();
        const buyer_publicKey = new PublicKey(req.publicKey);
        console.log('buyer_publicKey', buyer_publicKey.toBase58());
        // VARIABLES
        const buyerProfile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];
        const feeKey = process.env.PRIVATE_KEY!;
        const feePayer = Keypair.fromSecretKey(b58.decode(feeKey));
        const profileVerifyIx = await program.methods
        //@ts-expect-error - missing arguments
            .verifyProfile()
            .accounts({
                user: buyer_publicKey,
                profile: buyerProfile,
                admin: feePayer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .instruction()

        const { blockhash } = await connection.getLatestBlockhash("finalized");
        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: feePayer.publicKey,
        });
        
        transaction.add(profileVerifyIx);
        transaction.partialSign(feePayer);
        
        const signature = await sendAndConfirmTransaction(connection, transaction, [feePayer]);
        console.log('Signature from buyer init:', signature);
        return new Response(JSON.stringify({signature: signature }), {
            headers: {
                'content-type': 'application/json',
            },
        });

    } catch (e) {
        console.log(e);
        throw e;
    }
};
