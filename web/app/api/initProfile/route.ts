import * as anchor from "@coral-xyz/anchor";
import { IDL, Fragment, PROGRAM_ID} from "@/components/Utils/idl";
import {
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
  } from "@solana/web3.js";
  import * as b58 from "bs58";
  

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

        // VARIABLES
        const buyerProfile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];

        const profileInitIx = await await program.methods
            .initializeProfileAccount()
            .accounts({
                user: buyer_publicKey,
                profile: buyerProfile,
                systemProgram: SystemProgram.programId,
            })
            .instruction();

        const { blockhash } = await connection.getLatestBlockhash("finalized");

        const feeKey = process.env.PRIVATE_KEY!;
        
        // const feePayer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(feeKey)));
        // console.log(feePayer.publicKey.toBase58());

        // generate a new keypair from the private key which is a Base58 string
        const feePayer = Keypair.fromSecretKey(b58.decode(feeKey));
        console.log(feePayer.publicKey.toBase58());

        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: buyer_publicKey,
            // feePayer: feePayer.publicKey,
        });
        
        transaction.add(profileInitIx);
        // transaction.sign(feePayer);
        
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

