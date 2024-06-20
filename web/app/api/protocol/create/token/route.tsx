import * as anchor from "@coral-xyz/anchor";
import { IDL, Fragment, PROGRAM_ID, LISTING_GROUP, WATCH_GROUP} from "@/components/Utils/idl";
import {
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
    ComputeBudgetProgram
    // sendAndConfirmTransaction,
  } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

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
    const program = new anchor.Program<Fragment>(IDL, programId, provider);
    try {
        const req = await request.json();
        const id = req.id;
        const reference = req.reference;
        const share = req.share;
        const price = req.price;
        const starting_time = req.starting_time;
        const uri = req.uri;
        const signer = new PublicKey(req.signer);
        const modifyComputeUnitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 });

        console.log('id:', id)
        console.log('reference:', reference)
        console.log('share:', share)
        console.log('price:', price)
        console.log('starting_time:', starting_time)
        console.log('uri:', uri)
        console.log('signer:', signer.toBase58())


        const watch = PublicKey.findProgramAddressSync([Buffer.from('watch'), Buffer.from(reference)], program.programId)[0];
        const listing = PublicKey.findProgramAddressSync([Buffer.from('listing'), watch.toBuffer(), new anchor.BN(id).toBuffer("le", 8)], program.programId)[0];
        const fraction = PublicKey.findProgramAddressSync([Buffer.from('fraction'), listing.toBuffer()], program.programId)[0];
        
        const auth = PublicKey.findProgramAddressSync([Buffer.from('auth')], program.programId)[0];
        const signerState = PublicKey.findProgramAddressSync([Buffer.from('admin_state'), signer.toBuffer()], program.programId)[0];
        const adminKey = new PublicKey("2uqpz6ZbWQKrYAjNRtU933VRa9TzRVoREEsaH9wDkzKs");
        const adminState = PublicKey.findProgramAddressSync([Buffer.from('admin_state'), adminKey.toBuffer()], program.programId)[0];
        const profileInitIx = await program.methods
            .createListing(
                new PublicKey(LISTING_GROUP),
                new anchor.BN(id),
                share,
                new anchor.BN(price),
                new anchor.BN(starting_time),
                uri,
            )
            .accounts({
                admin: adminKey,
                adminState: adminState,   
                watch,
                listing,
                fraction,
                auth,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                token2022Program: TOKEN_2022_PROGRAM_ID,
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

        return new Response(JSON.stringify({transaction: base64, associatedId: listing.toBase58() }), {
            headers: {
                'content-type': 'application/json',
            },
        });

    } catch (e) {
        console.log(e);
        throw e;
    }
};