import { toast } from 'react-toastify';
import { Connection } from "@solana/web3.js";
import Link from 'next/link';

export const toastError = (message: string) => {
    toast.error(
        <p style={{color: 'black'}}>
            {message}
        </p>
    );
};

export const toastSuccess = (message: string) => {
    console.log('toastSuccess', message)
    toast.success(message);
};

export async function toastPromise(signature: string) {
    const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
        "confirmed"
    );
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    await toast.promise(
        connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature: signature
        }),
        {
            pending: 'Transaction pending...',
            success: {
                render(){
                    return (
                        <div>
                            <Link 
                                style={{color: 'black'}}
                                target='_blank'  
                                href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                            > 
                                Transaction Confirmed 
                            </Link>
                        </div>
                    )
                }
            },
            error: 'Error sending transaction'
        }
    )

    return true;
}