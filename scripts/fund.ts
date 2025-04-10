import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { getProvider, tokenProgramInterface } from "./solanaService";
import { Fund } from "../target/types/fund";
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import {
  AdminAddress,
  GLOBAL_CONFIG,
  TOKEN_BUFFER,
  TOKEN,
  MINT,
  COLLECTION_COUNTER,
  FUND_DATA,
  TOKEN_METADATA_PROGRAM_ID,
  METADATA,
  COMMITMENT,
  ESCROW,
  SOL,
  CREATORS,
  USERS,
  DECIMALS,
  FEE,
  DAO,
  PROPOSAL,
  BLACKLIST,
} from "./constant";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { Metaplex } from "@metaplex-foundation/js";
import { assert } from "chai";

const { provider }: any = getProvider();
if (!provider) throw new Error("Provider not available");
export const program: any = new anchor.Program(
  tokenProgramInterface,
  provider
) as Program<Fund>;

export const [pdaGlobalConfig] = anchor.web3.PublicKey.findProgramAddressSync(
  [GLOBAL_CONFIG],
  program.programId
);

export const [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
  [MINT, TOKEN_BUFFER],
  program.programId
);

export const [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
  [FUND_DATA, mintAccount.toBuffer()],
  program.programId
);

export const [pdaCommitments] = anchor.web3.PublicKey.findProgramAddressSync(
  [COMMITMENT, mintAccount.toBuffer()],
  program.programId
);

export const [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
  [METADATA, TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintAccount.toBuffer()],
  TOKEN_METADATA_PROGRAM_ID
);

export const [pdaEscrowSolAccount] =
  anchor.web3.PublicKey.findProgramAddressSync(
    [ESCROW, SOL, mintAccount.toBuffer()],
    program.programId
  );

export const [pdaCreators] = anchor.web3.PublicKey.findProgramAddressSync(
  [CREATORS],
  program.programId
);

export const [pdaUsers] = anchor.web3.PublicKey.findProgramAddressSync(
  [USERS, mintAccount.toBuffer()],
  program.programId
);

export const [pdaEscrowMintAccount] =
  anchor.web3.PublicKey.findProgramAddressSync(
    [ESCROW, MINT, mintAccount.toBuffer()],
    program.programId
  );

export const escrowMintAta = anchor.utils.token.associatedAddress({
  mint: mintAccount,
  owner: pdaEscrowMintAccount,
});

export const [pdaDaoList] = anchor.web3.PublicKey.findProgramAddressSync(
  [DAO],
  program.programId
);

const [pdaFeeAccount] = anchor.web3.PublicKey.findProgramAddressSync(
  [FEE],
  program.programId
);

export const [pdaProposalList] = anchor.web3.PublicKey.findProgramAddressSync(
  [PROPOSAL],
  program.programId
);

export const [pdaBlacklist] = anchor.web3.PublicKey.findProgramAddressSync(
  [BLACKLIST],
  program.programId
);

const addSubAdmins = async () => {
  await program.methods
    .addSubAdminAccounts([
      new PublicKey("9LKxrsu3E7FUdW14M2PMHjRJaShCrWk4VooComdgMuHM"),
    ])
    .accounts({
      authority: AdminAddress,
    })
    .rpc();
};

