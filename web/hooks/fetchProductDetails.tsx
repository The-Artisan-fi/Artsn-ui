import { clusterApiUrl, Connection, PublicKey, Keypair } from "@solana/web3.js";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { IDL, PROGRAM_ID } from "@/components/Utils/idl";

export const fetchProductDetails = async (accountPubkey: string) => {
    const connection = new Connection(clusterApiUrl("devnet"), {
            commitment: "confirmed",
        });

    const wallet = Keypair.generate();

    // @ts-expect-error - wallet is dummy variable, signing is not needed
    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);

    const program = new Program(IDL, PROGRAM_ID);

    try {
        const account_info = await connection.getAccountInfo(new PublicKey(accountPubkey))
        const product_details = program.coder.accounts.decode("Listing", account_info!.data);

        const product = {
            id: product_details.id,
            mint: product_details.mint,
            name: product_details.name,
            image: product_details.img,
            fractionsLeft: `${product_details.shareSold} / ${product_details.share}`,
            startingPrice: `${product_details.price} USD`,
            earningPotential: "TBD",
        };
        

        return product;
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
};
