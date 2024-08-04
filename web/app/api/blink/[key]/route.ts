import { prepareTransaction } from '../../../../helpers/transaction-utils';
import * as anchor from "@coral-xyz/anchor";
import { mplCoreProgram, manager, mint } from "@/components/Protocol/constants";
import {
    ActionGetResponse,
    ACTIONS_CORS_HEADERS,
    ActionPostRequest,
    createPostResponse,
    ActionPostResponse,
  } from "@solana/actions";
import { IDL, ArtsnCore, PROGRAM_ID, USDC_MINT} from "@/components/Protocol/idl";
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

  const ITEM_NAMES = [
    "Diamonds",
    "Nardin - Freak",
    "Richard Mille",
    "Patek - Nautilus"
    ];

    const ITEM_URIS = [
        "https://arweave.net/G7r27Nw0A3jH0fdFkuh1xqqSaJvtU4HQoN_R-X6Y-is",
        "https://arweave.net/ErEQ1RmoPwDXZd40wmiw37IWrbHBGu3bL0VODueW6gc",
        "https://arweave.net/39goFY1vD4npxsN8RU4P6YWyVsDU85jYzfdUqYczbgM",
        "https://arweave.net/MNsnBsKulwBQ_zYyX-vJEuajj_KqUY6mXfMOb6naLP0"
    ];

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
    const program = new anchor.Program<ArtsnCore>(IDL, provider);

    try {
        // const req = await request.json();
        const req: ActionPostRequest = await _.json();
        const url = new URL(_.url);
        let account: PublicKey;
        const buyer_publicKey = new PublicKey(req.account);
        const USDC_DEV = new PublicKey(USDC_MINT);
        // const id = 10817;
        // VARIABLES
        const object = params.key;
        const ITEMS = [
            {
                listing: "CBCYqnej9pvGNC5L9S3x5qTSxjf9rUUMRLeJgZfTKWX3",
                watch: "4oMxCX2RRwfhpGiPqAQC4wHpDBxXdmnd2MWtNXHABFY4"
            },
            {
                listing: "Fb4QK96rsraG5Bvqq1JkHEnnbidkq71QoKPB3gNSAmmY",
                watch: "4o2D9bR5Q31H7nVKSd3RUuKSGFKV5PWxvftByriLpPnF"
            },
            {
                listing: "2eZEfQ19cJQxqBt8z5HjHuK221yj5HZ3nJdo771fnU6G",
                watch: "B4h81CidkF9iTxwLrvY36GJQbiDmDtdp6fPjZMA3cnxy"
            },
            {
                listing: "2t8F7ANAgzLAE3UujiEFNn8VAEPNQrnWVqujNKtBsKvT",
                watch: "2B7Yn1eK4S7qs9g4cwYUPR29f5AY9kMNp69L36Wz8cfN"
            }
        ];
        const watch = new PublicKey(ITEMS[object - 1].watch);
        // const listing = PublicKey.findProgramAddressSync([Buffer.from('listing'), watch.toBuffer(), new anchor.BN(id).toBuffer("le", 8)], program.programId)[0];
        const listing = new PublicKey(ITEMS[object - 1].listing);
        const buyerProfile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];      
        const listingCurrencyAta = getAssociatedTokenAddressSync(mint, listing, true)
        const buyerCurrencyAta = getAssociatedTokenAddressSync(mint, buyer_publicKey)

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

        const feeKey = process.env.PRIVATE_KEY!;
        const feePayer = Keypair.fromSecretKey(b58.decode(feeKey));
        const profileInitIx = await await program.methods
            //@ts-expect-error - missing arguments
            .initializeProfile(
                buyer_publicKey.toBase58().slice(-4)
            )
            .accountsPartial({
                user: buyer_publicKey,
                payer: feePayer.publicKey,
                profile: buyerProfile,
                systemProgram: SystemProgram.programId,
            })
            .signers([feePayer])
            .instruction()
            const fraction = Keypair.generate();
            const buyer_profile = PublicKey.findProgramAddressSync([Buffer.from('profile'), buyer_publicKey.toBuffer()], program.programId)[0];
            console.log('uri', ITEM_URIS[object - 1])
            const buyShareIx = await program.methods
                //@ts-expect-error - not sure why this is throwing an error
                .buyFractionalizedListing(ITEM_URIS[object - 1])
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
                .instruction();

        const { blockhash } = await connection.getLatestBlockhash("finalized");

        const total_instructions = [];

        const buyerProfileAccount = await connection.getAccountInfo(buyer_profile);
       
        if(buyerProfileAccount == null) {
            total_instructions.push(profileInitIx);
        }
        // run a for loop to add a set of instructions to the total_instructions array for the amount of shares to buy

        total_instructions.push(buyShareIx);
        const transaction = await prepareTransaction(total_instructions, buyer_publicKey);
        transaction.sign([feePayer, fraction]);
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
            const title = ITEM_NAMES[params.key - 1];
            const description =
            `Buy a share of this ${ITEM_NAMES[params.key - 1]} for 1 USDC-DEV! Explore Real World Assets with Artsn.Fi`;
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