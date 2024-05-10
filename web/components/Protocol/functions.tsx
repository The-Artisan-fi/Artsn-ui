import { clusterApiUrl, Connection, PublicKey, Keypair, Transaction, GetProgramAccountsFilter } from "@solana/web3.js";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { IDL, PROGRAM_ID } from "@/components/Utils/idl";
import { TOKEN_2022_PROGRAM_ID,getTokenMetadata } from "@solana/spl-token";

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

export async function buyTx(id: number, reference: string, key: string, amount: number) {
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
          amount: amount
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

export async function getTokenAccounts(key: PublicKey) {
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
      TOKEN_2022_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      {filters: filters}
  );
  console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`);
  const tokenMetadata = async (mintAddress: string) => {
    const metadata = await getTokenMetadata(
      connection,
      new PublicKey(mintAddress),
      'confirmed'
    );
    // console.log(`Metadata for token ${mintAddress}:`, metadata);

    return metadata;
  } 
  //   accounts.forEach((account, i) => {
  //   //Parse the account data
  //   const parsedAccountInfo:any = account.account.data;
  //   const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
  //   const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
  //   //Log results
  //   // console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
  //   // console.log(`--Token Mint: ${mintAddress}`);
  //   // console.log(`--Token Balance: ${tokenBalance}`);

  //   const metadata = tokenMetadata(mintAddress);

  //   return {
  //     account: account.pubkey,
  //     mint: mintAddress,
  //     balance: tokenBalance,
  //     metadata: metadata
  //   };
  // });

  async function details(accountList: any[]) {
    const accountDetail = [];
    for(let i = 0; i < accountList.length; i++){
      const parsedAccountInfo:any = accountList[i].account.data;
      const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
      const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
      const metadata = await tokenMetadata(mintAddress);
      console.log(`Token Account No. ${i + 1}: ${accounts[i].pubkey.toString()}`);
      console.log(`--Token Mint: ${mintAddress}`);
      console.log(`--Token Balance: ${tokenBalance}`);
      console.log(`--Metadata: ${metadata}`);

      accountDetail.push({
        account: accounts[i].pubkey,
        mint: mintAddress,
        balance: tokenBalance,
        metadata: metadata
      });
    }

    return accountDetail;
  }

  const accountDetails = await details(
    accounts.map((account) => account)
  );

  console.log('details', accountDetails);
  return ;
}