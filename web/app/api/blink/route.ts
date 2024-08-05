import { prepareTransaction } from '../../../helpers/transaction-utils';
import * as anchor from "@coral-xyz/anchor";
import { IDL, ArtsnCore, PROGRAM_ID, USDC_MINT } from "@/components/Protocol/idl";
import { mplCoreProgram, manager, mint } from "@/components/Protocol/constants";
import {
    SYSVAR_INSTRUCTIONS_PUBKEY,
    PublicKey,
    SystemProgram,
    Keypair,
    Connection,
    VersionedTransaction,
} from "@solana/web3.js";
import {ActionGetResponse, ActionPostResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, } from "@solana/actions"
  import { 
    ASSOCIATED_TOKEN_PROGRAM_ID, 
    TOKEN_2022_PROGRAM_ID, 
    TOKEN_PROGRAM_ID, 
    getAssociatedTokenAddressSync, 
 } from "@solana/spl-token";
import * as b58 from "bs58";
  const DONATION_DESTINATION_WALLET =
    '7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n';
  const DONATION_AMOUNT_SOL_OPTIONS = [1, 2, 3, 4];
  const ITEMS = [
    "Magentaflare Diamond",
    "Nardin - Freak",
    "Richard Mille",
    "Patek - Nautilus"
    ];
  const DEFAULT_DONATION_AMOUNT_SOL = 1;

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
    const program = new anchor.Program<ArtsnCore>(IDL, provider);

    try {
        // const req = await request.json();
        const req = {
            id: 51129,
            reference: '15202ST.OO.1240ST.01',
            publicKey: '6KuX26FZqzqpsHDLfkXoBXbQRPEDEbstqNiPBKHNJQ9e',
            amount: 1
          }
        const buyer_publicKey = new PublicKey(req.publicKey);
        console.log('buyer_publicKey', buyer_publicKey.toBase58());
        const id = req.id;
        const USDC_DEV = new PublicKey(USDC_MINT);
        // const id = 10817;
        // VARIABLES
        const reference = req.reference;
        const amount = req.amount;
        const watch = PublicKey.findProgramAddressSync([Buffer.from('watch'),  Buffer.from(reference)], program.programId)[0];
        const listing = PublicKey.findProgramAddressSync([Buffer.from('listing'), new anchor.BN(id).toBuffer("le", 8)], program.programId)[0];
        const fraction = Keypair.generate();
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

        // const profileInitIx = await await program.methods
        //     .initializeProfile()
        //     .accounts({
        //         user: buyer_publicKey,
        //         profile: buyerProfile,
        //         systemProgram: SystemProgram.programId,
        //     })
        //     .instruction();
        const feeKey = process.env.PRIVATE_KEY!;
        const feePayer = Keypair.fromSecretKey(b58.decode(feeKey));
        const buyer_profile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];
        const buyShareIx = await program.methods
            //@ts-expect-error - not sure why this is throwing an error
            .buyFractionalizedListing(uri)
            .accountsPartial({
                buyer: buyer_publicKey,
                payer: feePayer.publicKey,
                mint: mint,
                buyerAta: buyerCurrencyAta,
                listingAta: listingCurrencyAta,
                manager,
                buyerProfile: buyer_profile,
                listing,
                object: watch,
                fraction: fraction.publicKey,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID,
                mplCoreProgram: mplCoreProgram,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([feePayer, fraction])
            .instruction();

        const instructions = [buyShareIx];
        const transaction = await prepareTransaction(instructions, feePayer.publicKey);
        transaction.sign([feePayer])
        const base64 = Buffer.from(transaction.serialize()).toString('base64');
        const response: ActionPostResponse = {
            transaction: base64,
        };

        return Response.json(response, {headers: ACTIONS_CORS_HEADERS})

    } catch (e) {
        console.log(e);
        throw e;
    }
};

export async function GET( request: Request ) {
    try {
        console.log('route pinged')
        function getDonateInfo(): Pick<
            ActionGetResponse,
            'icon' | 'title' | 'description'
        > {
            const icon ='https://artisan-solana.s3.eu-central-1.amazonaws.com/ArtisanBlink.png';
            const title = 'Real World Asset Investing - Artsn.Fi';
            const description =
            'Choose from a selection of real world assets to invest in for $1 USDC-Dev.';
            return { icon, title, description };
        }
        
        const { icon, title, description } = getDonateInfo();
        const amountParameterName = 'amount';
        const response: ActionGetResponse = {
            icon,
            label: `Invest in Real World Assets with Artsn.Fi`,
            title,
            description,
            links: {
            actions: [
                ...DONATION_AMOUNT_SOL_OPTIONS.map((amount, index) => ({
                label: `${index +1}) ${ITEMS[amount - 1]}`,
                href: `/api/blink/${amount}`,
                })),
                // {
                // href: `/api/blink/{${amountParameterName}}`,
                // label: 'Buy',
                // parameters: [
                //     {
                //     name: amountParameterName,
                //     label: 'Enter a share amount',
                //     },
                // ],
                // },
            ],
            },
        };

        console.log('response', response);
        const res = Response.json(response, {headers: ACTIONS_CORS_HEADERS})
        console.log('res', res);
        return res
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function OPTIONS( request: Request ) {
    return Response.json({headers: ACTIONS_CORS_HEADERS})
};