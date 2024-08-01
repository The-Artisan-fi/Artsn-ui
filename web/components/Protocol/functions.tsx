import { clusterApiUrl, Connection, PublicKey, Keypair, Transaction, GetProgramAccountsFilter, ParsedAccountData, VersionedMessage, VersionedTransaction, SimulateTransactionConfig } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountIdempotentInstruction, createInitializeMint2Instruction, createMintToInstruction, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getTokenMetadata } from "@solana/spl-token";
import { ParsedProgramAccounts} from "@/helpers/types";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi'
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";


const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
});
// const connection = new Connection("http://localhost:8899", {
//   commitment: "confirmed",
// })
const wallet = Keypair.generate();

const mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // circle DEVNET - USDC

export async function getMintATA(wallet: PublicKey) {
  try{
    const mintAta = getAssociatedTokenAddressSync(mint, wallet);
    return mintAta;
  } catch (error) {
    console.error('Error getting mint ATA', error);
  }
}

export async function initProfileTx(key: string) {
  try{
    const response = await fetch('/api/protocol/profile/init', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          publicKey: key,
      })
    })

    const txData = await response.json();
    const signature = txData.signature;
    if(!signature){
      console.log('no transaction');
      return;
    }

    return signature
  }
  catch (error) {
    console.error('Error sending transaction', error);
  }
}

export async function buyTx(id: number, reference: string, key: string, amount: number, uri: string) {
  try{
    const response = await fetch('/api/protocol/buy', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id: id,
          reference: reference,
          publicKey: key,
          amount: amount,
          uri: uri,
      })
    })
    const { transaction } = await response.json(); //VersionedTransaction
    const tx = VersionedTransaction.deserialize(Buffer.from(transaction, "base64"));
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
      const response = await fetch('/api/protocol/profile/get', {
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
        const profile = await fetchBuyerProfile(key);
        // const decodedProfile = program.coder.accounts.decode(
        //     "Profile",
        //     profile.data
        // );
        // return decodedProfile;
    } catch (error) {
      console.error('Error decoding data', error);
    }
}

export async function getTokenAccounts(key: PublicKey) {
  if(!key){
    return;
  }
  console.log('key', key.toBase58());
  const filters:GetProgramAccountsFilter[] = [
    {
      dataSize: 175,    //size of account (bytes)
    },
    {
      memcmp: {
        offset: 32,     //location of our query in the account (bytes)
        bytes: key.toBase58(),  //our search criteria, a base58 encoded string
      },            
    }
  ];
  const accounts = await connection.getParsedProgramAccounts(
      TOKEN_2022_PROGRAM_ID,
      {filters: filters}
  );
  console.log(`Found ${accounts.length} token account(s) for wallet ${wallet.publicKey.toBase58()}.`);
  const tokenMetadata = async (mintAddress: string) => {
    const metadata = await getTokenMetadata(
      connection,
      new PublicKey(mintAddress),
      'confirmed'
    );
    return metadata;
  } 

  

  async function details(accountList: ParsedProgramAccounts[]) {
    const accountDetail = [];
    for(let i = 0; i < accountList.length; i++){
      const parsedAccountInfo = accountList[i].account.data as ParsedAccountData;
      const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
      const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
      const metadata = await tokenMetadata(mintAddress);
      
      accountDetail.push({
        account: accounts[i].pubkey.toBase58(),
        mint: mintAddress,
        balance: tokenBalance,
        metadata: metadata,
        key: i + 1,
        no: i + 1,
        item: `Item ${i + 1}`,
        title: metadata?.name?.substring(0, 25) + '...' ?? '',
        // value: 100 * tokenBalance, format to USD ex. 1,000,000
        value: (tokenBalance * 100).toLocaleString(),
        amount: tokenBalance,
      });
    }

    return accountDetail;
  }

  const accountDetails = await details(
    accounts.map((account) => account)
  );

  const filteredAccounts = accountDetails.filter((account) => account.metadata?.symbol == "ARTSN");

  return filteredAccounts;
}

export async function initAdminTx(newAdmin: string, username: string, signer: string) {
  try{
    const response = await fetch('/api/protocol/create/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newAdmin: newAdmin,
        username: username,
        signer: signer
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

export async function initTokenTx(id: number, reference: string, share: number, price: number, starting_time: number, uri: string, signer: string) {
  try{
    const response = await fetch('/api/protocol/create/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        reference: "1520", //reference,
        share: share,
        price: price,
        starting_time: starting_time,
        uri: uri,
        signer: signer
      })
    })

    const txData = await response.json();
    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
    if(!tx){
      console.log('no transaction');
      return;
    }

    return {
      tx: tx,
      associatedId: txData.associatedId
    }
  }
  catch (error) {
    console.error('Error sending transaction', error);
  }
}
export async function buyStripeTx(id: number, reference: string, key: string, amount: number) {
  try {
    const response = await fetch('/api/protocol/buy-stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        reference: reference,
        publicKey: key,
        amount: amount,
        sessionId: sessionStorage.getItem('sessionId')
      })
    })
    const txData = await response.json();
    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));

    if (!tx) {
      console.log('no transaction');
      return;
    }

    return tx;
  } catch (error) {
    console.error('Error sending transaction', error);
  }
}
