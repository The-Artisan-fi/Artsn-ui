import { clusterApiUrl, Connection, PublicKey, Keypair, Transaction, GetProgramAccountsFilter, ParsedAccountData, VersionedMessage, VersionedTransaction, SimulateTransactionConfig } from "@solana/web3.js";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { IDL, PROGRAM_ID, ArtsnCore } from "./idl";
import * as anchor from "@coral-xyz/anchor";

const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
});
// const connection = new Connection("http://localhost:8899", {
//   commitment: "confirmed",
// })
const wallet = Keypair.generate();

// @ts-expect-error - wallet is dummy variable, signing is not needed
const provider = new AnchorProvider(connection, wallet, {});
setProvider(provider);

const programId = new PublicKey(PROGRAM_ID);
const program = new anchor.Program<ArtsnCore>(IDL, provider);

export const protocol = PublicKey.findProgramAddressSync([Buffer.from("protocol")], program.programId)[0];
export const manager = PublicKey.findProgramAddressSync([Buffer.from("manager")], program.programId)[0];
export const mplCoreProgram = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
export const mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // circle DEVNET - USDC
