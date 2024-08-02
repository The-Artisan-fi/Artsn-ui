import { clusterApiUrl, Connection, PublicKey, Keypair } from "@solana/web3.js";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { IDL, PROGRAM_ID } from "@/components/Utils/idl";

export const fetchProductDetails = async (accountPubkey: string) => {
    const connection = new Connection(clusterApiUrl("devnet"), {
            commitment: "confirmed",
        });
    // const connection = new Connection("http://localhost:8899", {
    //     commitment: "confirmed",
    // })
    const wallet = Keypair.generate();

    // @ts-expect-error - wallet is dummy variable, signing is not needed
    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);

    const program = new Program(IDL, provider);

    try {
        const account_info = await connection.getAccountInfo(new PublicKey(accountPubkey))
        const listing = program.coder.accounts.decode("Listing", account_info!.data);
        
        const watch_account_info = await connection.getAccountInfo(new PublicKey(listing.watch));
        const watch = program.coder.accounts.decode("Watch", watch_account_info!.data);

        const listingInfo = {
            id: listing.id.toNumber(),
            share: listing.share,
            shareSold: listing.shareSold,
            startingPrice: listing.price.toNumber(),
            watchKey: listing.watch.toBase58(),
            reference: listing.reference,

            // braceletMaterial: "Steel"
            // brand: "Audemars Piguet"
            // caseMaterial: "Steel"
            // dialColor: "Blue"
            // diamater: 39
            // model: "Royal Oak Jumbo"
            // movement: "Automatic"
            // reference: "15202ST.OO.1240ST.01"
            // yearOfProduction: 2020
            braceletMaterial: watch.braceletMaterial,
            brand: watch.brand,
            caseMaterial: watch.caseMaterial,
            dialColor: watch.dialColor,
            diamater: watch.diamater,
            model: watch.model,
            movement: watch.movement,
            yearOfProduction: watch.yearOfProduction,
        };
        return listingInfo;
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
};