import { prepareTransaction } from '../../../../helpers/transaction-utils';
import * as anchor from "@coral-xyz/anchor";
import {
    ActionGetResponse,
    ACTIONS_CORS_HEADERS,
    ActionPostRequest,
    createPostResponse,
    ActionPostResponse,
  } from "@solana/actions";
import { IDL, Fragment, PROGRAM_ID, USDC_MINT} from "@/components/Utils/idl";
import {
    SYSVAR_INSTRUCTIONS_PUBKEY,
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
    VersionedTransaction,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
    ActionsSpecGetResponse,
    ActionsSpecPostRequestBody,
    ActionsSpecPostResponse,
} from '../../../../helpers/spec/actions-spec';
  import { 
    ASSOCIATED_TOKEN_PROGRAM_ID, 
    TOKEN_2022_PROGRAM_ID, 
    TOKEN_PROGRAM_ID, 
    getAssociatedTokenAddressSync, 
 } from "@solana/spl-token";
import * as b58 from "bs58";
  const DONATION_DESTINATION_WALLET =
    '7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n';
  const DONATION_AMOUNT_SOL_OPTIONS = [1, 5, 10];
  const DEFAULT_DONATION_AMOUNT_SOL = 1;

export async function POST(_: Request, { params }: { params: { key : number } }) {
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
        // const req = await request.json();
        const req: ActionPostRequest = await _.json();
        const url = new URL(_.url);
        let account: PublicKey;
        const ref = {
            id: 51129,
            reference: '15202ST.OO.1240ST.01',
            publicKey: '6KuX26FZqzqpsHDLfkXoBXbQRPEDEbstqNiPBKHNJQ9e',
            amount: 1
          }
        const buyer_publicKey = new PublicKey(req.account);
        console.log('buyer_publicKey', buyer_publicKey.toBase58());
        const id = ref.id;
        const USDC_DEV = new PublicKey(USDC_MINT);
        // const id = 10817;
        // VARIABLES
        const reference = ref.reference;
        const amount = params.key;
        const watch = PublicKey.findProgramAddressSync([Buffer.from('watch'),  Buffer.from(reference)], program.programId)[0];
        // const listing = PublicKey.findProgramAddressSync([Buffer.from('listing'), watch.toBuffer(), new anchor.BN(id).toBuffer("le", 8)], program.programId)[0];
        const listing = new PublicKey("AMygBqv7URhE1L6DjzzqYdX9Rujp3L4vXU5NJcXW8wA6");
        const fraction = PublicKey.findProgramAddressSync([Buffer.from('fraction'), listing.toBuffer()], program.programId)[0];
        // const metadata = PublicKey.findProgramAddressSync([Buffer.from('metadata'), fraction.toBuffer()], program.programId)[0];
        
        const auth = PublicKey.findProgramAddressSync([Buffer.from('auth')], program.programId)[0];
        // const adminState = PublicKey.findProgramAddressSync([Buffer.from('admin_state'), buyer_publicKey.toBuffer()], program.programId)[0];
      
        const buyerProfile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];
        const buyerFractionAta = getAssociatedTokenAddressSync(fraction, buyer_publicKey, false, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID)
      
        const listingCurrencyAta = getAssociatedTokenAddressSync(USDC_DEV, listing, true)
        const buyerCurrencyAta = getAssociatedTokenAddressSync(USDC_DEV, buyer_publicKey)

        async function prepareDonateTransaction(
            sender: PublicKey,
            recipient: PublicKey,
            lamports: number,
          ): Promise<VersionedTransaction> {
            const payer = new PublicKey(sender);
            const instructions = [
              SystemProgram.transfer({
                fromPubkey: payer,
                toPubkey: new PublicKey(recipient),
                lamports: lamports,
              }),
            ];
            return prepareTransaction(instructions, payer);
          }

        // const createAtaIx = createAssociatedTokenAccountIdempotentInstruction(
        //     buyer_publicKey,
        //     buyerFractionAta,
        //     buyer_publicKey,
        //     fraction,
        //     TOKEN_2022_PROGRAM_ID,
        //     ASSOCIATED_TOKEN_PROGRAM_ID,
        // );

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
                // buyer: buyer_publicKey,
                // payer: feePayer.publicKey,
                // buyerProfile,
                // buyerCurrencyAta,
                // buyerFractionAta,
                // listing,
                // listingCurrencyAta,
                // fraction,
                // currency: USDC_DEV,
                // auth,
                // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                // tokenProgram: TOKEN_PROGRAM_ID,
                // token2022Program: TOKEN_2022_PROGRAM_ID,
                // systemProgram: SystemProgram.programId,
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

        // const transaction = new Transaction({
        //     recentBlockhash: blockhash,
        //     feePayer: feePayer.publicKey,
        // });

        // for(let i = 0; i < amount ; i++) {
        //     console.log('buying share', i);
        //     transaction.add(buyShareIx);
        // }
        

        // const serializedTransaction = transaction.serialize({
        //     requireAllSignatures: false,
        //   });
        // const base64 = serializedTransaction.toString("base64");


        // check buyerProfile account for lamports, if none, add the prfileInitIx instruction

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
        
        const instructions = total_instructions;
        const transaction = await prepareTransaction(total_instructions, buyer_publicKey);
        transaction.sign([feePayer])
        const base64 = Buffer.from(transaction.serialize()).toString('base64');
        console.log('base64', base64);
        const response: ActionsSpecPostResponse = {
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
    try {
        console.log('route pinged')
        function getDonateInfo(): Pick<
            ActionsSpecGetResponse,
            'icon' | 'title' | 'description'
        > {
            const icon =
            'https://artsn.fi/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAudemars-piguet-Royaloak.b2100923.webp&w=1080&q=75';
            const title = 'Audemar Piguet Royal Oak';
            const description =
            'Buy a share of this Audemar Piguet Royal Oak watch for 1 USDC-DEV. You will receive a fraction of the watch in return.';
            return { icon, title, description };
        }
        
        const { icon, title, description } = getDonateInfo();
        const amountParameterName = 'amount';
        const response: ActionsSpecGetResponse = {
            icon,
            label: `${params.key} SOL`,
            title,
            description,
          };

        console.log('response', response);
        const res = new Response(
            JSON.stringify(response), {
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

export async function OPTIONS(_: Request) {
    return new Response(null, {
        headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET, POST, OPTIONS',
            'access-control-allow-headers': 'Content-Type',
        },
    });
};