import { Connection } from '@solana/web3.js';

export const confirm = async (signature: string, connection: Connection): Promise<string> => {
    try {
        const block = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            signature,
            ...block
        })
        return signature
    } catch (error) {
        return error as string
    }
  }
  