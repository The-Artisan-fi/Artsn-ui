import * as anchor from "@coral-xyz/anchor";
import { IDL, Fragment, PROGRAM_ID, LISTING_GROUP} from "@/components/Utils/idl";
import {
    SYSVAR_INSTRUCTIONS_PUBKEY,
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
    VersionedTransaction,
    LAMPORTS_PER_SOL,
    Ed25519Program
} from "@solana/web3.js";
  import { 
    ASSOCIATED_TOKEN_PROGRAM_ID, 
    TOKEN_2022_PROGRAM_ID, 
    TOKEN_PROGRAM_ID, 
    getAssociatedTokenAddressSync, 
 } from "@solana/spl-token";
import * as b58 from "bs58";

// URL: /api/protocol/buy/stripe/[key]
// Endpoint: POST /api/protocol/buy/stripe/[key]
// Description: Buy a share of a listing
// Headers: { 'Content-Type': 'application/json' }
// Example :
//  curl -H 'Content-Type: application/json' \
//     -H 'Authorization : Basic stripe:password' \
//   -d '{"publicKey": "123", "secretKey": "123", "listingId": 123, "reference":"123", amount: 1}' \
//   -X POST \
//   http://localhost:3000/api/stripe/123

export async function POST(_: Request, { params }: { params: { key : number } }) {
    console.log('post pinged')
    const auth_header = _.headers.get('Authorization');
    const encodedCreds = auth_header!.split(' ')[1]
    const plainCreds = encodedCreds.toString().split(':')
    const username = plainCreds[0]
    const password = plainCreds[1]

    if (username !== process.env.STRIPE_WEBHOOK_USERNAME || password !== process.env.STRIPE_WEBHOOK_PASSWORD) {
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Access to the API"',
            },
        });
    }


    const ed25519Ix = Ed25519Program.createInstructionWithPrivateKey({
        privateKey: params.secretKey,
        message: params.publicKey,
      });

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
        // VARIABLES
        const reference = params.reference;
        const amount = params.amount;
        const buyer_publicKey = new PublicKey(params.publicKey);
        const id = params.listingId;

        const USDC_DEV = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");

        const watch = PublicKey.findProgramAddressSync([Buffer.from('watch'),  Buffer.from(reference)], program.programId)[0];
        const listing = PublicKey.findProgramAddressSync([Buffer.from('listing'), watch.toBuffer(), new anchor.BN(id).toBuffer("le", 8)], program.programId)[0];
        const fraction = PublicKey.findProgramAddressSync([Buffer.from('fraction'), listing.toBuffer()], program.programId)[0];        
        const auth = PublicKey.findProgramAddressSync([Buffer.from('auth')], program.programId)[0];
      
        const buyerProfile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];
        const buyerFractionAta = getAssociatedTokenAddressSync(fraction, buyer_publicKey, false, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID)
      
        const listingCurrencyAta = getAssociatedTokenAddressSync(USDC_DEV, listing, true)
        const buyerCurrencyAta = getAssociatedTokenAddressSync(USDC_DEV, buyer_publicKey)

        const profileInitIx = await await program.methods
            .initializeProfileAccount()
            .accounts({
                user: buyer_publicKey,
                profile: buyerProfile,
                systemProgram: SystemProgram.programId,
            })
            .instruction();

        const feeKey = process.env.PRIVATE_KEY!;
        const feePayer = Keypair.fromSecretKey(b58.decode(feeKey));

        const buyShareIx = await program.methods
            .buyListing()
            .accounts({
                payer: feePayer.publicKey,
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
                instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
            })
            .instruction();

        const { blockhash } = await connection.getLatestBlockhash("finalized");
        console.log('blockhash', blockhash);

        const total_instructions = [];

        const buyerProfileAccount = await connection.getAccountInfo(buyerProfile);
        const lamports = buyerProfileAccount?.lamports;
        if( lamports == 0) {
            total_instructions.push(profileInitIx);
        }
        // run a for loop to add a set of instructions to the total_instructions array for the amount of shares to buy
        for(let i = 0; i < amount ; i++) {
            total_instructions.push(buyShareIx);
        }

        // const transaction = await prepareTransaction(total_instructions, buyer_publicKey);
        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: feePayer.publicKey,
        });
        transaction.partialSign(feePayer)
        const base64 = Buffer.from(transaction.serialize()).toString('base64');
        console.log('base64', base64);
        const response: { transaction: string } = {
            transaction: base64,
        };

        console.log('response', response);
        return new Response(
            JSON.stringify(
                response,
            ), {
                status: 200,
                headers: {
                    'access-control-allow-origin': '*',
                    'content-type': 'application/json; charset=UTF-8'
                }
            }
        );

    } catch (e) {
        console.log(e);
        throw e;
    }
};


export async function GET(_: Request, { params }: { params: { key : number } }) {
    // route to get the listing
    // /api/protocol/buy/stripe/[key]
    // example curl
    // curl -H 'Content-Type: application/json' \
    //     -H 'Authorization : Basic
    //     stripe:password' \
    //     -d '{"publicKey": "123", "secretKey": "123", "listingId": 123, "reference":"123", amount: 1}' \
    //     -X POST \
    //     http://localhost:3000/api/stripe/123/
    
    try {
        console.log('get route pinged', params)
        console.log('key', params.key)
        const res = new Response(
            JSON.stringify(params), {
                status: 200,
                headers: {
                    'access-control-allow-origin': '*',
                    'content-type': 'application/json; charset=UTF-8'
                }
            }
        );
        console.log('res', res);
        return res
    } catch (e) {
        console.log(e);
        throw e;
    }
}

// export async function OPTIONS(_: Request) {
//     return new Response(null, {
//         headers: {
//             'access-control-allow-origin': '*',
//             'access-control-allow-methods': 'POST , GET',
//             'access-control-allow-headers': 'Content-Type',
//         },
//     });
// };