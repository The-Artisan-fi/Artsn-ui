import { publicKey } from '@metaplex-foundation/umi'
import {
  Connection,
  GetProgramAccountsConfig,
  Keypair,
  PublicKey,
} from '@solana/web3.js'
import {
  fetchAssetsByOwner,
  AssetV1,
  fetchCollectionV1,
  CollectionV1,
} from '@metaplex-foundation/mpl-core'
import { ArtsnCore, PROTOCOL } from '@/components/blockchain/artisan-exports'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { rpcManager } from '@/lib/rpc/rpc-manager'
import { HeliusMplCoreAsset } from '@/types'
const IDL = require('@/components/blockchain/idl/artisan.json')
const RPC = rpcManager.getConnection()
const helius =
  'https://devnet.helius-rpc.com/?api-key=b7faf1b9-5b70-4085-bf8e-a7be3e3b78c2'
// Create Umi Instance
const umi = rpcManager.getUmi()

interface ListingResult {
  listing: string
  price: number
  shares: number
  sharesSold: number
}

export const fetchAssets = async (
  owner: string
): Promise<HeliusMplCoreAsset[]> => {
  try {
    console.log('fetching assets for ->', owner)

    // const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
    //   skipDerivePlugins: false,
    // });
    // console.log('assetsByOwner', assetsByOwner);

    const getAssetsByOwner = async () => {
      const response = await fetch(helius, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'my-id',
          method: 'getAssetsByOwner',
          params: {
            ownerAddress: owner,
            page: 1, // Starts at 1
            limit: 1000,
          },
        }),
      })
      const { result } = await response.json()
      console.log('Assets by Owner Length: ', result.items.length)
      console.log('Assets by Owner: ', result.items)
      return result.items
    }
    const assetsByOwner = await getAssetsByOwner()

    const filteredAccounts: HeliusMplCoreAsset[] = assetsByOwner.filter(
      (asset: HeliusMplCoreAsset) => {
        if (
          asset.authorities[0].address ===
          'GC1ebi99yrcurrTJMEhCp4oCmMg8CNrhAsKFJ3arQeg1'
        ) {
          console.log('asset match ->', asset)
          return true
        }
        return false
      }
    )

    console.log('filteredAccounts', filteredAccounts)
    return filteredAccounts
  } catch (error) {
    console.error(error)
    return []
  }
}

export const fetchProducts = async (
  productList: any[]
): Promise<
  | {
      availableWatches: CollectionV1[]
      availableDiamonds: CollectionV1[]
      comingSoonWatches: CollectionV1[]
      comingSoonDiamonds: CollectionV1[]
    }
  | undefined
> => {
  const formatDateToDddMmm = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const day = date.getDate()
    const minute = date.getMinutes()

    const paddedDay = day.toString().padStart(2, '0')
    const paddedMinute = minute.toString().padStart(2, '0')

    return `${paddedDay}::${paddedMinute}`
  }

  try {
    const currentTime = Math.floor(Date.now() / 1000)
    const availableProducts = productList.filter(
      (product) => product.startingTime < currentTime
    )
    const comingSoonProducts = productList.filter(
      (product) => product.startingTime >= currentTime
    )
    const detailedAvailableProducts = []

    for (let i = 0; i < availableProducts.length; i++) {
      const nft = availableProducts[i]
      const watch = await fetchCollectionV1(umi, availableProducts[i].object)

      detailedAvailableProducts.push({
        ...nft,
        watch: watch.attributes!.attributeList,
      })
    }

    const detailedComingSoonProducts = []

    for (let i = 0; i < comingSoonProducts.length; i++) {
      const nft = comingSoonProducts[i]
      const watch = await fetchCollectionV1(umi, comingSoonProducts[i].object)

      detailedComingSoonProducts.push({
        ...nft,
        watch: watch.attributes!.attributeList,
      })
    }

    console.log(
      'detailedAvailableProducts',
      detailedAvailableProducts[0].objectType
    )

    // filter the products by type
    const availableWatches = detailedAvailableProducts.filter(
      (product) => product.objectType.watch
    )
    const availableDiamonds = detailedAvailableProducts.filter(
      (product) => product.objectType.diamonds
    )
    const comingSoonWatches = detailedComingSoonProducts.filter(
      (product) => product.objectType.watch
    )
    const comingSoonDiamonds = detailedComingSoonProducts.filter(
      (product) => product.objectType.diamond
    )

    const products = {
      availableWatches: availableWatches as CollectionV1[],
      availableDiamonds: availableDiamonds as CollectionV1[],
      comingSoonWatches: comingSoonWatches as CollectionV1[],
      comingSoonDiamonds: comingSoonDiamonds as CollectionV1[],
    }
    console.log('products', products)
    return products
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return undefined
  }
}

export const fetchObjectDetails = async (
  object: PublicKey
): Promise<CollectionV1 | undefined> => {
  try {
    const objectKey = publicKey(object)
    console.log('fetching object details for ->', objectKey)
    const _obj = await fetchCollectionV1(umi, objectKey)

    return _obj as CollectionV1
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return undefined
  }
}

export async function getListingByWatch(
  key: string,
  maxRetries = 3
): Promise<ListingResult | null> {
  let attempts = 0
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  while (attempts < maxRetries) {
    try {
      const memcmp_filter = {
        memcmp: {
          offset: 17,
          bytes: new PublicKey(key).toBase58(),
        },
      }

      const get_accounts_config: GetProgramAccountsConfig = {
        commitment: 'confirmed',
        filters: [memcmp_filter, { dataSize: 70 }],
      }

      // const connection = new Connection(
      //   'https://devnet.helius-rpc.com/?api-key=b7faf1b9-5b70-4085-bf8e-a7be3e3b78c2',
      //   'confirmed'
      // );

      // const connection = new Connection(RPC, 'confirmed');

      const wallet = Keypair.generate()
      //@ts-expect-error - we are not signing
      const provider = new AnchorProvider(RPC, wallet, {
        commitment: 'confirmed',
      })
      const program: Program<ArtsnCore> = new Program(IDL, provider)

      const nft = await RPC.getProgramAccounts(
        program.programId,
        get_accounts_config
      )

      // Check if we got any results
      if (!nft || nft.length === 0) {
        return null
      }

      const nft_decoded = program.coder.accounts.decode(
        'fractionalizedListing',
        nft[0].account.data
      )

      return {
        listing: nft[0].pubkey.toBase58(),
        price: Number(nft_decoded.price),
        shares: Number(nft_decoded.share),
        sharesSold: Number(nft_decoded.shareSold),
      }
    } catch (error: any) {
      attempts++

      // Handle rate limiting specifically
      if (error?.response?.status === 429 || error?.message?.includes('429')) {
        console.log(`Rate limited, attempt ${attempts} of ${maxRetries}`)

        // Calculate exponential backoff delay
        const backoffDelay = Math.min(1000 * Math.pow(2, attempts), 10000)

        // If we have more retries left, wait and try again
        if (attempts < maxRetries) {
          await delay(backoffDelay)
          continue
        }
      }

      // If we've exhausted retries or it's not a rate limit error
      if (attempts === maxRetries) {
        console.error('Max retries reached when fetching listing:', error)
        return null
      }

      // Handle other errors
      console.error('Error fetching listing:', error)
      return null
    }
  }

  return null
}
