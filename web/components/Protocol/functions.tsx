import { clusterApiUrl, Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { IDL, PROGRAM_ID } from "@/components/Utils/idl";

const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
});

const wallet = Keypair.generate();

// @ts-expect-error - wallet is dummy variable, signing is not needed
const provider = new AnchorProvider(connection, wallet, {});
setProvider(provider);
const program = new Program(IDL, PROGRAM_ID);

export async function initProfileTx(key: string) {
  try{
    const response = await fetch('/api/initProfile', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          publicKey: key,
      })
    })

    const txData = await response.json();
    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
    if(!tx){
      console.log('no transaction');
      return;
    }

    return tx;
  }
  catch (error) {
    console.error('Error sending transaction', error);
  }
}

export async function buyTx(id: number, reference: string, key: string) {
  try{
    const response = await fetch('/api/buy', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id: id,
          reference: reference,
          publicKey: key,
      })
    })
    const txData = await response.json();
    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));

    if(!tx){
      console.log('no transaction');
      return;
    }

    return tx;
  } catch (error) {
    console.error('Error sending transaction', error);
  }
}

export async function fetchBuyerProfile(key: PublicKey) {
    try {
      const response = await fetch('/api/getProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: key,
        }),
      });
      const data = await response.json();
      return data.profile;
    } catch (error) {
      console.error('Error sending transaction', error);
    }
}

export async function decodeProfileData(key: PublicKey) {
    try {
        console.log('key', key.toBase58());
        const profile = await fetchBuyerProfile(key);
        console.log('profile returned', profile);
        console.log('profile data', profile);
        const decodedProfile = program.coder.accounts.decode(
            "Profile",
            profile.data
        );
        console.log('profile', decodedProfile);
        return profile;
    } catch (error) {
      console.error('Error decoding data', error);
    }
}