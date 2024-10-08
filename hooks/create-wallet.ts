// HOOK TO CREATE WALLET

export async function createWallet(email: string) {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/protocol/create/wallet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email
        }),
    })
    const _res = await res.json();
    const wallet = _res.wallet;
    const publicKey = wallet.publicKey;
    console.log('data is', wallet);

    return publicKey;
}