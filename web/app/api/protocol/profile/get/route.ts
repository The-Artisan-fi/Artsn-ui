import * as anchor from "@coral-xyz/anchor";
import { IDL, Fragment, PROGRAM_ID} from "@/components/Utils/idl";
import {
    PublicKey,
    Keypair,
    Connection
  } from "@solana/web3.js";
  
export async function POST( request: Request ) {
    console.log('get profile route pinged')
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
        console.log('buyer_publicKey on profile check', buyer_publicKey.toBase58())
        // VARIABLES
        const buyerProfile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];

        // check to see if the profile has already been initialized
        const profileAccount = await connection.getAccountInfo(buyerProfile);

        if(profileAccount !== null){
            return new Response(JSON.stringify({profile: profileAccount }), {
                headers: {
                    'content-type': 'application/json',
                },
            });
        } else {
            return new Response(JSON.stringify({profile: false }), {
                headers: {
                    'content-type': 'application/json',
                },
            });
        }

    } catch (e) {
        console.log(e);
        throw e;
    }
};

