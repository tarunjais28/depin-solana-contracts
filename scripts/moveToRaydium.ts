import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { getProvider, tokenProgramInterface } from "./solanaService";
import { Fund } from "../target/types/fund";
import {
  CREATE_CPMM_POOL_PROGRAM,
  CREATE_CPMM_POOL_FEE_ACC,
  DEVNET_PROGRAM_ID,
  getCpmmPdaAmmConfigId,
  Raydium,
  TxVersion,
} from "@raydium-io/raydium-sdk-v2";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { AdminAddress } from "./constant";
import * as fund from "./fund";
import { BN } from "bn.js";

const { provider }: any = getProvider();
if (!provider) throw new Error("Provider not available");

export const createPool = async () => {
  const raydium = await Raydium.load({
    connection: provider.connection,
    owner: AdminAddress, // key pair or publicKey, if you run a node process, provide keyPair
    signAllTransactions: undefined, // optional - provide sign functions provided by @solana/wallet-adapter-react
    tokenAccounts: undefined, // optional, if dapp handle it by self can provide to sdk
    tokenAccountRawInfos: undefined, // optional, if dapp handle it by self can provide to sdk
    disableLoadToken: false, // default is false, if you don't need token info, set to true
  });

  // check token list here: https://api-v3.raydium.io/mint/list
  // RAY
  const mintA = await raydium.token.getTokenInfo(fund.mintAccount);
  // USDC
  const mintB = await raydium.token.getTokenInfo(
    "So11111111111111111111111111111111111111112"
  );

  /**
   * you also can provide mint info directly like below, then don't have to call token info api
   *  {
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      decimals: 6,
    } 
   */

  const feeConfigs = await raydium.api.getCpmmConfigs();

  if (raydium.cluster === "devnet") {
    feeConfigs.forEach((config) => {
      config.id = getCpmmPdaAmmConfigId(
        DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM,
        config.index
      ).publicKey.toBase58();
    });
  }

  const { execute, extInfo } = await raydium.cpmm.createPool({
    // poolId: // your custom publicKey, default sdk will automatically calculate pda pool id
    programId: CREATE_CPMM_POOL_PROGRAM, // devnet: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM
    poolFeeAccount: CREATE_CPMM_POOL_FEE_ACC, // devnet:  DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC
    mintA,
    mintB,
    mintAAmount: new BN(100),
    mintBAmount: new BN(100),
    startTime: new BN(0),
    feeConfig: feeConfigs[0],
    associatedOnly: false,
    ownerInfo: {
      useSOLBalance: true,
    },
    txVersion: TxVersion.V0,
    // optional: set up priority fee here
    computeBudgetConfig: {
      units: 600000,
      microLamports: 46591500,
    },
  });

  // // don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
  // const { txId } = await execute({ sendAndConfirm: true })
  // console.log('pool created', {
  //   txId,
  //   poolKeys: Object.keys(extInfo.address).reduce(
  //     (acc, cur) => ({
  //       ...acc,
  //       [cur]: extInfo.address[cur as keyof typeof extInfo.address].toString(),
  //     }),
  //     {}
  //   ),
  // })
  // process.exit() // if you don't want to end up node execution, comment this line
};
