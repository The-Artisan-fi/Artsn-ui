import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { protocol } from './constants';
// Create Umi Instance
const umi = createUmi('https://devnet.helius-rpc.com/?api-key=b7faf1b9-5b70-4085-bf8e-a7be3e3b78c2');


export async function fetchAssets(owner: string) {
  try {
    const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
      skipDerivePlugins: false,
    })
    const filteredAccounts = assetsByOwner.filter((asset) => {
      return asset.oracles![0].baseAddress === protocol.toBase58()
    });
    return filteredAccounts
  } catch (error) {
    console.error(error)
    return []
  }
}
