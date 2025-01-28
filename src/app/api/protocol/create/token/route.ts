import * as anchor from '@coral-xyz/anchor'
import { Program, AnchorProvider } from '@coral-xyz/anchor'
import {
  ArtsnCore,
  MANAGER,
  mplCoreProgram,
  ArtsnCoreIDL,
  PROTOCOL,
} from '@/components/blockchain/artisan-exports'
import {
  PublicKey,
  SystemProgram,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
  Connection,
  // sendAndConfirmTransaction,
} from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  createSignerFromKeypair,
  signerIdentity,
  createGenericFileFromBrowserFile,
} from '@metaplex-foundation/umi'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
function dataURLtoFile(dataurl: string, filename: string) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export async function POST(request: Request) {
  const wallet = Keypair.generate()
  const connection = new Connection(
    process.env.NEXT_PUBLIC_HELIUS_DEV!,
    'confirmed'
  )
  // @ts-expect-error - wallet is dummy variable, signing is not needed
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  })
  const program: Program<ArtsnCore> = new Program(
    ArtsnCoreIDL as ArtsnCore,
    provider
  )
  try {
    const req = await request.json()
    // const id = req.id;

    const signer = new PublicKey(req.signer)
    // const modifyComputeUnitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 });
    const name = req.watchName
    const uri = req.watchUri
    const brand = req.watchBrand
    const model = req.watchModel
    const reference = req.watchReference
    const diameter = req.watchDiameter
    const movement = req.watchMovement
    const dialColor = req.watchDialColor
    const caseMaterial = req.watchCaseMaterial
    const braceletMaterial = req.watchBraceletMaterial
    const yearOfProduction = req.watchYearOfProduction
    const id = new anchor.BN(req.listingId)
    const objectType = req.listingObjectType
    const share = new anchor.BN(req.listingShare)
    const price = new anchor.BN(req.listingPrice)
    // const startingTime = new anchor.BN(req.listingStartingTime);
    const _imageFile = req.fileList
    console.log('_imageFile', _imageFile)
    // const reference = "15202ST.OO.1240ST.01";
    const watch = PublicKey.findProgramAddressSync(
      [Buffer.from('watch'), Buffer.from(reference)],
      program.programId
    )[0]
    const listing = PublicKey.findProgramAddressSync(
      [Buffer.from('listing'), new anchor.BN(id).toBuffer('le', 8)],
      program.programId
    )[0]
    const adminProfile = PublicKey.findProgramAddressSync(
      [Buffer.from('admin'), signer.toBuffer()],
      program.programId
    )[0]

    // Create a devnet connection
    const umi = createUmi(process.env.NEXT_PUBLIC_HELIUS_DEVNET!)
    const UMI_KEY: string = process.env.UMI_KEY!
    // console.log('type of umiKey', typeof UMI_KEY); // string
    // need to convert UMI_KEY to Uint8Array json
    const UMI_KEY_JSON = JSON.parse(UMI_KEY)
    // console.log('type of umiKeyJson', typeof UMI_KEY_JSON); // object
    // console.log('umiKeyJson', UMI_KEY_JSON); // object
    const keypair = umi.eddsa.createKeypairFromSecretKey(
      new Uint8Array(UMI_KEY_JSON)
    )
    const _signer = createSignerFromKeypair(umi, keypair)
    console.log('signer', _signer.publicKey.toString())
    umi.use(irysUploader())
    umi.use(signerIdentity(_signer))

    var file = dataURLtoFile(_imageFile.thumbUrl, _imageFile.name)
    const _genericFile = await createGenericFileFromBrowserFile(file)
    const [myUri] = await umi.uploader.upload([_genericFile]) // https://arweave.net/vA0JUs3XYFxwjcNTmqPJGIJrbaKqx-gMQBXmUkKbwfw

    console.log('Your image URI: ', myUri)

    const image = myUri
    const metadata = {
      name: name,
      symbol: brand.slice(0, 3).toUpperCase(),
      description: 'Rugs not Drugs is a collection of rugs that are not drugs.',
      image: image,
      attributes: [
        {
          key: 'Brand',
          value: brand,
        },
        {
          key: 'Model',
          value: model,
        },
        {
          key: 'Reference',
          value: reference,
        },
        {
          key: 'Diameter',
          value: diameter,
        },
        {
          key: 'Movement',
          value: movement,
        },
        {
          key: 'Dial Color',
          value: dialColor,
        },
        {
          key: 'Case Material',
          value: caseMaterial,
        },
        {
          key: 'Bracelet Material',
          value: braceletMaterial,
        },
        {
          key: 'Year of Production',
          value: yearOfProduction,
        },
      ],
      properties: {
        files: [
          {
            type: 'image/png',
            uri: image,
          },
        ],
      },
      creators: [
        {
          address: keypair.publicKey.toString(),
          share: 100,
        },
      ],
    }
    const tokenUri = await umi.uploader.uploadJson(metadata)
    console.log('Your URI: ', tokenUri)

    const createWatchArgs = {
      name: name,
      uri: tokenUri,
      brand: brand,
      model: model,
      reference: reference,
      diameter: diameter,
      movement: movement,
      dialColor: dialColor,
      caseMaterial: caseMaterial,
      braceletMaterial: braceletMaterial,
      yearOfProduction: yearOfProduction,
    }

    const createFractionalizedListingArgs = {
      id: new anchor.BN(id),
      objectType: objectType,
      share: new anchor.BN(share),
      price: new anchor.BN(price),
      startingTime: new anchor.BN(
        Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60
      ),
    }

    const ix = await program.methods
      //@ts-ignore expects snake case instead of camel case, but is working fine
      .createWatch(createWatchArgs)
      .accountsPartial({
        admin: signer,
        adminProfile,
        manager: MANAGER,
        protocol: PROTOCOL,
        watch,
        mplCoreProgram,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    //@ts-ignore expects snake case instead of camel case, but is working fine
    const ix2 = await program.methods
      .createFractionalizedListing(createFractionalizedListingArgs)
      .accountsPartial({
        admin: signer,
        adminProfile,
        manager: MANAGER,
        object: watch,
        listing,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction()

    const { blockhash } = await connection.getLatestBlockhash('finalized')
    const messageV0 = new TransactionMessage({
      payerKey: signer,
      recentBlockhash: blockhash,
      instructions: [ix, ix2],
    }).compileToV0Message()

    const txn = new VersionedTransaction(messageV0)
    const base64 = Buffer.from(txn.serialize()).toString('base64')

    return Response.json(
      {
        transaction: base64,
        watch: watch.toString(),
        associatedId: listing.toString(),
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    )

    // write a curl route to test the api
    // curl -X POST http://localhost:3000/api/protocol/create/token -d '{}'
  } catch (e) {
    console.log(e)
    throw e
  }
}
