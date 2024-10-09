import { publicKey } from '@metaplex-foundation/umi'
import { Connection, GetProgramAccountsConfig, Keypair, PublicKey } from '@solana/web3.js'
import { fetchAssetsByOwner, AssetV1, fetchCollectionV1, CollectionV1 } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { ArtsnCore, PROTOCOL } from '@/components/solana/protocol/artisan-exports';
import { AnchorProvider, Program } from "@coral-xyz/anchor";
const IDL = require('@/components/solana/protocol/idl/artisan.json');
const RPC = 'https://api.devnet.solana.com';
// Create Umi Instance
const umi = createUmi(RPC);


export const fetchAssets = async (owner: string): Promise<AssetV1[]> => {
    try {
      console.log('fetching assets for ->', owner);
      const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
        skipDerivePlugins: false,
      });
      console.log('assetsByOwner', assetsByOwner);
  
      const filteredAccounts = assetsByOwner.filter((asset) => {
        if (asset.oracles && asset.oracles[0] && asset.oracles[0].baseAddress === "7ruvHP3zbhszp2MaE9Z3DbzDZ5vbczxWN4KXEBWmg8tG") {
          console.log('asset match ->', asset);
          console.log('oracle base ->', asset.oracles[0].baseAddress);
          console.log("7ruvHP3zbhszp2MaE9Z3DbzDZ5vbczxWN4KXEBWmg8tG" === asset.oracles[0].baseAddress);
          return true;
        }
        return false;
      });
  
      console.log('filteredAccounts', filteredAccounts);
      return filteredAccounts;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

export const fetchProducts = async (productList: any[]): Promise<{ 
    availableWatches: CollectionV1[], 
    availableDiamonds: CollectionV1[], 
    comingSoonWatches: CollectionV1[], 
    comingSoonDiamonds: CollectionV1[] } | 
    undefined
> => {
    const formatDateToDddMmm = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const minute = date.getMinutes();
    
        const paddedDay = day.toString().padStart(2, '0');
        const paddedMinute = minute.toString().padStart(2, '0');
        
        return `${paddedDay}::${paddedMinute}`;
    };

    try {
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

        console.log('detailedAvailableProducts', detailedAvailableProducts[0].objectType)

        // filter the products by type
        const availableWatches = detailedAvailableProducts.filter(product => product.objectType.watch);
        const availableDiamonds = detailedAvailableProducts.filter(product => product.objectType.diamonds);
        const comingSoonWatches = detailedComingSoonProducts.filter(product => product.objectType.watch);
        const comingSoonDiamonds = detailedComingSoonProducts.filter(product => product.objectType.diamond);

        const products = {
            availableWatches: availableWatches as CollectionV1[],
            availableDiamonds: availableDiamonds as CollectionV1[],
            comingSoonWatches: comingSoonWatches as CollectionV1[],
            comingSoonDiamonds: comingSoonDiamonds as CollectionV1[], 
        };
        console.log('products', products)
        return products 
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return undefined;
    }
};

export const fetchObjectDetails = async (object: PublicKey): Promise<CollectionV1 | undefined> => {
    try {
        const objectKey = publicKey(object);
        const _obj = await fetchCollectionV1(umi, objectKey);
        
        return _obj as CollectionV1;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return undefined;
    }
};

export async function getListingByWatch (key: string) {
    try {
      const memcmp_filter = {
          memcmp: {
            offset: 17,
            bytes: new PublicKey(key).toBase58(),
          },
      };
      const get_accounts_config: GetProgramAccountsConfig = {
          commitment: "confirmed",
          filters: [
              memcmp_filter,
            { dataSize: 70 }
          ]
      };
      const connection = new Connection('https://devnet.helius-rpc.com/?api-key=b7faf1b9-5b70-4085-bf8e-a7be3e3b78c2', 'confirmed');
      const wallet = Keypair.generate();
      //@ts-expect-error - we are not signing
      const provider = new AnchorProvider(connection,  wallet, {commitment: "confirmed"});
      const program : Program<ArtsnCore> = new Program(IDL, provider);
      const nft = await connection.getProgramAccounts(
        program.programId,
        get_accounts_config 
      );
  
      const nft_decoded = program.coder.accounts.decode(
        "fractionalizedListing",
        nft[0].account.data
      );
      return {
        listing: nft[0].pubkey.toBase58(),
        price: Number(nft_decoded.price),
        shares: Number(nft_decoded.share),
        sharesSold: Number(nft_decoded.shareSold),
      };
    } catch (error) {
      console.error('Error fetching listing', error);
    }
  };