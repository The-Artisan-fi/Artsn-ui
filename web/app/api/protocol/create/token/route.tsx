import * as anchor from "@coral-xyz/anchor";
import { IDL, ArtsnCore} from "@/components/Protocol/idl";
import { protocol, manager, mplCoreProgram } from "@/components/Protocol/constants";
import {
    PublicKey,
    SystemProgram,
    Keypair,
    Transaction,
    Connection,
    ComputeBudgetProgram
    // sendAndConfirmTransaction,
  } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"
  
  

export async function POST( request: Request ) {
    const wallet = Keypair.generate();
    const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
        "confirmed"
    );
    // @ts-expect-error - wallet is dummy variable, signing is not needed
    const provider = new anchor.AnchorProvider(connection, wallet, {});
    const program = new anchor.Program<ArtsnCore>(IDL, provider);
    try {
        const req = await request.json();
        // const id = req.id;

        const signer = new PublicKey(req.signer);
        // const modifyComputeUnitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 });
        const name = req.watchName;
        const uri = req.watchUri;
        const brand = req.watchBrand;
        const model = req.watchModel;
        const reference = req.watchReference;
        const diameter = req.watchDiameter;
        const movement = req.watchMovement;
        const dialColor = req.watchDialColor;
        const caseMaterial = req.watchCaseMaterial;
        const braceletMaterial = req.watchBraceletMaterial;
        const yearOfProduction = req.watchYearOfProduction;
        const id = new anchor.BN(req.listingId);
        const objectType = req.listingObjectType;
        const share = new anchor.BN(req.listingShare);
        const price = new anchor.BN(req.listingPrice);
        // const startingTime = new anchor.BN(req.listingStartingTime);
        const _imageFile = req.fileList;
        console.log('_imageFile', _imageFile.thumbUrl);
        // const reference = "15202ST.OO.1240ST.01";
        const watch = PublicKey.findProgramAddressSync([Buffer.from('watch'), Buffer.from(reference)], program.programId)[0];
        const listing = PublicKey.findProgramAddressSync([Buffer.from('listing'), new anchor.BN(id).toBuffer("le", 8)], program.programId)[0];
        const adminProfile = PublicKey.findProgramAddressSync([Buffer.from('admin'), signer.toBuffer()], program.programId)[0];

        // Create a devnet connection
        const umi = createUmi('https://api.devnet.solana.com');
        const UMI_KEY: string = process.env.UMI_KEY!;
        console.log('type of umiKey', typeof UMI_KEY); // string
        // need to convert UMI_KEY to Uint8Array json
        const UMI_KEY_JSON = JSON.parse(UMI_KEY);
        console.log('type of umiKeyJson', typeof UMI_KEY_JSON); // object
        console.log('umiKeyJson', UMI_KEY_JSON); // object
        let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(UMI_KEY_JSON));
        const _signer = createSignerFromKeypair(umi, keypair);

        umi.use(irysUploader());
        umi.use(signerIdentity(_signer));
        //1. Load image
        // create uint8buffer buffer from _imageFile
        const buffer = new Uint8Array(_imageFile.data);
        // const imageFile = await readFile(

        // );
        //2. Convert image to generic file.
        const genericFile = createGenericFile(buffer, "image/jpeg");
        //3. Upload image

        const [myUri] = await umi.uploader.upload([genericFile]); // https://arweave.net/vA0JUs3XYFxwjcNTmqPJGIJrbaKqx-gMQBXmUkKbwfw
        console.log("Your image URI: ", myUri);

        const image = myUri;
        const metadata = {
            name: name,
            symbol: brand.slice(0,3).toUpperCase(),
            description: "Rugs not Drugs is a collection of rugs that are not drugs.",
            image: image,
            attributes: [
                {
                    "key": "Brand",
                    "value": brand
                },
                {
                    "key": "Model",
                    "value": model
                },
                {
                    "key": "Reference",
                    "value": reference
                },
                {
                    "key": "Diameter",
                    "value": diameter
                },
                {
                    "key": "Movement",
                    "value": movement
                },
                {
                    "key": "Dial Color",
                    "value": dialColor
                },
                {
                    "key": "Case Material",
                    "value": caseMaterial
                },
                {
                    "key": "Bracelet Material",
                    "value": braceletMaterial
                },
                {
                    "key": "Year of Production",
                    "value": yearOfProduction
                }
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image,
                    },
                ]
            },
            creators: [
                {
                    address: keypair.publicKey.toString(),
                    share: 100
                }
            ]
        };
        const tokenUri = await umi.uploader.uploadJson(metadata);
        console.log("Your URI: ", tokenUri);
        
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
        };
        
        const createFractionalizedListingArgs = {
            id: new anchor.BN(id),
            objectType: objectType,
            share: new anchor.BN(share),
            price: new anchor.BN(price),
            startingTime: new anchor.BN(Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60)
        };
        
        
        const ix = await program.methods
        //@ts-expect-error - missing arguments
            .createWatch(
                createWatchArgs
            )
            .accountsPartial({
                admin: signer,
                adminProfile,   
                manager,
                protocol,
                watch,
                mplCoreProgram,
                systemProgram: SystemProgram.programId,
            })
            .signers([signer])
            .instruction()

        const ix2 = await program.methods
        //@ts-expect-error - missing arguments
            .createFractionalizedListing(
                createFractionalizedListingArgs
            )
            .accounts({
                admin: signer,
                adminProfile,   
                manager,
                object: watch,
                listing,
                systemProgram: SystemProgram.programId,
            })
            .instruction()

        const { blockhash } = await connection.getLatestBlockhash("finalized");
        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: signer,
        });
        
        transaction.add(ix).add(ix2);
        
        const serializedTransaction = transaction.serialize({
            requireAllSignatures: false,
          });
        const base64 = serializedTransaction.toString("base64");

        return new Response(JSON.stringify({
            transaction: base64,
            watch: watch.toString(),
            associatedId: listing.toString(),
        }), {
            headers: {
                'content-type': 'application/json',
            },
        });


        // write a curl route to test the api
        // curl -X POST http://localhost:3000/api/protocol/create/token -d '{}'
    } catch (e) {
        console.log(e);
        throw e;
    }
};