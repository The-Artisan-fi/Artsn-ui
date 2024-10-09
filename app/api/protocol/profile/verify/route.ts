import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { ArtsnCore, ArtsnCoreIDL } from '@/components/solana/protocol/artisan-exports';
import {
    PublicKey,
    SystemProgram,
    Keypair,
    Connection,
  } from "@solana/web3.js";
import * as b58 from "bs58";

export async function POST( request: Request ) {
    const wallet = Keypair.generate();
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    // @ts-expect-error - wallet is dummy variable, signing is not needed
    const provider = new AnchorProvider(connection,  wallet, {commitment: "confirmed"});
    const program : Program<ArtsnCore> = new Program(ArtsnCoreIDL as ArtsnCore, provider);

    try {
        const req = await request.json();
        const buyer_publicKey = new PublicKey(req.publicKey);
        // VARIABLES
        const feeKey = process.env.PRIVATE_KEY!;
        const feePayer = Keypair.fromSecretKey(b58.decode(feeKey));
        const profileVerifySignature = await program.methods
            //@ts-ignore expects snake case instead of camel case, but is working fine
            .verifyProfile()
            .accountsPartial({
                user: buyer_publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([feePayer])
            .rpc();

        console.log('Signature from buyer init:', profileVerifySignature);
        return new Response(JSON.stringify({signature: profileVerifySignature }), {
            headers: {
                'content-type': 'application/json',
            },
        });

    } catch (e) {
        console.log(e);
        throw e;
    }
};

