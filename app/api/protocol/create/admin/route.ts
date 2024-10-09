import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { ArtsnCore, getArtisanProgramId, USDC_MINT, MANAGER, mplCoreProgram, getArtisanProgram, ArtsnCoreIDL } from '@/components/solana/protocol/artisan-exports';
import {
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
    TransactionMessage,
    VersionedTransaction,
    // sendAndConfirmTransaction,
  } from "@solana/web3.js";
import * as b58 from "bs58";
import { sign } from "crypto";
  

export async function POST( request: Request ) {
    const wallet = Keypair.generate();
    const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_DEV!, 'confirmed');
    // @ts-expect-error - wallet is dummy variable, signing is not needed
    const provider = new AnchorProvider(connection,  wallet, {commitment: "confirmed"});
    const program : Program<ArtsnCore> = new Program(ArtsnCoreIDL as ArtsnCore, provider);
    try {
        const req = await request.json();
        const username = req.username;
        const newAdmin = new PublicKey(req.newAdmin);
        const signer = new PublicKey(req.signer);

        const adminProfile = PublicKey.findProgramAddressSync([Buffer.from("admin"), newAdmin.toBuffer()], program.programId)[0];

        const adminInitIx = await program.methods
            //@ts-ignore expects snake case instead of camel case, but is working fine
            .initializeAdmin(username)
            .accountsPartial({
                owner: signer,
                newAdmin: newAdmin,
                adminProfile: adminProfile,
                systemProgram: SystemProgram.programId,
            })
            .instruction()

        const { blockhash } = await connection.getLatestBlockhash("finalized");
        const messageV0 = new TransactionMessage({
            payerKey: signer,
            recentBlockhash: blockhash,
            instructions: [adminInitIx],
          }).compileToV0Message();
          
        const txn = new VersionedTransaction(messageV0);
        const base64 = Buffer.from(txn.serialize()).toString('base64'); 

        return Response.json(
            {transaction: base64},
            {
                headers: {
                    'content-type': 'application/json',
                },
            }
        );
    } catch (e) {
        console.log(e);
        throw e;
    }
};