import { clusterApiUrl, Connection, PublicKey, Keypair, DataSizeFilter, GetProgramAccountsConfig } from "@solana/web3.js";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { IDL, PROGRAM_ID } from "@/components/Utils/idl";

export const fetchProducts = async () => {
        const connection = new Connection(clusterApiUrl("devnet"), {
                commitment: "confirmed",
            });

        const wallet = Keypair.generate();

        // @ts-expect-error - wallet is dummy variable, signing is not needed
        const provider = new AnchorProvider(connection, wallet, {});
        setProvider(provider);

        const program = new Program(IDL, PROGRAM_ID);

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
                // dataSize: 68,
                dataSize: 92
            };
            const get_accounts_config: GetProgramAccountsConfig = {
                commitment: "confirmed",
                filters: [size_filter]
            };
            const all_program_accounts = await connection.getProgramAccounts(new PublicKey(PROGRAM_ID),
             get_accounts_config
             );

            //  console.log('all_program_accounts', all_program_accounts)
            const productList = all_program_accounts.map((account) => {
                try {
                    const decode = program.coder.accounts.decode("Listing", account.account.data);
                    // console.log('decode', decode);
                    // 
                    // id: BN {negative: 0, words: Array(3), length: 1, red: null}
                    // price: BN {negative: 0, words: Array(3), length: 1, red: null}
                    // reference: "15202ST.OO.1240ST.01"
                    // share: 100
                    // shareSold: 0
                    // startingTime: BN {negative: 0, words: Array(2), length: 2, red: null}
                    // watch: PublicKey {_bn: BN}
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

            const products = {
                available: availableProducts.map(product => ({
                    id: product.id,
                    accountPubkey: product.accountPubkey,
                    name: product.name,
                    image: product.img,
                    fractionsLeft: `${product.shareSold} / ${product.share}`,
                    startingPrice: `${product.price} USD`,
                    earningPotential: "TBD",
                    watch: product.watch.toBase58(),
                    reference: product.reference,
                })),
                comingSoon: comingSoonProducts.map(product => ({
                    id: product.id,
                    accountPubkey: product.accountPubkey,
                    name: product.name,
                    image: product.img,
                    releaseDate: formatDateToDddMmm(product.startingTime),
                    startingPrice: `${product.price} USD`,
                    earningPotential: "TBD",
                    watch: product.watch.toBase58(),
                    reference: product.reference,
                })),
            };
            return products;
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };
