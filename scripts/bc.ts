import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { getProvider, bcProgramInterface } from "./solanaService";
import { BondingCurve } from "../target/types/bonding_curve";
import * as fund from "./fund";
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import {
  AdminAddress,
  GLOBAL_CONFIG,
  MINT,
  SOL,
  DECIMALS,
  TRADE,
  RESERVE,
} from "./constant";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { Metaplex } from "@metaplex-foundation/js";
import { assert } from "chai";

const { provider }: any = getProvider();
if (!provider) throw new Error("Provider not available");
export const program: any = new anchor.Program(
  bcProgramInterface,
  provider
) as Program<BondingCurve>;

export const [pdaGlobalConfig] = anchor.web3.PublicKey.findProgramAddressSync(
  [GLOBAL_CONFIG],
  program.programId
);

export const [pdaTrade] = anchor.web3.PublicKey.findProgramAddressSync(
  [TRADE, fund.mintAccount.toBuffer()],
  program.programId
);

export const [pdaSolReserve] = anchor.web3.PublicKey.findProgramAddressSync(
  [RESERVE, SOL, fund.mintAccount.toBuffer()],
  program.programId
);

export const [pdaTokenReserve] = anchor.web3.PublicKey.findProgramAddressSync(
  [RESERVE, MINT, fund.mintAccount.toBuffer()],
  program.programId
);

const init = async () => {
  let tx = await program.methods
    .init(AdminAddress)
    .accounts({
      authority: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const fetchMaintainers = async () => {
  let globalConfig = await program.account.globalConfig.fetch(pdaGlobalConfig);
  console.log(globalConfig);
};

const initTrade = async () => {
  let tx = await program.methods
    .initTrade()
    .accounts({
      mintAccount: fund.mintAccount,
      payer: AdminAddress,
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
      escrowSolAccount: fund.pdaEscrowSolAccount,
      fundDataStore: fund.pdaFundDataStore,
      escrowMintAccount: fund.pdaEscrowMintAccount,
      escrowMintAta: fund.escrowMintAta,
      mintAccount: fund.mintAccount,
      proposalsList: fund.pdaProposalList,
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const removeLiquidity = async () => {
  let proposalId = 1;
  let tx = await program.methods
    .removeLiquidity(proposalId)
    .accounts({
      fundGlobalConfig: fund.pdaGlobalConfig,
      proposalsList: fund.pdaProposalList,
      mintAccount: fund.mintAccount,
      toAccount: new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"),
      authority: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const buy = async () => {
  let solAmount = new BN(1 * LAMPORTS_PER_SOL);
  let tx = await program.methods
    .buyTokens(solAmount)
    .accounts({
      mintAccount: fund.mintAccount,
      blacklist: fund.pdaBlacklist,
      feesCollectionAccount: new PublicKey(
        "Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"
      ),
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const sell = async () => {
  let tokenAmount = new BN("100").mul(
    new BN(Math.pow(10, DECIMALS).toString())
  );

  let tx = await program.methods
    .sellTokens(tokenAmount)
    .accounts({
      mintAccount: fund.mintAccount,
      blacklist: fund.pdaBlacklist,
      feesCollectionAccount: new PublicKey(
        "Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"
      ),
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const updateFees = async () => {
  // Setting fees as 5%
  let feePercent = 5000000;

  let tx = await program.methods
    .updateFees(feePercent)
    .accounts({
      fundGlobalConfig: fund.pdaGlobalConfig,
      mintAccount: fund.mintAccount,
      authority: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const updateFeeAccount = async () => {
  let tx = await program.methods
    .updateFeeAccount(AdminAddress)
    .accounts({
      fundGlobalConfig: fund.pdaGlobalConfig,
      authority: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const getFeeAccount = async () => {
  let globalConfig = await program.account.globalConfig.fetch(pdaGlobalConfig);
  console.log(globalConfig.feesCollectionAccount);
};

const getPoolDetails = async () => {
  let pool = await program.account.trade.fetch(pdaTrade);
  console.log("Sol Reserve:", Number(pool.solReserve));
  console.log("Token Reserve:", Number(pool.tokenReserve));
  console.log("Fee Percent:", Number(pool.feePercent));
};

const getEstimatedTokenAmount = async (): Promise<any> => {
  let solAmount = new BN(5 * anchor.web3.LAMPORTS_PER_SOL);
  let amountType = { sol: {} };

  let amount = await program.methods
    .getEstimatedAmount(solAmount, amountType)
    .accounts({
      mintAccount: fund.mintAccount,
    })
    .view();

  console.log("estimated token amount:", Number(amount));
};

const getEstimatedSolAmount = async (): Promise<any> => {
  let tokenAmount = new BN("5000000").mul(
    new BN(Math.pow(10, DECIMALS).toString())
  );
  let amountType = { token: {} };

  let amount = await program.methods
    .getEstimatedAmount(tokenAmount, amountType)
    .accounts({
      mintAccount: fund.mintAccount,
    })
    .view();

  console.log("estimated sol amount:", Number(amount));
};

const getBaseKeys = async () => {
  console.log("trade:", pdaTrade.toBase58());
  console.log("sol reserve:", pdaSolReserve.toBase58());
  console.log("token reserve:", pdaTokenReserve.toBase58());
};

const isAdmin = async () => {
  let user = new PublicKey("9LKxrsu3E7FUdW14M2PMHjRJaShCrWk4VooComdgMuHM");

  assert.isTrue(await program.methods.isAdmin(user).view());
};

const isSubAdmin = async () => {
  let user = new PublicKey("9LKxrsu3E7FUdW14M2PMHjRJaShCrWk4VooComdgMuHM");
  assert.isTrue(await program.methods.isSubAdmin(user).view());
};

const getReserveSolBalance = async () => {
  let escrowSolAccountBalanceAfter = await provider.connection.getBalance(
    pdaSolReserve
  );
  console.log(escrowSolAccountBalanceAfter);
};

export {
  addLiquidity,
  buy,
  fetchMaintainers,
  getBaseKeys,
  getEstimatedSolAmount,
  getEstimatedTokenAmount,
  getFeeAccount,
  getPoolDetails,
  getReserveSolBalance,
  init,
  initTrade,
  isAdmin,
  isSubAdmin,
  removeLiquidity,
  sell,
  updateFeeAccount,
  updateFees,
};