const addCreator = async () => {
  let user = new PublicKey("9LKxrsu3E7FUdW14M2PMHjRJaShCrWk4VooComdgMuHM");

  let params = {
    address: user,
    feePercent: 2000000, // 2%
  };

  let tx = await program.methods
    .addCreator(params)
    .accounts({
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const getCreatorsList = async () => {
  let creators = await program.account.creators.fetch(pdaCreators);
  console.log(creators);
};

const addVipUsers = async () => {
  let params = {
    token: TOKEN,
    userType: { vip: {} },
    manageType: { add: {} },
    users: [
      {
        address: new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"),
        maxAllowableAmount: new BN(10 * anchor.web3.LAMPORTS_PER_SOL),
      },
      {
        address: AdminAddress,
        maxAllowableAmount: new BN(5 * anchor.web3.LAMPORTS_PER_SOL),
      },
    ],
  };

  let tx = await program.methods
    .manageUsers(params)
    .accounts({
      metadata: metadataAddress,
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const removeVipUsers = async () => {
  let params = {
    token: TOKEN,
    userType: { vip: {} },
    manageType: { remove: {} },
    users: [
      new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"),
      AdminAddress,
    ],
  };

  let tx = await program.methods
    .manageUsers(params)
    .accounts({
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const addPartyUsers = async () => {
  let params = {
    token: TOKEN,
    userType: { party: {} },
    manageType: { add: {} },
    users: [
      {
        address: new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"),
        maxAllowableAmount: new BN(10 * anchor.web3.LAMPORTS_PER_SOL),
      },
      {
        address: AdminAddress,
        maxAllowableAmount: new BN(5 * anchor.web3.LAMPORTS_PER_SOL),
      },
    ],
  };

  let tx = await program.methods
    .manageUsers(params)
    .accounts({
      metadata: metadataAddress,
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const removePartyUsers = async () => {
  let params = {
    token: TOKEN,
    userType: { party: {} },
    manageType: { remove: {} },
    users: [
      new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"),
      AdminAddress,
    ],
  };

  let tx = await program.methods
    .manageUsers(params)
    .accounts({
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const getUsers = async () => {
  let users = await program.account.users.fetch(pdaUsers);
  console.log(users);
};

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

const getDaoList = async () => {
  let daoList = await program.account.daoList.fetch(pdaDaoList);
  console.log(daoList.tokens);
};

const createDao = async () => {
  let params = {
    name: TOKEN,
    symbol: "tar",
    decimals: DECIMALS,
    uri: "https://arweave.net/J9NcfqEeame4QcTBNKWktUYVaF7rcMtvpEiSTe9UVrEq",
    fundraisingGoal: new BN(0),
    amount: new BN("1000000000").mul(new BN(Math.pow(10, DECIMALS).toString())),
    vestingPercent: {
      firstClaim: 100000000,
      dailyClaim: 0,
    },
  };

  let tx = await program.methods
    .create(params)
    .accounts({
      metadata: metadataAddress,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const getFundStore = async () => {
  let fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
  console.log(fundStore);
  console.log("created_at timestamp: ", Number(fundStore.createdAt));
  console.log("start_date timestamp: ", Number(fundStore.startDate));
  console.log("end_date timestamp: ", Number(fundStore.endDate));
  console.log("fundraising goal: ", Number(fundStore.fundraisingGoal));
  console.log("status: ", fundStore.status);
  console.log("Tokens Per Sol: ", Number(fundStore.tokensPerSol));
  console.log("Symbol: ", fundStore.symbol);
  console.log("Fee Percent: ", fundStore.feePercent);
  console.log(
    "creatorWithdrawnAmount: ",
    Number(fundStore.creators.totalWithdrawable)
  );
  console.log(
    "deployerWithdrawnAmount: ",
    Number(fundStore.deployers.totalWithdrawable)
  );
};

const getCreatorInfo = async () => {
  let user = new PublicKey("9LKxrsu3E7FUdW14M2PMHjRJaShCrWk4VooComdgMuHM");
  const [pdaCreatorInfo] = anchor.web3.PublicKey.findProgramAddressSync(
    [CREATORS, user.toBuffer()],
    program.programId
  );

  let creatorInfo = await program.account.creatorInfo.fetch(pdaCreatorInfo);
  console.log(creatorInfo);
};

const initMultisig = async () => {
  let tx = await program.methods
    .initMultisig()
    .accounts({
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const initCreators = async () => {
  let tx = await program.methods
    .initCreators()
    .accounts({
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const initUsers = async () => {
  let tx = await program.methods
    .initUsers(TOKEN)
    .accounts({
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const initCommitment = async () => {
  let tx = await program.methods
    .initCommitment(TOKEN)
    .accounts({
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const commitment = async () => {
  let solAmount = new BN(1 * LAMPORTS_PER_SOL);

  let tx = await program.methods
    .commitment(TOKEN, solAmount)
    .accounts({
      payer: AdminAddress,
      feesCollectionAccount: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const getCommitmentList = async () => {
  let commitments = await program.account.commitments.fetch(pdaCommitments);
  for (const commiter of commitments.commiters) {
    // console.log(commiter);
    console.log({
      address: commiter.address.toBase58(),
      solAmount: Number(commiter.solAmount),
      tokenAmount: Number(commiter.tokenAmount),
      lastClaimDate: Number(commiter.lastClaimedAt),
      amountClaimed: Number(commiter.amountClaimed),
    });
  }
};

const getTokenBaseKeys = async () => {
  console.log("mint:", mintAccount.toString());
  console.log("global_config:", pdaGlobalConfig.toString());
  console.log("pdaTokenCounter:", pdaDaoList.toString());
  console.log("pdaFundDataStore:", pdaFundDataStore.toString());
  console.log("pdaCommitments:", pdaCommitments.toString());
  console.log("metadataAddress:", metadataAddress.toString());
  console.log("pdaEscrowSolAccount:", pdaEscrowSolAccount.toString());
  console.log("pdaCreators:", pdaCreators.toString());
  console.log("pdaEscrowMintAccount:", pdaEscrowMintAccount.toString());
  console.log("escrowMintAta:", escrowMintAta.toString());
  console.log("pdaFeeAccount:", pdaFeeAccount.toString());
};

const getTokenByMint = async () => {
  let user = new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3");
  let userATAs = await provider.connection.getTokenAccountsByOwner(user, {
    programId: TOKEN_PROGRAM_ID,
  });

  userATAs.value.forEach(async function (value) {
    let userAccount = await getAccount(
      provider.connection,
      value.pubkey,
      undefined,
      TOKEN_PROGRAM_ID
    );

    if (userAccount.mint.toBase58() == mintAccount.toBase58()) {
      console.log(userAccount.address, userAccount.owner);
    }
  });
};

const getTokenDetails = async () => {
  const metaplex = Metaplex.make(provider.connection);
  const metadata = await metaplex
    .nfts()
    .findByMint({ mintAddress: new PublicKey(mintAccount) });
  console.log("Metadata:", metadata);
};

const fetchBalances = async () => {
  let user = new PublicKey("FNi6MCkVWwxCmNPNdZUHrauACEtVwnaZ5XzQuB9nf7bc");
  let userAta = await getAssociatedTokenAddress(mintAccount, user);
  console.log("user: ", user.toString());
  console.log("ata: ", userAta.toString());

  let supply = (await provider.connection.getTokenSupply(mintAccount)).value
    .amount;

  let userAccountBalance = Number(
    (
      await getAccount(
        provider.connection,
        userAta,
        undefined,
        TOKEN_PROGRAM_ID
      )
    ).amount
  );

  console.log("supply: ", supply);
  console.log("user balance: ", userAccountBalance);
};

const updateStatus = async () => {
  let params = {
    token: TOKEN,
    status: { fundraisingSuccess: {} },
  };

  await program.methods
    .updateStatus(params)
    .accounts({
      metadata: metadataAddress,
      payer: AdminAddress,
    })
    .rpc();
};

const mint = async () => {
  // Minting 1M tokens with 9 decimals
  let params = {
    token: TOKEN,
    amount: new BN("100000000").mul(new BN(Math.pow(10, DECIMALS).toString())),
  };

  // Only creator of dao can mint tokens
  let tx = await program.methods
    .mint(params)
    .accounts({
      escrowMintAta,
      authority: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const burn = async () => {
  let userAta = await getAssociatedTokenAddress(mintAccount, AdminAddress);

  // burning 10 tokens with 9 decimals
  let params = {
    token: TOKEN,
    amount: new BN(10 * Math.pow(10, DECIMALS)),
  };

  // Only owner of dao token can burn tokens
  let tx = await program.methods
    .burn(params)
    .accounts({
      fromAta: userAta,
      authority: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const transferSolToCreator = async () => {
  let creatorAddress = new PublicKey(
    "Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"
  );

  let params = {
    token: TOKEN,
    proposalId: 1,
  };

  let tx = await program.methods
    .transferSolToCreator(params)
    .accounts({
      creatorAddress,
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const transferSolToDeployer = async () => {
  let user = new PublicKey("ArZEdFt7rq9Eoc1T4DoppEYh9vrdBHgLATxsFKRytfxr");

  let params = {
    token: TOKEN,
    proposalId: 1,
  };

  let tx = await program.methods
    .transferSolToDeployer(params)
    .accounts({
      metadata: metadataAddress,
      deployerAddress: user,
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const claim = async () => {
  let user = new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3");
  let userAta = await getAssociatedTokenAddress(mintAccount, user);

  let tx = await program.methods
    .claim(TOKEN)
    .accounts({
      payer: AdminAddress,
      feesCollectionAccount: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const getTokens = async () => {
  let user = new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3");
  let tokens = await provider.connection.getTokenAccountsByOwner(user, {
    programId: TOKEN_PROGRAM_ID,
  });
  console.log(tokens);
};

const updateFees = async () => {
  let params = {
    address: AdminAddress,
    token: TOKEN,
    feePercent: 5000000, // 5%
  };

  let tx = await program.methods
    .updateFees(params)
    .accounts({
      authority: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const updateFeeAccount = async () => {
  let tx = await program.methods
    .updateFeeAccount(AdminAddress)
    .accounts({
      authority: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const getFeeAccount = async () => {
  let feeAccount = await program.account.feeAccount.fetch(pdaFeeAccount);
  console.log(feeAccount);
};

const startDao = async () => {
  let tx = await program.methods
    .startDao(TOKEN)
    .accounts({
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const startPartyRound = async () => {
  let tx = await program.methods
    .startPartyRound(TOKEN)
    .accounts({
      metadata: metadataAddress,
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const endDao = async () => {
  let tx = await program.methods
    .endDao(TOKEN)
    .accounts({
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const createBlockDaoProposal = async () => {
  let subAdmin = AdminAddress;

  let tx = await program.methods
    .createBlockDaoProposal(TOKEN)
    .accounts({
      signer: subAdmin,
    })
    .rpc();

  console.log(tx);
};

const blockDao = async () => {
  let proposalId = 1;

  let tx = await program.methods
    .blockDao(TOKEN, proposalId)
    .accounts({
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const isAdmin = async () => {
  let user = new PublicKey("9LKxrsu3E7FUdW14M2PMHjRJaShCrWk4VooComdgMuHM");

  assert.isTrue(await program.methods.isAdmin(user).view());
};

const isSubAdmin = async () => {
  let user = new PublicKey("9LKxrsu3E7FUdW14M2PMHjRJaShCrWk4VooComdgMuHM");
  assert.isTrue(await program.methods.isSubAdmin(user).view());
};

const upgradeAccount = async () => {
  let tx = await program.methods
    .upgradeAccount(72)
    .accounts({
      account: pdaFundDataStore,
      payer: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const getDAOs = async () => {
  let user = new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3");
  let daos = await provider.connection.getTokenAccountsByOwner(user, {
    programId: TOKEN_PROGRAM_ID,
  });
  console.log(daos);
};

const createAddAdminProposal = async () => {
  let subAdmin = AdminAddress;
  let address = new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3");

  let tx = await program.methods
    .createAddAdminProposal(address)
    .accounts({
      signer: subAdmin,
    })
    .rpc();

  console.log(tx);
};

const addAdmin = async () => {
  let proposalId = 1;
  let adminWallet = AdminAddress;

  let tx = await program.methods
    .addAdmin(proposalId)
    .accounts({
      executor: adminWallet,
    })
    .rpc();

  console.log(tx);
};

const createRemoveAdminProposal = async () => {
  let subAdmin = AdminAddress;
  let address = new PublicKey("Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3");

  let tx = await program.methods
    .createRemoveAdminProposal(address)
    .accounts({
      signer: subAdmin,
    })
    .rpc();

  console.log(tx);
};

const removeAdmin = async () => {
  let proposalId = 1;
  let adminWallet = AdminAddress;

  let tx = await program.methods
    .removeAdmin(proposalId)
    .accounts({
      executor: adminWallet,
    })
    .rpc();

  console.log(tx);
};

const createAddDeployerProposal = async () => {
  let subAdmin = AdminAddress;
  let deployerAddress = new PublicKey(
    "Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"
  );

  let tx = await program.methods
    .createAddDeployerProposal(deployerAddress)
    .accounts({
      signer: subAdmin,
    })
    .rpc();

  console.log(tx);
};

const addDeployer = async () => {
  let proposalId = 1;
  let adminWallet = AdminAddress;

  let tx = await program.methods
    .addDeployer(proposalId)
    .accounts({
      executor: adminWallet,
    })
    .rpc();

  console.log(tx);
};

const createRemoveDeployerProposal = async () => {
  let subAdmin = AdminAddress;
  let deployerAddress = new PublicKey(
    "Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"
  );

  let tx = await program.methods
    .createRemoveDeployerProposal(deployerAddress)
    .accounts({
      signer: subAdmin,
    })
    .rpc();

  console.log(tx);
};

const removeDeployer = async () => {
  let proposalId = 1;
  let adminWallet = AdminAddress;

  let tx = await program.methods
    .removeDeployer(proposalId)
    .accounts({
      executor: adminWallet,
    })
    .rpc();

  console.log(tx);
};

const createTransferSolToCreatorProposal = async () => {
  let subAdmin = AdminAddress;
  let amount = new BN(1 * LAMPORTS_PER_SOL);

  let tx = await program.methods
    .createTransferSolToCreatorProposal(TOKEN, amount)
    .accounts({
      metadata: metadataAddress,
      signer: subAdmin,
    })
    .rpc();

  console.log(tx);
};

const createTransferSolToDeployerProposal = async () => {
  let subAdmin = AdminAddress;
  let deployerAddress = new PublicKey(
    "Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"
  );
  let amount = new BN(1 * LAMPORTS_PER_SOL);

  let tx = await program.methods
    .createTransferSolToDeployerProposal(TOKEN, amount, deployerAddress)
    .accounts({
      metadata: metadataAddress,
      signer: subAdmin,
    })
    .rpc();

  console.log(tx);
};

const createUpdateOwnerProposal = async () => {
  let subAdmin = AdminAddress;
  let newAddress = new PublicKey(
    "Ex7y8SZSpd1BMDa5mMRe16CvevsH564EzmECLfxiNbV3"
  );

  let tx = await program.methods
    .createUpdateOwnerProposal(newAddress)
    .accounts({
      signer: subAdmin,
    })
    .rpc();

  console.log(tx);
};

const updateOwner = async () => {
  let proposalId = 1;
  let adminWallet = AdminAddress;

  let tx = await program.methods
    .updateOwner(proposalId)
    .accounts({
      executor: adminWallet,
    })
    .rpc();

  console.log(tx);
};

const createBlockCreatorProposal = async () => {
  let admin = AdminAddress;
  let user = new PublicKey("9LKxrsu3E7FUdW14M2PMHjRJaShCrWk4VooComdgMuHM");

  let tx = await program.methods
    .createBlockCreatorProposal(user)
    .accounts({
      signer: admin,
    })
    .rpc();

  console.log(tx);
};

const blockCreator = async () => {
  let owner = AdminAddress;
  let proposalId = 1;

  let tx = await program.methods
    .blacklistCreator(proposalId)
    .accounts({
      executer: owner,
    })
    .rpc();

  console.log(tx);
};

const createUnblockCreatorProposal = async () => {
  let admin = AdminAddress;
  let user = new PublicKey("9LKxrsu3E7FUdW14M2PMHjRJaShCrWk4VooComdgMuHM");

  let tx = await program.methods
    .createUnblockCreatorProposal(user)
    .accounts({
      signer: admin,
    })
    .rpc();

  console.log(tx);
};

const unblockCreator = async () => {
  let owner = AdminAddress;
  let proposalId = 1;

  let tx = await program.methods
    .unblockCreator(proposalId)
    .accounts({
      executer: owner,
    })
    .rpc();

  console.log(tx);
};

const createBlockUserProposal = async () => {
  let admin = AdminAddress;
  let user = new PublicKey("9LKxrsu3E7FUdW14M2PMHjRJaShCrWk4VooComdgMuHM");

  let tx = await program.methods
    .createBlockUserProposal(user)
    .accounts({
      signer: admin,
    })
    .rpc();

  console.log(tx);
};

const blacklistUser = async () => {
  let owner = AdminAddress;
  let proposalId = 1;

  let tx = await program.methods
    .blacklistUser(proposalId)
    .accounts({
      executer: owner,
    })
    .rpc();

  console.log(tx);
};

const createUnblockUserProposal = async () => {
  let admin = AdminAddress;
  let user = new PublicKey("9LKxrsu3E7FUdW14M2PMHjRJaShCrWk4VooComdgMuHM");

  let tx = await program.methods
    .createUnblockUserProposal(user)
    .accounts({
      signer: admin,
    })
    .rpc();

  console.log(tx);
};

const unblockUser = async () => {
  let owner = AdminAddress;
  let proposalId = 1;

  let tx = await program.methods
    .unblockUser(proposalId)
    .accounts({
      executer: owner,
    })
    .rpc();

  console.log(tx);
};

const approveProposal = async () => {
  let proposalId = 13;

  let tx = await program.methods
    .approveProposal(proposalId)
    .accounts({
      approver: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const rejectProposal = async () => {
  let proposalId = 1;

  let tx = await program.methods
    .rejectProposal(proposalId)
    .accounts({
      approver: AdminAddress,
    })
    .rpc();

  console.log(tx);
};

const createPublishToAmmProposal = async () => {
  let admin = AdminAddress;
  let feePercent = 2000000; // 2%

  let tx = await program.methods
    .createPublishToAmmProposal(TOKEN, feePercent)
    .accounts({
      signer: admin,
    })
    .rpc();

  console.log(tx);
};

const createRemoveLiquidityProposal = async () => {
  let admin = AdminAddress;
  // Remove 50% of liquidity
  let percent = 50000000;

  let tx = await program.methods
    .createRemoveLiquidityProposal(TOKEN, percent)
    .accounts({
      signer: admin,
    })
    .rpc();

  console.log(tx);
};

const reset = async () => {
  let tx = await program.methods
    .reset()
    .accounts({
      account: pdaFundDataStore,
    })
    .rpc();

  console.log(tx);
};

const getProposalList = async () => {
  let proposalList = await program.account.proposalsList.fetch(pdaProposalList);
  console.log(JSON.stringify(proposalList));
};

const getProposalById = async () => {
  let proposalId = 13;

  let proposalList = await program.account.proposalsList.fetch(pdaProposalList);
  let proposal = proposalList.proposals.find(
    (proposal) => proposal.id === proposalId
  );
  console.log(proposal);
  // console.log(Number(proposal.transferAmount));
};

const getBlacklistedCreators = async () => {
  let creators = await program.account.creators.fetch(pdaCreators);
  let blacklist = creators.creators.filter((cr) => cr.isBlocked);
  console.log(blacklist);
};

const getBlacklistedUsers = async () => {
  let blacklist = await program.account.blacklist.fetch(pdaBlacklist);
  console.log(blacklist);
};

const getEscrowSolBalance = async () => {
  let escrowSolAccountBalanceAfter = await provider.connection.getBalance(
    pdaEscrowSolAccount
  );
  console.log(escrowSolAccountBalanceAfter);
};

export {
  addAdmin,
  addCreator,
  addDeployer,
  addPartyUsers,
  addSubAdmins,
  addVipUsers,
  approveProposal,
  blacklistUser,
  blockCreator,
  blockDao,
  burn,
  claim,
  commitment,
  createAddAdminProposal,
  createAddDeployerProposal,
  createBlockUserProposal,
  createBlockCreatorProposal,
  createBlockDaoProposal,
  createDao,
  createPublishToAmmProposal,
  createRemoveAdminProposal,
  createRemoveDeployerProposal,
  createRemoveLiquidityProposal,
  createTransferSolToCreatorProposal,
  createTransferSolToDeployerProposal,
  createUnblockCreatorProposal,
  createUnblockUserProposal,
  createUpdateOwnerProposal,
  endDao,
  fetchBalances,
  fetchMaintainers,
  getBlacklistedCreators,
  getBlacklistedUsers,
  getDaoList,
  getCommitmentList,
  getCreatorInfo,
  getCreatorsList,
  getDAOs,
  getEscrowSolBalance,
  getFeeAccount,
  getFundStore,
  getProposalById,
  getProposalList,
  getTokens,
  getTokenBaseKeys,
  getTokenByMint,
  getTokenDetails,
  getUsers,
  init,
  initCommitment,
  initCreators,
  initMultisig,
  initUsers,
  isAdmin,
  isSubAdmin,
  mint,
  rejectProposal,
  removeAdmin,
  removeDeployer,
  removePartyUsers,
  removeVipUsers,
  reset,
  startDao,
  startPartyRound,
  transferSolToCreator,
  transferSolToDeployer,
  unblockCreator,
  unblockUser,
  updateFeeAccount,
  updateFees,
  updateOwner,
  updateStatus,
  upgradeAccount,
};
