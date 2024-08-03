import * as anchor from "@coral-xyz/anchor";
import { IDL, ArtsnCore, PROGRAM_ID} from "@/components/Protocol/idl";
import {
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
    // sendAndConfirmTransaction,
  } from "@solana/web3.js";
import * as b58 from "bs58";
import { sign } from "crypto";
  

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
        const username = req.username;
        console.log('req.newAdmin', req.newAdmin.toString())

        const newAdmin = new PublicKey(req.newAdmin);
         console.log('newAdmin', newAdmin.toString());
        const signer = new PublicKey(req.signer);
        console.log('signer', signer.toString());
        const adminProfile = PublicKey.findProgramAddressSync([Buffer.from("admin"), newAdmin.toBuffer()], program.programId)[0];
        const profileInitIx = await program.methods
        //@ts-expect-error - missing arguments
            .initializeAdmin(username)
            .accountsPartial({
                owner: signer,
                newAdmin: newAdmin,
                adminProfile,
                systemProgram: SystemProgram.programId,
            })
            .instruction()

        const { blockhash } = await connection.getLatestBlockhash("finalized");
        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: signer,
        });
        
        transaction.add(profileInitIx);
        
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

