import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  getProvider,
  tokenProgramInterface,
  proxyProgramInterface,
} from "./solanaService";
import { Fund } from "../target/types/fund";
import { Proxy } from "../target/types/proxy";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  AdminAddress,
  GLOBAL_CONFIG,
  TOKEN,
  TOKEN_METADATA_PROGRAM_ID,
  DECIMALS,
  CREATORS,
} from "./constant";
import { BN } from "bn.js";
import * as fund from "./fund";
import * as bc from "./bc";
import { PublicKey } from "@metaplex-foundation/js";

const { provider }: any = getProvider();
if (!provider) throw new Error("Provider not available");

let program: any = new anchor.Program(
  proxyProgramInterface,
  provider
) as Program<Proxy>;

const create = async () => {
  let params = {
    name: TOKEN,
    symbol: "tar",
    decimals: DECIMALS,
    uri: "https://arweave.net/J9NcfqEeame4QcTBNKWktUYVaF7rcMtvpEiSTe9UVrEq",
    fees: new BN(0),
    fundraisingGoal: new BN("3").mul(
      new BN(anchor.web3.LAMPORTS_PER_SOL.toString())
    ),
    amount: new BN("1000000000").mul(new BN(Math.pow(10, DECIMALS).toString())),
    vestingPercent: {
      firstClaim: 100,
      dailyClaim: 0,
    },
  };

  const [pdaCreatorInfo] = anchor.web3.PublicKey.findProgramAddressSync(
    [CREATORS, AdminAddress.toBuffer()],
    fund.program.programId
  );

  let tx = await program.methods
    .create(params)
    .accounts({
      creators: fund.pdaCreators,
      creatorInfo: pdaCreatorInfo,
      mintAccount: fund.mintAccount,
      metadata: fund.metadataAddress,
      fundDataStore: fund.pdaFundDataStore,
      daoList: fund.pdaDaoList,
      escrowMintAccount: fund.pdaEscrowMintAccount,
      escrowMintAta: fund.escrowMintAta,
      payer: AdminAddress,
      feesCollectionAccount: AdminAddress,
      fund: fund.program.programId,
    })
    .rpc();

  console.log(tx);
};

const addLiquidity = async () => {
  let proposalId = 1;

  let tx = await program.methods
    .addLiquidity(proposalId)
    .accounts({
      fundGlobalConfig: fund.pdaGlobalConfig,
      creators: fund.pdaCreators,
      bondingCurveGlobalConfig: bc.pdaGlobalConfig,
      escrowSolAccount: fund.pdaEscrowSolAccount,
      mintAccount: fund.mintAccount,
      trade: bc.pdaTrade,
      fundDataStore: fund.pdaFundDataStore,
      solReserve: bc.pdaSolReserve,
      tokenReserve: bc.pdaTokenReserve,
      escrowMintAccount: fund.pdaEscrowMintAccount,
      escrowMintAta: fund.escrowMintAta,
      proposalsList: fund.pdaProposalList,
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

export { addLiquidity, create };
