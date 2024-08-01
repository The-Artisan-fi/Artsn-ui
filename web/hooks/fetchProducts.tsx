import { clusterApiUrl, Connection, PublicKey, Keypair, DataSizeFilter, GetProgramAccountsConfig } from "@solana/web3.js";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { IDL, PROGRAM_ID, LISTING_GROUP, WATCH_GROUP } from "@/components/Protocol/idl";
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

// Create Umi Instance
const umi = createUmi('https://api.devnet.solana.com');

export const fetchProducts = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), {
            commitment: "confirmed",
        });
    
    const wallet = Keypair.generate();

    // @ts-expect-error - wallet is dummy variable, signing is not needed
    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);

    const program = new Program(IDL, provider);

    const formatDateToDddMmm = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const minute = date.getMinutes();
    
        const paddedDay = day.toString().padStart(2, '0');
        const paddedMinute = minute.toString().padStart(2, '0');
        
        return `${paddedDay}::${paddedMinute}`;
    };

    try {
        const size_filter: DataSizeFilter = {
            dataSize: 70,
        };
        const get_accounts_config: GetProgramAccountsConfig = {
            commitment: "confirmed",
            // filters: [{
            //     memcmp: {
            //         offset: 16,
            //         bytes: LISTING_GROUP,
            //     }
            // }]
            filters: [size_filter]
        };
        const all_program_accounts = await connection.getProgramAccounts(new PublicKey(PROGRAM_ID),
            get_accounts_config
        );
        const productList = all_program_accounts.map((account) => {
            try {
                const decode = program.coder.accounts.decode("fractionalizedListing", account.account.data);
                if(!decode) return;
                return {
                    accountPubkey: account.pubkey.toBase58(),
                    ...decode
                };
            } catch (error) {
                console.log('error decoding account', account, error)
            }
        });
        const currentTime = Math.floor(Date.now() / 1000);
        const availableProducts = productList.filter(product => product.startingTime < currentTime);
        const comingSoonProducts = productList.filter(product => product.startingTime >= currentTime);

        const detailedAvailableProducts = [];

        for( let i = 0; i < availableProducts.length; i++){
            const nft = availableProducts[i];
            const watch = await fetchCollectionV1(umi, availableProducts[i].object);

            detailedAvailableProducts.push({
                ...nft,
                watch: watch.attributes!.attributeList
            })
        };

        const detailedComingSoonProducts = [];

        for( let i = 0; i < comingSoonProducts.length; i++){
            const nft = comingSoonProducts[i];
            const watch = await fetchCollectionV1(umi, comingSoonProducts[i].object);

            detailedComingSoonProducts.push({
                ...nft,
                watch: watch.attributes!.attributeList
            })
        };

        // console.log('detailedAvailableProducts', detailedAvailableProducts)

        const products = {
            available: detailedAvailableProducts.map(product => ({
                id: product.id,
                accountPubkey: product.accountPubkey,
                name: `${product.watch[0].value} ${product.watch[1].value}`,
                image: `https://artisan-solana.s3.eu-central-1.amazonaws.com/${product.accountPubkey}-0.jpg`,
                // fractions left should display the remaining shares available / total shares
                fractionsLeft: `${product.share - product.shareSold} / ${product.share}`,
                startingPrice: `${product.price} USD`,
                earningPotential: "TBD",
                watch: product.object.toBase58(),
                reference: product.reference,
            })),
            comingSoon: detailedComingSoonProducts.map(product => ({
                id: product.id,
                accountPubkey: product.accountPubkey,
                name: `${product.watch[0].value} ${product.watch[1].value}`,
                image: `https://artisan-solana.s3.eu-central-1.amazonaws.com/${product.accountPubkey}-0.jpg`,
                releaseDate: formatDateToDddMmm(product.startingTime),
                startingPrice: `${product.price} USD`,
                earningPotential: "TBD",
                watch: product.object.toBase58(),
                reference: product.reference,
            })),
        };

        return products;
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
};

export const fetchWatches = async () => {
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

    const formatDateToDddMmm = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const minute = date.getMinutes();

        const paddedDay = day.toString().padStart(2, '0');
        const paddedMinute = minute.toString().padStart(2, '0');
        
        return `${paddedDay}::${paddedMinute}`;
    };

    try {
        const size_filter: DataSizeFilter = {
            dataSize: 92,
        };
        const get_accounts_config: GetProgramAccountsConfig = {
            commitment: "confirmed",
            filters: [{
                memcmp: {
                    offset: 8,
                    bytes: WATCH_GROUP,
                }
            }]
            // filters: [size_filter]
        };
        const all_program_accounts = await connection.getProgramAccounts(new PublicKey(PROGRAM_ID),
            get_accounts_config
        );

        const watchList = all_program_accounts.map((account) => {
            try {
                const decode = program.coder.accounts.decode("Watch", account.account.data);
                if(!decode) return;
                return {
                    accountPubkey: account.pubkey.toBase58(),
                    ...decode
                };
            } catch (error) {
                console.log('error decoding account', account, error)
            }
        });
        return watchList;
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
};



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

        const listing = program.coder.accounts.decode("fractionalizedListing", account_info!.data);
        
        const object = listing.object;
        
        const watch = await fetchCollectionV1(umi, object);
        const attributes = watch.attributes!.attributeList;
        const listingInfo = {
            id: listing.id.toNumber(),
            share: listing.share,
            shareSold: listing.shareSold,
            startingPrice: listing.price.toNumber(),
            watchKey: listing.object.toBase58(),
            reference: attributes[2].value,
            braceletMaterial: attributes[7].value,
            brand:  attributes[0].value,
            caseMaterial: attributes[6].value,
            dialColor: attributes[5].value,
            diamater: attributes[3].value,
            model: attributes[1].value,
            movement: attributes[4].value,
            yearOfProduction: attributes[8].value,
            uri: watch.uri,
        };
        return listingInfo;
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
};