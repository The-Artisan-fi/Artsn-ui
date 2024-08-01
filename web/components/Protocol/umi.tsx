import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

// Create Umi Instance
const umi = createUmi('https://api.devnet.solana.com');


export async function fetchAssets(owner: string) {
  const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
    skipDerivePlugins: false,
  })

  return assetsByOwner
}
