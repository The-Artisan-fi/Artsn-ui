import { Connection } from '@solana/web3.js';
export async function confirm(connection: Connection, signature: string): Promise<string> {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block
    })
    return signature
}