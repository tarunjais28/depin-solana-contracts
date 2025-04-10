import { PublicKey } from "@solana/web3.js";

export const AdminAddress: PublicKey = new PublicKey(
  "FDFAEes1Tc4WbZeD6aJ25VHPUiUJVFDzUW3abiDRKmXD"
);

export const TOKEN = "Require";
export const DECIMALS = 9;
export const MINT = Buffer.from("mint");
export const GLOBAL_CONFIG = Buffer.from("global_config");
export const CREATORS = Buffer.from("creators");
export const COLLECTION_COUNTER = Buffer.from("counter");
export const TOKEN_BUFFER = Buffer.from(TOKEN);
export const FUND_DATA = Buffer.from("fund_data");
export const METADATA = Buffer.from("metadata");
export const COMMITMENT = Buffer.from("commitment");
export const USERS = Buffer.from("users");
export const ESCROW = Buffer.from("escrow");
export const SOL = Buffer.from("sol");
export const FEE = Buffer.from("fee");
export const TRADE = Buffer.from("trade");
export const RESERVE = Buffer.from("reserve");
export const DAO = Buffer.from("dao_list");
export const PROPOSAL = Buffer.from("proposal");
export const BLACKLIST = Buffer.from("blacklist");
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
