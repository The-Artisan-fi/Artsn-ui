import {
    PublicKey,
    SystemProgram,
    Keypair,
    TransactionMessage,
    VersionedTransaction,
    Connection
} from "@solana/web3.js";
import * as b58 from 'bs58';
import * as anchor from "@coral-xyz/anchor";
import { getArtisanProgram } from "@/components/solana/protocol/artisan-exports";

interface ProfileCreationRequest {
    publicKey: string;
    username: string;
    profileType: 'Creator' | 'Artisan';
    isPublic: boolean;
}

export async function POST(request: Request) {
    console.log('Profile create route pinged');
    
    const connection = new Connection(
        process.env.HELIUS_DEVNET || 'https://api.devnet.solana.com',
        "confirmed"
    );

    const provider = new anchor.AnchorProvider(
        connection,
        Keypair.generate() as any, // Dummy wallet, signing not needed
        {}
    );
    const program = getArtisanProgram(provider);

    try {
        const req: ProfileCreationRequest = await request.json();
        const { publicKey, username, profileType, isPublic } = req;

        console.log('Request details:', { publicKey, username, profileType, isPublic });

        const userPublicKey = new PublicKey(publicKey);

        const profileArgs = {
            username,
            profileType: profileType === 'Creator' ? 1 : 0,
            public: isPublic
        };

        const [userProfile] = PublicKey.findProgramAddressSync(
            [Buffer.from('profile'), userPublicKey.toBuffer()],
            program.programId
        );

        const feePayer = getFeePayer();

        const profileInitIx = await createProfileInitInstruction(
            program,
            profileArgs,
            userPublicKey,
            feePayer.publicKey,
            userProfile
        );

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized");
        
        const messageV0 = new TransactionMessage({
            payerKey: feePayer.publicKey,
            recentBlockhash: blockhash,
            instructions: [profileInitIx],
        }).compileToV0Message();
        
        const txn = new VersionedTransaction(messageV0);
        txn.sign([feePayer]);

        const transactionSignature = await connection.sendTransaction(txn);
        
        await connection.confirmTransaction(
            { blockhash, lastValidBlockHeight, signature: transactionSignature },
            "confirmed"
        );

        return new Response(
            JSON.stringify({ signature: transactionSignature }),
            { headers: { 'content-type': 'application/json' } }
        );
    } catch (error: any) {
        console.error("Transaction failed:", error.logs || error);
        return new Response(
            JSON.stringify({ error: 'Profile creation failed', details: error.message }),
            { status: 500, headers: { 'content-type': 'application/json' } }
        );
    }
}

function getFeePayer(): Keypair {
    const feeKey = process.env.PRIVATE_KEY!;
    return Keypair.fromSecretKey(b58.decode(feeKey));
}

async function createProfileInitInstruction(
    program: any,
    profileArgs: any,
    userPublicKey: PublicKey,
    payerPublicKey: PublicKey,
    userProfile: PublicKey
) {
    return program.methods
        .initializeProfile(profileArgs)
        .accountsPartial({
            user: userPublicKey,
            payer: payerPublicKey,
            profile: userProfile,
            systemProgram: SystemProgram.programId,
        })
        .instruction();
}