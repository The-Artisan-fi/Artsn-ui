import * as anchor from "@coral-xyz/anchor";
import { IDL, Fragment, PROGRAM_ID} from "@/components/Utils/idl";
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
    const program = new anchor.Program<Fragment>(IDL, programId, provider);
    try {
        const req = await request.json();
        const username = req.username;
        const newAdmin = new PublicKey(req.newAdmin);
        const signer = new PublicKey(req.signer);

        const signerState = PublicKey.findProgramAddressSync([Buffer.from('admin_state'), signer.toBuffer()], program.programId)[0];
        const newAdminState = PublicKey.findProgramAddressSync([Buffer.from('admin_state'), newAdmin.toBuffer()], program.programId)[0];

        const profileInitIx = await program.methods
            .initializeAdminAccount(username)
            .accounts({
                admin: signer,
                adminState: null,
                newAdmin: newAdmin,
                newAdminState: newAdminState,
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

