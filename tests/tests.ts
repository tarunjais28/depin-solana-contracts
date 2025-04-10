import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { BN } from "bn.js";
import { assert } from "chai";
import { Fund } from "../target/types/fund";
import { BondingCurve } from "../target/types/bonding_curve";
import { Proxy } from "../target/types/proxy";
import { it } from "node:test";
import {
  ComputeBudgetProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

// Create test keypairs
const admin = anchor.web3.Keypair.generate();
const payer = anchor.web3.Keypair.generate();
const user1 = anchor.web3.Keypair.generate();
const user2 = anchor.web3.Keypair.generate();
const user3 = anchor.web3.Keypair.generate();
const user4 = anchor.web3.Keypair.generate();
const creator = anchor.web3.Keypair.generate();
const creator1 = anchor.web3.Keypair.generate();
const deployer = anchor.web3.Keypair.generate();
const owner = anchor.web3.Keypair.generate();
const feesCollectionAccount = anchor.web3.Keypair.generate();
const mintAuthority = anchor.web3.Keypair.generate();

// Constant seeds
const TOKEN = "Test";
const TEST_1_TOKEN = "Test-1";
const TEST_2_TOKEN = "Test-2";
const TEST_3_TOKEN = "Test-3";
const TEST_4_TOKEN = "Test-4";
const MINT = Buffer.from("mint");
const RESERVE = Buffer.from("reserve");
const ESCROW = Buffer.from("escrow");
const GLOBAL_CONFIG = Buffer.from("global_config");
const DAO = Buffer.from("dao_list");
const METADATA = Buffer.from("metadata");
const FUND_DATA = Buffer.from("fund_data");
const FEE = Buffer.from("fee");
const COMMITMENT = Buffer.from("commitment");
const CREATOR = Buffer.from("creators");
const USERS = Buffer.from("users");
const SOL = Buffer.from("sol");
const TOKEN_BUFFER = Buffer.from(TOKEN);
const TEST_1_BUFFER = Buffer.from(TEST_1_TOKEN);
const TEST_2_BUFFER = Buffer.from(TEST_2_TOKEN);
const TEST_3_BUFFER = Buffer.from(TEST_3_TOKEN);
const TEST_4_BUFFER = Buffer.from(TEST_4_TOKEN);
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const DECIMALS = 6;
const TRADE = Buffer.from("trade");

// Define constants
let PROPOSAL, BLACKLIST;

// Declare PDAs
let pdaGlobalConfig,
  pdaDaoList,
  pdaFundDataStore,
  pdaFeeAccount,
  pdaEscrowMintAccount,
  pdaCommitments,
  pdaCreators,
  pdaBlacklist,
  pdaUsers,
  pdaEscrowSolAccount,
  pdaProposalList,
  escrowMintAta,
  metadataAddress,
  pdaCreatorInfo,
  pdaTrade,
  pdaTokenReserve,
  pdaSolReserve,
  fundProgramId,
  fundProgram,
  fundGlobalConfig,
  bondingCurveGlobalConfig,
  bondingCurveProgramId,
  mintAccount = null;

// Create constant amount fields
const MINT_AMOUNT = new BN(1000000000 * Math.pow(10, DECIMALS));
const BURN_AMOUNT = new BN(1);

let currentProposalId = 1;
let addLiquidityProposalId;
let removeLiquidityProposalId;

describe("fund", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Fund as Program<Fund>;
  fundProgramId = program.programId;
  fundProgram = program;

  PROPOSAL = Buffer.from(
    new Uint8Array(JSON.parse(program.idl.constants[9].value))
  );

  BLACKLIST = Buffer.from(
    new Uint8Array(JSON.parse(program.idl.constants[0].value))
  );

  [pdaBlacklist] = anchor.web3.PublicKey.findProgramAddressSync(
    [BLACKLIST],
    program.programId
  );

  const confirmTransaction = async (tx) => {
    const latestBlockHash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    });
  };

  const initCreators = async () => {
    // Test init creator instruction
    var init = await program.methods
      .initCreators()
      .accounts({
        payer: payer.publicKey,
      })
      .signers([payer])
      .rpc();

    await confirmTransaction(init);
  };

  const initMultisig = async () => {
    // Test init multisig instruction
    let init = await program.methods
      .initMultisig()
      .accounts({
        payer: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(init);
  };

  const initUsers = async (token, signer) => {
    // Test init creator instruction
    let init = await program.methods
      .initUsers(token)
      .accounts({
        metadata: metadataAddress,
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(init);
  };

  const initCommitment = async (token) => {
    // Test init commitments instruction
    let init = await program.methods
      .initCommitment(token)
      .accounts({
        payer: user1.publicKey,
      })
      .signers([user1])
      .rpc();

    await confirmTransaction(init);
  };

  const createDao = async (params, signer) => {
    // Test create_token instruction
    let createDao = await program.methods
      .create(params)
      .accounts({
        metadata: metadataAddress,
        // tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(createDao);
  };

  const burn = async (params, signer, userAta) => {
    // Test burn_token instruction
    let burnToken = await program.methods
      .burn(params)
      .accounts({
        fromAta: userAta,
        authority: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(burnToken);
  };

  const mint = async (params, signer) => {
    // Test mint_token instruction
    let mintToken = await program.methods
      .mint(params)
      .accounts({
        authority: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(mintToken);
  };

  const commitment = async (
    token,
    solAmount,
    signer,
    feesCollectionAccount
  ) => {
    // Test commitment instruction
    let commitment = await program.methods
      .commitment(token, solAmount)
      .accounts({
        payer: signer.publicKey,
        feesCollectionAccount,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(commitment);
  };

  const updateStatus = async (params, signer) => {
    // Test updateStatus instruction
    let updateStatus = await program.methods
      .updateStatus(params)
      .accounts({
        metadata: metadataAddress,
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(updateStatus);
  };

  const startDao = async (token, signer) => {
    let start = await program.methods
      .startDao(token)
      .accounts({
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(start);
  };

  const startPartyRound = async (token, signer) => {
    let start = await program.methods
      .startPartyRound(token)
      .accounts({
        metadata: metadataAddress,
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(start);
  };

  const endDao = async (token, signer) => {
    let end = await program.methods
      .endDao(token)
      .accounts({
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(end);
  };

  const blockDao = async (token, proposalId, signer) => {
    let block = await program.methods
      .blockDao(token, proposalId)
      .accounts({
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(block);
  };

  const addCreator = async (params, signer) => {
    // Test manage creator instruction
    let manage = await program.methods
      .addCreator(params)
      .accounts({
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(manage);
  };

  const manageUsers = async (params, signer) => {
    // Test manage users instruction
    let manage = await program.methods
      .manageUsers(params)
      .accounts({
        metadata: metadataAddress,
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(manage);
  };

  const claim = async (token, signer, feesCollectionAccount) => {
    // Test manage users instruction
    let claim = await program.methods
      .claim(token)
      .accounts({
        payer: signer.publicKey,
        feesCollectionAccount,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(claim);
  };

  const transferSolToCreator = async (params, signer) => {
    let transfer = await program.methods
      .transferSolToCreator(params)
      .accounts({
        creatorAddress: creator.publicKey,
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(transfer);
  };

  const transferSolToDeployer = async (params, signer, toAccount) => {
    let transfer = await program.methods
      .transferToDeployer(params)
      .accounts({
        metadata: metadataAddress,
        deployerAddress: toAccount,
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(transfer);
  };

  const createUpdateOwnerProposal = async (address, signer) => {
    let create = await program.methods
      .createUpdateOwnerProposal(address)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const createBlockCreatorProposal = async (address, signer) => {
    let create = await program.methods
      .createBlockCreatorProposal(address)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const blacklistCreator = async (token, proposalId, signer) => {
    // Test block user instruction
    let manage = await program.methods
      .blacklistCreator(token, proposalId)
      .accounts({
        executer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(manage);
  };

  const createUnblockCreatorProposal = async (address, signer) => {
    let create = await program.methods
      .createUnblockCreatorProposal(address)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const unblockCreator = async (proposalId, signer) => {
    // Test block user instruction
    let manage = await program.methods
      .unblockCreator(proposalId)
      .accounts({
        executer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(manage);
  };

  const createBlockUserProposal = async (address, signer) => {
    let create = await program.methods
      .createBlockUserProposal(address)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const blacklistUser = async (proposalId, signer) => {
    // Test block user instruction
    let manage = await program.methods
      .blacklistUser(proposalId)
      .accounts({
        executer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(manage);
  };

  const createUnblockUserProposal = async (address, signer) => {
    let create = await program.methods
      .createUnblockUserProposal(address)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const unblockUser = async (proposalId, signer) => {
    // Test unblock user instruction
    let manage = await program.methods
      .unblockUser(proposalId)
      .accounts({
        executer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(manage);
  };

  const updateOwner = async (proposalId, signer) => {
    let update = await program.methods
      .updateOwner(proposalId)
      .accounts({
        executor: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(update);
  };

  const addDeployer = async (proposalId, signer) => {
    let add = await program.methods
      .addDeployer(proposalId)
      .accounts({
        executor: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(add);
  };

  const removeDeployer = async (proposalId, signer) => {
    let remove = await program.methods
      .removeDeployer(proposalId)
      .accounts({
        executor: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(remove);
  };

  const createAddAdminProposal = async (address, signer) => {
    let create = await program.methods
      .createAddAdminProposal(address)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const addAdmin = async (proposalId, signer) => {
    let create = await program.methods
      .addAdmin(proposalId)
      .accounts({
        executor: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const createRemoveAdminProposal = async (address, signer) => {
    let remove = await program.methods
      .createRemoveAdminProposal(address)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(remove);
  };

  const removeAdmin = async (proposalId, signer) => {
    let create = await program.methods
      .removeAdmin(proposalId)
      .accounts({
        executor: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const updateFees = async (params, signer) => {
    let update = await program.methods
      .updateFees(params)
      .accounts({
        authority: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(update);
  };

  const updateFeeAccount = async (newAccount, signer) => {
    let update = await program.methods
      .updateFeeAccount(newAccount)
      .accounts({
        authority: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(update);
  };

  const createTransferSolToDeployerProposal = async (params, signer) => {
    let create = await program.methods
      .createTransferSolToDeployerProposal(
        params.token,
        params.transferAmount,
        params.deployerAddress
      )
      .accounts({
        metadata: metadataAddress,
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const createTransferSolToCreatorProposal = async (token, amount, signer) => {
    let create = await program.methods
      .createTransferSolToCreatorProposal(token, amount)
      .accounts({
        metadata: metadataAddress,
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const createAddDeployerProposal = async (address, signer) => {
    let create = await program.methods
      .createAddDeployerProposal(address)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const createRemoveDeployerProposal = async (address, signer) => {
    let create = await program.methods
      .createRemoveDeployerProposal(address)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const createPublishToAmmProposal = async (token, feePercent, signer) => {
    let create = await program.methods
      .createPublishToAmmProposal(token, feePercent)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const createRemoveLiquidityProposal = async (token, percent, signer) => {
    let create = await program.methods
      .createRemoveLiquidityProposal(token, percent)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const createBlockDaoProposal = async (token, signer) => {
    let create = await program.methods
      .createBlockDaoProposal(token)
      .accounts({
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(create);
  };

  const approveProposal = async (proposalId, signer) => {
    let approve = await program.methods
      .approveProposal(proposalId)
      .accounts({
        approver: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(approve);
  };

  const rejectProposal = async (proposalId, signer) => {
    let reject = await program.methods
      .rejectProposal(proposalId)
      .accounts({
        approver: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(reject);
  };

  const isAdmin = async (address): Promise<boolean> => {
    return await program.methods.isAdmin(address).view();
  };

  const isSubAdmin = async (address): Promise<boolean> => {
    return await program.methods.isSubAdmin(address).view();
  };

  it("Fund: Initialize test accounts", async () => {
    // Airdrop sol to the test users
    let adminSol = await provider.connection.requestAirdrop(
      admin.publicKey,
      2500 * LAMPORTS_PER_SOL
    );
    await confirmTransaction(adminSol);

    let payerSol = await provider.connection.requestAirdrop(
      payer.publicKey,
      LAMPORTS_PER_SOL
    );
    await confirmTransaction(payerSol);

    let user1Sol = await provider.connection.requestAirdrop(
      user1.publicKey,
      10000 * LAMPORTS_PER_SOL
    );
    await confirmTransaction(user1Sol);

    let user2Sol = await provider.connection.requestAirdrop(
      user2.publicKey,
      10000 * LAMPORTS_PER_SOL
    );
    await confirmTransaction(user2Sol);

    let user3Sol = await provider.connection.requestAirdrop(
      user3.publicKey,
      10000 * LAMPORTS_PER_SOL
    );
    await confirmTransaction(user3Sol);

    let user4Sol = await provider.connection.requestAirdrop(
      user4.publicKey,
      10000 * LAMPORTS_PER_SOL
    );
    await confirmTransaction(user4Sol);

    let mintAuthoritySol = await provider.connection.requestAirdrop(
      mintAuthority.publicKey,
      LAMPORTS_PER_SOL
    );
    await confirmTransaction(mintAuthoritySol);

    let creatorSol = await provider.connection.requestAirdrop(
      creator.publicKey,
      LAMPORTS_PER_SOL
    );
    await confirmTransaction(creatorSol);

    let creator1Sol = await provider.connection.requestAirdrop(
      creator1.publicKey,
      LAMPORTS_PER_SOL
    );
    await confirmTransaction(creator1Sol);

    let deployerSol = await provider.connection.requestAirdrop(
      deployer.publicKey,
      LAMPORTS_PER_SOL
    );
    await confirmTransaction(deployerSol);

    let ownerSol = await provider.connection.requestAirdrop(
      owner.publicKey,
      LAMPORTS_PER_SOL
    );
    await confirmTransaction(ownerSol);

    let feesCollectionAccountSol = await provider.connection.requestAirdrop(
      feesCollectionAccount.publicKey,
      LAMPORTS_PER_SOL
    );
    await confirmTransaction(feesCollectionAccountSol);
  });

  it("Fund: Initialize global account", async () => {
    [pdaGlobalConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [GLOBAL_CONFIG],
      program.programId
    );
    fundGlobalConfig = pdaGlobalConfig;

    [pdaDaoList] = anchor.web3.PublicKey.findProgramAddressSync(
      [DAO],
      program.programId
    );

    // Test initialize instruction
    let init = await program.methods
      .init(feesCollectionAccount.publicKey)
      .accounts({
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(init);

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.equal(globalConfig.owner.toString(), admin.publicKey.toString());
    assert.isTrue(
      JSON.stringify(globalConfig.admins).includes(
        JSON.stringify(admin.publicKey)
      )
    );

    let daoList = await program.account.daoList.fetch(pdaDaoList);
    console.log(daoList);
  });

  it("Fund: Test wheather the given account has admin rights or not", async () => {
    assert.isTrue(await isAdmin(admin.publicKey));
  });

  it("Fund: Test wheather the given account has sub-admin rights or not", async () => {
    assert.isTrue(await isSubAdmin(admin.publicKey));
  });

  it("Fund: Initialize Creators", async () => {
    [pdaCreators] = anchor.web3.PublicKey.findProgramAddressSync(
      [CREATOR],
      program.programId
    );

    await initCreators();
  });

  it("Fund: Initialize Multisig", async () => {
    [pdaProposalList] = anchor.web3.PublicKey.findProgramAddressSync(
      [PROPOSAL],
      program.programId
    );

    await initMultisig();
  });

  it("Fund: Test Get Tokens", async () => {
    let tokens = await provider.connection.getTokenAccountsByOwner(
      user1.publicKey,
      { programId: TOKEN_PROGRAM_ID }
    );
    // console.log(tokens);

    let accounts = await provider.connection.getProgramAccounts(
      program.programId
    );
    // console.log(accounts);
  });

  it("Fund: Test Add Creators", async () => {
    let params = {
      address: creator.publicKey,
      feePercent: 0,
    };

    // Test adding creator
    await addCreator(params, admin);

    let creators = await program.account.creators.fetch(pdaCreators);
    assert.isTrue(
      creators.creators.some(
        (cr) => cr.address.toString() === creator.publicKey.toString()
      )
    );

    params = {
      address: user1.publicKey,
      feePercent: 0,
    };

    // Test adding creator
    await addCreator(params, admin);

    creators = await program.account.creators.fetch(pdaCreators);
    assert.isTrue(
      creators.creators.some(
        (cr) => cr.address.toString() === user1.publicKey.toString()
      )
    );

    params = {
      address: creator1.publicKey,
      feePercent: 0,
    };

    // Test adding creator
    await addCreator(params, admin);

    creators = await program.account.creators.fetch(pdaCreators);
    assert.isTrue(
      creators.creators.some(
        (cr) => cr.address.toString() === creator1.publicKey.toString()
      )
    );

    params = {
      address: creator.publicKey,
      feePercent: 0,
    };

    // Test invalid authority
    try {
      await addCreator(params, payer);

      assert.fail("Should throw Unauthorized error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });

  it("Fund: Test Create Dao", async () => {
    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TOKEN_BUFFER],
      program.programId
    );

    [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
      [FUND_DATA, mintAccount.toBuffer()],
      program.programId
    );

    [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [METADATA, TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintAccount.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    );

    let params = {
      name: TOKEN,
      symbol: "tes",
      uri: "https://arweave.net/dEGah51x5Dlvbfcl8UUGz52KovgWh6QmrYIW48hi244?ext=png",
      fundraisingGoal: new BN("2000").mul(new BN(LAMPORTS_PER_SOL)),
      amount: new BN("1000000000").mul(
        new BN(Math.pow(10, DECIMALS).toString())
      ),
      decimals: DECIMALS,
      vestingPercent: {
        firstClaim: 20000000, // 20%
        dailyClaim: 2000000, // 2%
      },
    };

    await createDao(params, creator);

    let daoList = await program.account.daoList.fetch(pdaDaoList);
    assert.isTrue(
      JSON.stringify(daoList.tokens).includes(JSON.stringify(params.name))
    );

    let fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    assert.equal(Number(fundStore.endDate), Number(0));
    assert.equal(
      Number(fundStore.fundraisingGoal),
      Number(params.fundraisingGoal)
    );
    console.log(Number(fundStore.tokensPerSol));
    let status = { created: {} };
    assert.equal(fundStore.status.toString(), status.toString());
    assert.equal(fundStore.feePercent, 0);

    [pdaCreatorInfo] = anchor.web3.PublicKey.findProgramAddressSync(
      [CREATOR, creator.publicKey.toBuffer()],
      program.programId
    );

    let creatorInfo = await program.account.creatorInfo.fetch(pdaCreatorInfo);
    assert.equal(creatorInfo.token, TOKEN);
    assert.equal(creatorInfo.feePercent, 0);

    // Creating another token
    params = {
      name: TEST_1_TOKEN,
      symbol: "tes",
      uri: "https://arweave.net/dEGah51x5Dlvbfcl8UUGz52KovgWh6QmrYIW48hi244?ext=png",
      fundraisingGoal: new BN("2000").mul(new BN(LAMPORTS_PER_SOL)),
      amount: new BN("1000000000").mul(
        new BN(Math.pow(10, DECIMALS).toString())
      ),
      decimals: DECIMALS,
      vestingPercent: {
        firstClaim: 20000000, // 20%
        dailyClaim: 2000000, // 2%
      },
    };

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST_1_BUFFER],
      program.programId
    );

    [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
      [FUND_DATA, mintAccount.toBuffer()],
      program.programId
    );

    [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [METADATA, TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintAccount.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    );

    await createDao(params, creator1);

    daoList = await program.account.daoList.fetch(pdaDaoList);
    assert.isTrue(
      JSON.stringify(daoList.tokens).includes(JSON.stringify(params.name))
    );

    fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    assert.equal(Number(fundStore.endDate), Number(0));
    assert.equal(
      Number(fundStore.fundraisingGoal),
      Number(params.fundraisingGoal)
    );
    console.log(Number(fundStore.tokensPerSol));
    assert.equal(fundStore.status.toString(), status.toString());
    assert.equal(fundStore.feePercent, 0);

    [pdaCreatorInfo] = anchor.web3.PublicKey.findProgramAddressSync(
      [CREATOR, creator1.publicKey.toBuffer()],
      program.programId
    );

    creatorInfo = await program.account.creatorInfo.fetch(pdaCreatorInfo);
    assert.equal(creatorInfo.token, TEST_1_TOKEN);
    assert.equal(creatorInfo.feePercent, 0);

    params = {
      name: TEST_4_TOKEN,
      symbol: "tes",
      uri: "https://arweave.net/dEGah51x5Dlvbfcl8UUGz52KovgWh6QmrYIW48hi244?ext=png",
      fundraisingGoal: new BN("2000").mul(new BN(LAMPORTS_PER_SOL)),
      amount: new BN("1000000000").mul(
        new BN(Math.pow(10, DECIMALS).toString())
      ),
      decimals: DECIMALS,
      vestingPercent: {
        firstClaim: 20000000, // 20%
        dailyClaim: 2000000, // 2%
      },
    };

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST_4_BUFFER],
      program.programId
    );

    [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
      [FUND_DATA, mintAccount.toBuffer()],
      program.programId
    );

    [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [METADATA, TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintAccount.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    );

    await createDao(params, creator);

    daoList = await program.account.daoList.fetch(pdaDaoList);
    assert.isTrue(
      JSON.stringify(daoList.tokens).includes(JSON.stringify(params.name))
    );

    fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    assert.equal(Number(fundStore.endDate), Number(0));
    assert.equal(
      Number(fundStore.fundraisingGoal),
      Number(params.fundraisingGoal)
    );
    console.log(Number(fundStore.tokensPerSol));
    assert.equal(fundStore.status.toString(), status.toString());
    assert.equal(fundStore.feePercent, 0);

    [pdaCreatorInfo] = anchor.web3.PublicKey.findProgramAddressSync(
      [CREATOR, creator.publicKey.toBuffer()],
      program.programId
    );

    creatorInfo = await program.account.creatorInfo.fetch(pdaCreatorInfo);
    assert.equal(creatorInfo.token, TEST_4_TOKEN);
    assert.equal(creatorInfo.feePercent, 0);
  });

  it("Fund: Test Create Dao with other than creator account", async () => {
    let params = {
      name: TEST_2_TOKEN,
      symbol: "tes",
      uri: "https://arweave.net/dEGah51x5Dlvbfcl8UUGz52KovgWh6QmrYIW48hi244?ext=png",
      fundraisingGoal: new BN("2000").mul(new BN(LAMPORTS_PER_SOL)),
      decimals: DECIMALS,
      amount: new BN("1000000000").mul(
        new BN(Math.pow(10, DECIMALS).toString())
      ),
      vestingPercent: {
        firstClaim: 20000000, // 20%
        dailyClaim: 2000000, // 2%
      },
    };

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST_2_BUFFER],
      program.programId
    );

    [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [METADATA, TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintAccount.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    );

    try {
      await createDao(params, payer);

      assert.fail(
        "Expected an AccountNotInitialized error, but no error was thrown."
      );
    } catch (err) {
      assert.equal(
        err.error.errorCode.code,
        "AccountNotInitialized",
        "The program expected this account to be already initialized"
      );
    }
  });

  it("Fund: Initialize Users with creator account", async () => {
    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TOKEN_BUFFER],
      program.programId
    );

    [pdaUsers] = anchor.web3.PublicKey.findProgramAddressSync(
      [USERS, mintAccount.toBuffer()],
      program.programId
    );

    await initUsers(TOKEN, creator);
  });

  it("Fund: Test Manage Users with non creator account", async () => {
    let params = {
      token: TOKEN,
      userType: { vip: {} },
      manageType: { add: {} },
      users: [
        {
          address: user1.publicKey,
          maxAllowableAmount: new BN(10 * LAMPORTS_PER_SOL),
        },
        {
          address: user2.publicKey,
          maxAllowableAmount: new BN(8 * LAMPORTS_PER_SOL),
        },
      ],
    };

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TOKEN_BUFFER],
      fundProgramId
    );

    [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [METADATA, TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintAccount.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    );

    try {
      await manageUsers(params, payer);

      assert.fail("Expected an Unauthorized error, but no error was thrown.");
    } catch (err) {
      assert.equal(
        err.error.errorCode.code,
        "Unauthorized",
        "Unexpected error code"
      );
    }
  });

  it("Fund: Test Add Vip Users", async () => {
    let params = {
      token: TOKEN,
      userType: { vip: {} },
      manageType: { add: {} },
      users: [
        {
          address: user1.publicKey,
          maxAllowableAmount: new BN(10 * LAMPORTS_PER_SOL),
        },
        {
          address: user2.publicKey,
          maxAllowableAmount: new BN(8 * LAMPORTS_PER_SOL),
        },
      ],
    };

    await manageUsers(params, creator);

    let users = await program.account.users.fetch(pdaUsers);
    assert.isTrue(
      JSON.stringify(users.vip).includes(JSON.stringify(user1.publicKey))
    );
    assert.isTrue(
      JSON.stringify(users.vip).includes(JSON.stringify(user2.publicKey))
    );
  });

  it("Fund: Test Remove Vip Users", async () => {
    let params = {
      token: TOKEN,
      userType: { vip: {} },
      manageType: { remove: {} },
      users: [
        {
          address: user2.publicKey,
          maxAllowableAmount: new BN(0),
        },
      ],
    };

    await manageUsers(params, creator);

    let users = await program.account.users.fetch(pdaUsers);
    assert.isFalse(
      JSON.stringify(users.vip).includes(JSON.stringify(user2.publicKey))
    );
  });

  it("Fund: Test Add Party Users", async () => {
    let params = {
      token: TOKEN,
      userType: { party: {} },
      manageType: { add: {} },
      users: [
        {
          address: user3.publicKey,
          maxAllowableAmount: new BN(10 * LAMPORTS_PER_SOL),
        },
        {
          address: user4.publicKey,
          maxAllowableAmount: new BN(8 * LAMPORTS_PER_SOL),
        },
      ],
    };

    await manageUsers(params, creator);

    let users = await program.account.users.fetch(pdaUsers);
    assert.isTrue(
      JSON.stringify(users.party).includes(JSON.stringify(user3.publicKey))
    );
    assert.isTrue(
      JSON.stringify(users.party).includes(JSON.stringify(user4.publicKey))
    );

    // Trying to add duplicate users
    params = {
      token: TOKEN,
      userType: { party: {} },
      manageType: { add: {} },
      users: [
        {
          address: user3.publicKey,
          maxAllowableAmount: new BN(10 * LAMPORTS_PER_SOL),
        },
      ],
    };

    try {
      await manageUsers(params, creator);

      assert.fail("Expected an DuplicateUser error, but no error was thrown.");
    } catch (err) {
      assert.equal(
        err.error.errorCode.code,
        "DuplicateUser",
        "Unexpected error code"
      );
    }
  });

  it("Fund: Test Remove Party Users", async () => {
    let params = {
      token: TOKEN,
      userType: { party: {} },
      manageType: { remove: {} },
      users: [
        {
          address: user3.publicKey,
          maxAllowableAmount: new BN(0),
        },
        {
          address: user4.publicKey,
          maxAllowableAmount: new BN(0),
        },
      ],
    };

    await manageUsers(params, creator);

    let users = await program.account.users.fetch(pdaUsers);
    assert.isFalse(
      JSON.stringify(users.party).includes(JSON.stringify(user2.publicKey))
    );
  });

  it("Fund: Test Update Status with non creator account", async () => {
    [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
      [FUND_DATA, mintAccount.toBuffer()],
      program.programId
    );

    let params = {
      token: TOKEN,
      status: { fundraisingVip: {} },
    };

    try {
      await updateStatus(params, payer);

      assert.fail("Expected an Unauthorized error, but no error was thrown.");
    } catch (err) {
      assert.equal(
        err.error.errorCode.code,
        "Unauthorized",
        "Unexpected error code"
      );
    }
  });

  it("Fund: Test Init Commitments", async () => {
    [pdaCommitments] = anchor.web3.PublicKey.findProgramAddressSync(
      [COMMITMENT, mintAccount.toBuffer()],
      program.programId
    );

    [pdaEscrowSolAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [ESCROW, SOL, mintAccount.toBuffer()],
      program.programId
    );

    await initCommitment(TOKEN);
  });

  it("Fund: Test Start Dao", async () => {
    await startDao(TOKEN, admin);

    let fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    let expected = {
      status: { fundraisingVip: {} },
      date: Math.floor(Date.now() / 1000),
    };
    assert.equal(fundStore.status.toString(), expected.status.toString());
    assert.equal(
      Math.floor(Number(fundStore.startDate) / 100),
      Math.floor(Number(expected.date) / 100)
    );
  });

  it("Fund: Test Start Party Round", async () => {
    await startPartyRound(TOKEN, creator);

    let fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    let expectedStatus = { fundraisingParty: {} };
    assert.equal(fundStore.status.toString(), expectedStatus.toString());
  });

  it("Fund: Test Commitment", async () => {
    let usersParams = {
      token: TOKEN,
      userType: { vip: {} },
      manageType: { add: {} },
      users: [
        {
          address: user2.publicKey,
          maxAllowableAmount: new BN(8 * LAMPORTS_PER_SOL),
        },
      ],
    };

    await manageUsers(usersParams, creator);

    let solAmount = new BN(1 * LAMPORTS_PER_SOL);

    let escrowSolAccountBalanceBefore = await provider.connection.getBalance(
      pdaEscrowSolAccount
    );

    let fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    let commitments = await program.account.commitments.fetch(pdaCommitments);
    let commitedSolsBefore = Number(commitments.totalCommitedSols);
    await commitment(TOKEN, solAmount, user1, feesCollectionAccount.publicKey);

    let escrowSolAccountBalanceAfter = await provider.connection.getBalance(
      pdaEscrowSolAccount
    );
    assert.equal(
      escrowSolAccountBalanceAfter - escrowSolAccountBalanceBefore,
      Number(solAmount)
    );

    commitments = await program.account.commitments.fetch(pdaCommitments);
    let commitedSolsAfter = Number(commitments.totalCommitedSols);
    // assert.isTrue(
    //   JSON.stringify(commitments.commiters).includes(
    //     JSON.stringify({
    //       address: user1.publicKey,
    //       solAmount,
    //       tokenAmount: new BN(
    //         Number(solAmount) * Number(fundStore.tokensPerSol)
    //       ),
    //       lastClaimedAt: null,
    //       amountClaimed: new BN(0),
    //     })
    //   )
    // );
    assert.equal(commitedSolsAfter, commitedSolsBefore + Number(solAmount));

    solAmount = new BN(5 * LAMPORTS_PER_SOL);
    await commitment(TOKEN, solAmount, user2, feesCollectionAccount.publicKey);

    let escrowSolAccountBalanceLater = await provider.connection.getBalance(
      pdaEscrowSolAccount
    );
    assert.equal(
      escrowSolAccountBalanceLater - escrowSolAccountBalanceAfter,
      Number(solAmount)
    );

    commitments = await program.account.commitments.fetch(pdaCommitments);
    let commitedSolsLater = Number(commitments.totalCommitedSols);
    // assert.isTrue(
    //   JSON.stringify(commitments.commiters).includes(
    //     JSON.stringify({
    //       address: user2.publicKey,
    //       solAmount: solAmount,
    //       tokenAmount: new BN(
    //         Number(solAmount) * Number(fundStore.tokensPerSol)
    //       ),
    //       lastClaimedAt: null,
    //       amountClaimed: new BN(0),
    //     })
    //   )
    // );
    assert.equal(commitedSolsLater, commitedSolsAfter + Number(solAmount));

    // Commiting from ineligible user
    try {
      await commitment(
        TOKEN,
        solAmount,
        payer,
        feesCollectionAccount.publicKey
      );

      assert.fail("Should throw InEligible error");
    } catch (err) {
      assert.include(err.message, "InEligible");
    }

    // Commiting with other fee account user
    try {
      await commitment(TOKEN, solAmount, user1, payer.publicKey);

      assert.fail("Should throw UnknownFeeAccount error");
    } catch (err) {
      assert.include(err.message, "UnknownFeeAccount");
    }

    // Commiting with lesser than max allowable commit amount
    solAmount = new BN(8 * LAMPORTS_PER_SOL);
    try {
      await commitment(
        TOKEN,
        solAmount,
        user1,
        feesCollectionAccount.publicKey
      );

      assert.fail("Should throw CommitAmountExceeded error");
    } catch (err) {
      assert.include(err.message, "CommitAmountExceeded");
    }
  });

  it("Fund: Test Mint Token", async () => {
    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TOKEN_BUFFER],
      program.programId
    );

    [pdaEscrowMintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [ESCROW, MINT, mintAccount.toBuffer()],
      program.programId
    );

    escrowMintAta = anchor.utils.token.associatedAddress({
      mint: mintAccount,
      owner: pdaEscrowMintAccount,
    });

    [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
      [FUND_DATA, mintAccount.toBuffer()],
      program.programId
    );

    let params = {
      token: TOKEN,
      amount: MINT_AMOUNT,
    };

    await mint(params, creator);

    // Check balance after mint
    let supply = await provider.connection.getTokenSupply(mintAccount);
    assert.equal(Number(supply.value.amount), Number(MINT_AMOUNT));

    let pdaEscrowMintAtaTokenBalance = (
      await getAccount(provider.connection, escrowMintAta)
    ).amount;
    assert.equal(Number(pdaEscrowMintAtaTokenBalance), Number(MINT_AMOUNT));

    // Minting Token Test-1
    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST_1_BUFFER],
      program.programId
    );

    [pdaEscrowMintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [ESCROW, MINT, mintAccount.toBuffer()],
      program.programId
    );

    escrowMintAta = anchor.utils.token.associatedAddress({
      mint: mintAccount,
      owner: pdaEscrowMintAccount,
    });

    [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
      [FUND_DATA, mintAccount.toBuffer()],
      program.programId
    );

    params = {
      token: TEST_1_TOKEN,
      amount: MINT_AMOUNT,
    };

    try {
      await mint(params, creator1);

      assert.fail("Should throw NoOutstandingTokenToMint error");
    } catch (err) {
      assert.include(err.message, "NoOutstandingTokenToMint");
    }
  });

  it("Fund: Test Claim when token status is neither FundraiseSuccess nor FundraiseFail", async () => {
    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TOKEN_BUFFER],
      program.programId
    );

    [pdaEscrowMintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [ESCROW, MINT, mintAccount.toBuffer()],
      program.programId
    );

    escrowMintAta = anchor.utils.token.associatedAddress({
      mint: mintAccount,
      owner: pdaEscrowMintAccount,
    });

    [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
      [FUND_DATA, mintAccount.toBuffer()],
      program.programId
    );

    let payerAta = await getAssociatedTokenAddress(
      mintAccount,
      payer.publicKey
    );

    try {
      await claim(TOKEN, payer, feesCollectionAccount.publicKey);

      assert.fail("Should throw PermissionDenied error");
    } catch (err) {
      assert.include(err.message, "PermissionDenied");
    }
  });

  it("Fund: Test End Dao", async () => {
    await endDao(TOKEN, admin);

    let fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    let expected = {
      status: { fundraisingFail: {} },
      date: Math.floor(Date.now() / 1000),
    };
    assert.equal(fundStore.status.toString(), expected.status.toString());
    assert.equal(
      Math.floor(Number(fundStore.endDate) / 100),
      Math.floor(Number(expected.date) / 100)
    );
  });

  it("Fund: Test Claim when fundraise is not met", async () => {
    let user1Ata = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey
    );

    let commitments = await program.account.commitments.fetch(pdaCommitments);

    await claim(TOKEN, user1, feesCollectionAccount.publicKey);

    // user1 is removed from commiters' list
    commitments = await program.account.commitments.fetch(pdaCommitments);
    assert.isFalse(
      commitments.commiters.some(
        (committer) => committer.address === user1.publicKey
      )
    );

    let user2Ata = await getAssociatedTokenAddress(
      mintAccount,
      user2.publicKey
    );

    await claim(TOKEN, user2, feesCollectionAccount.publicKey);

    // user2 is removed from commiters' list
    commitments = await program.account.commitments.fetch(pdaCommitments);
    assert.isFalse(
      commitments.commiters.some(
        (committer) => committer.address === user2.publicKey
      )
    );

    // Commiting with other fee account user
    try {
      await claim(TOKEN, user1, payer.publicKey);

      assert.fail("Should throw UnknownFeeAccount error");
    } catch (err) {
      assert.include(err.message, "UnknownFeeAccount");
    }
  });

  it("Fund: Test Create transfer sol to deployer proposal with random user", async () => {
    let params = {
      token: TOKEN,
      transferAmount: new BN(1 * Math.pow(10, DECIMALS)),
      deployerAddress: deployer.publicKey,
    };

    try {
      await createTransferSolToDeployerProposal(params, payer);

      assert.fail("Should throw Unauthorised error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });

  it("Fund: Test Create transfer sol to deployer proposal", async () => {
    // Update status = fundraisingSuccess
    let updateParams = {
      token: TOKEN,
      status: { fundraisingSuccess: {} },
    };

    await updateStatus(updateParams, creator);

    let params = {
      token: TOKEN,
      transferAmount: new BN(1 * Math.pow(10, DECIMALS)),
      deployerAddress: deployer.publicKey,
    };

    await createTransferSolToDeployerProposal(params, creator);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test create same proposal", async () => {
    let params = {
      token: TOKEN,
      transferAmount: new BN(1 * Math.pow(10, DECIMALS)),
      deployerAddress: deployer.publicKey,
    };

    try {
      await createTransferSolToDeployerProposal(params, creator);

      assert.fail("Should throw DuplicateProposal error");
    } catch (err) {
      assert.include(err.message, "DuplicateProposal");
    }
  });

  it("Fund: Test transfer sol to deployer when proposal is not approved", async () => {
    let params = {
      token: TOKEN,
      proposalId: currentProposalId,
    };

    try {
      await transferSolToDeployer(params, creator, user1.publicKey);

      assert.fail("Should throw NotApproved error");
    } catch (err) {
      assert.include(err.message, "NotApproved");
    }
  });

  it("Fund: Test Claim when fundraise is met", async () => {
    let solAmount = new BN(2 * LAMPORTS_PER_SOL);
    await commitment(TOKEN, solAmount, user1, feesCollectionAccount.publicKey);

    await commitment(TOKEN, solAmount, user2, feesCollectionAccount.publicKey);

    let user1Ata = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey
    );

    let commitments = await program.account.commitments.fetch(pdaCommitments);
    for (const commiter of commitments.commiters) {
      console.log({
        address: commiter.address.toBase58(),
        solAmount: Number(commiter.solAmount),
        tokenAmount: Number(commiter.tokenAmount),
        lastClaimDate: Number(commiter.lastClaimedAt),
        amountClaimed: Number(commiter.amountClaimed),
      });
    }

    let user1TokenBalanceBefore = Number(
      (await getAccount(provider.connection, user1Ata)).amount
    );

    await claim(TOKEN, user1, feesCollectionAccount.publicKey);

    let user1TokenBalanceAfter = Number(
      (await getAccount(provider.connection, user1Ata)).amount
    );
    console.log(user1TokenBalanceBefore, user1TokenBalanceAfter);

    // user1 is removed from commiters' list
    commitments = await program.account.commitments.fetch(pdaCommitments);
    for (const commiter of commitments.commiters) {
      console.log({
        address: commiter.address.toBase58(),
        solAmount: Number(commiter.solAmount),
        tokenAmount: Number(commiter.tokenAmount),
        lastClaimDate: Number(commiter.lastClaimedAt),
        amountClaimed: Number(commiter.amountClaimed),
      });
    }

    await claim(TOKEN, user1, feesCollectionAccount.publicKey);
    commitments = await program.account.commitments.fetch(pdaCommitments);
    console.log("=".repeat(100));
    for (const commiter of commitments.commiters) {
      console.log({
        address: commiter.address.toBase58(),
        solAmount: Number(commiter.solAmount),
        tokenAmount: Number(commiter.tokenAmount),
        lastClaimDate: Number(commiter.lastClaimedAt),
        amountClaimed: Number(commiter.amountClaimed),
      });
    }
    console.log("=".repeat(100));

    assert.isFalse(
      commitments.commiters.some(
        (committer) => committer.address === user1.publicKey
      )
    );

    let user2Ata = await getAssociatedTokenAddress(
      mintAccount,
      user2.publicKey
    );

    let user2TokenBalanceBefore = Number(
      (await getAccount(provider.connection, user2Ata)).amount
    );

    await claim(TOKEN, user2, feesCollectionAccount.publicKey);

    let user2TokenBalanceAfter = Number(
      (await getAccount(provider.connection, user2Ata)).amount
    );
    console.log(user2TokenBalanceBefore, user2TokenBalanceAfter);
  });

  it("Fund: Test Burn Token", async () => {
    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TOKEN_BUFFER],
      program.programId
    );

    [pdaEscrowMintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [ESCROW, MINT, mintAccount.toBuffer()],
      program.programId
    );

    escrowMintAta = anchor.utils.token.associatedAddress({
      mint: mintAccount,
      owner: pdaEscrowMintAccount,
    });

    [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
      [FUND_DATA, mintAccount.toBuffer()],
      program.programId
    );

    let params = {
      token: TOKEN,
      amount: BURN_AMOUNT,
    };

    let user1Ata = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey
    );

    let supplyBefore = Number(
      (await provider.connection.getTokenSupply(mintAccount)).value.amount
    );

    let user1TokenBalanceBefore = Number(
      (await getAccount(provider.connection, user1Ata)).amount
    );

    await burn(params, user1, user1Ata);

    // Check balance after burn
    let supplyAfter = Number(
      (await provider.connection.getTokenSupply(mintAccount)).value.amount
    );
    assert.equal(supplyBefore - Number(BURN_AMOUNT), supplyAfter);

    let user1TokenBalanceAfter = Number(
      (await getAccount(provider.connection, user1Ata)).amount
    );
    assert.equal(
      user1TokenBalanceAfter,
      user1TokenBalanceBefore - Number(BURN_AMOUNT)
    );
  });

  it("Fund: Test approve transfer sols to deployer proposal with wromg deployer", async () => {
    // Test with invalid authority
    try {
      await approveProposal(currentProposalId, admin);

      assert.fail("Should throw Unauthorised error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });

  it("Fund: Test create add deployer proposal with random user", async () => {
    try {
      await createAddDeployerProposal(deployer.publicKey, payer);

      assert.fail("Should throw Unauthorised error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });

  it("Fund: Test create publish to AMM proposal", async () => {
    currentProposalId += 1;
    addLiquidityProposalId = currentProposalId;
    await createPublishToAmmProposal(TOKEN, 2, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test approve publish to AMM proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test create remove liquidity proposal", async () => {
    // Update status = trade
    let updateParams = {
      token: TOKEN,
      status: { trade: {} },
    };

    await updateStatus(updateParams, creator);
    currentProposalId += 1;
    removeLiquidityProposalId = currentProposalId;

    // Remove 50% of the liquidity
    let percent = 50000000;
    await createRemoveLiquidityProposal(TOKEN, percent, admin);

    // Update status = fundraisingSuccess
    updateParams = {
      token: TOKEN,
      status: { fundraisingSuccess: {} },
    };

    await updateStatus(updateParams, creator);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test approve remove liquidity proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test create add deployer proposal", async () => {
    currentProposalId += 1;
    await createAddDeployerProposal(deployer.publicKey, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isFalse(
      JSON.stringify(globalConfig.deployers).includes(
        JSON.stringify(deployer.publicKey)
      )
    );
  });

  it("Fund: Test approve add deployer proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isFalse(
      JSON.stringify(globalConfig.deployers).includes(
        JSON.stringify(deployer.publicKey)
      )
    );
  });

  it("Fund: Add deployer", async () => {
    await addDeployer(currentProposalId, admin);

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isTrue(
      JSON.stringify(globalConfig.deployers).includes(
        JSON.stringify(deployer.publicKey)
      )
    );

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt
      )
    );
  });

  it("Fund: Test approve transfer sols deployer proposal", async () => {
    await approveProposal(1, deployer);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === 1 &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test transfer sol to deployer with random user", async () => {
    let params = {
      token: TOKEN,
      proposalId: 1,
    };

    try {
      await transferSolToDeployer(params, payer, user1.publicKey);

      assert.fail("Should throw Unauthorised error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });

  it("Fund: Test transfer sol to deployer", async () => {
    let updateStatusParams = {
      token: TOKEN,
      status: { trade: {} },
    };

    await updateStatus(updateStatusParams, creator);

    let user1Ata = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey
    );

    let params = {
      token: TOKEN,
      proposalId: 1,
    };

    let user1BalanceBefore = Number(
      (await getAccount(provider.connection, user1Ata)).amount
    );

    await transferSolToDeployer(params, creator, deployer.publicKey);

    let user1BalanceAfter = Number(
      (await getAccount(provider.connection, user1Ata)).amount
    );
  });

  it("Fund: Create transfer sol to creator proposal", async () => {
    currentProposalId += 1;
    let amount = new BN(10 * LAMPORTS_PER_SOL);
    await createTransferSolToCreatorProposal(TOKEN, amount, creator);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test approve transfer sol to creator proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test transfer sol to creator", async () => {
    // Transfer some funds to escrow_sol_account
    // Create a transaction instruction for transferring SOL
    const tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: admin.publicKey,
        toPubkey: pdaEscrowSolAccount,
        lamports: 100 * LAMPORTS_PER_SOL, // Convert SOL to lamports
      })
    );

    // Send transaction and wait for confirmation
    await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [
      admin,
    ]);

    let params = {
      token: TOKEN,
      proposalId: currentProposalId,
    };
    await transferSolToCreator(params, admin);
  });

  it("Fund: Test create block dao proposal", async () => {
    let updateStatusParams = {
      token: TOKEN,
      status: { fundraisingVip: {} },
    };

    await updateStatus(updateStatusParams, creator);

    currentProposalId += 1;
    await createBlockDaoProposal(TOKEN, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );

    let fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    let expected = {
      status: { fundraisingVip: {} },
      date: Math.floor(Date.now() / 1000),
    };
    assert.equal(fundStore.status.toString(), expected.status.toString());
    assert.equal(
      Math.floor(Number(fundStore.endDate) / 100),
      Math.floor(Number(expected.date) / 100)
    );
  });

  it("Fund: Test approve block dao proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );

    let fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    let expected = {
      status: { fundraisingVip: {} },
      date: Math.floor(Date.now() / 1000),
    };
    assert.equal(fundStore.status.toString(), expected.status.toString());
    assert.equal(
      Math.floor(Number(fundStore.endDate) / 100),
      Math.floor(Number(expected.date) / 100)
    );
  });

  it("Fund: Test Block Dao", async () => {
    await blockDao(TOKEN, currentProposalId, admin);

    let fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    let expected = {
      status: { closed: {} },
      date: Math.floor(Date.now() / 1000),
    };
    assert.equal(fundStore.status.toString(), expected.status.toString());
    assert.equal(
      Math.floor(Number(fundStore.endDate) / 100),
      Math.floor(Number(expected.date) / 100)
    );
  });

  it("Fund: Test create block creator proposal", async () => {
    currentProposalId += 1;
    await createBlockCreatorProposal(user1.publicKey, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );

    let creators = await program.account.creators.fetch(pdaCreators);
    assert.isTrue(
      creators.creators.some(
        (cr) =>
          cr.address.toString() === user1.publicKey.toString() && !cr.isBlocked
      )
    );
  });

  it("Fund: Test approve block creator proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );

    let creators = await program.account.creators.fetch(pdaCreators);
    assert.isTrue(
      creators.creators.some(
        (cr) =>
          cr.address.toString() === user1.publicKey.toString() && !cr.isBlocked
      )
    );
  });

  it("Fund: Test Block Creators", async () => {
    // Test blocking creator
    await blacklistCreator(TOKEN, currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt
      )
    );

    let creators = await program.account.creators.fetch(pdaCreators);
    assert.isTrue(
      creators.creators.some(
        (cr) =>
          cr.address.toString() === user1.publicKey.toString() && cr.isBlocked
      )
    );
  });

  it("Fund: Test create unblock creator proposal", async () => {
    currentProposalId += 1;
    await createUnblockCreatorProposal(user1.publicKey, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );

    let creators = await program.account.creators.fetch(pdaCreators);
    assert.isTrue(
      creators.creators.some(
        (cr) =>
          cr.address.toString() === user1.publicKey.toString() && cr.isBlocked
      )
    );
  });

  it("Fund: Test approve unblock creator proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );

    let creators = await program.account.creators.fetch(pdaCreators);
    assert.isTrue(
      creators.creators.some(
        (cr) =>
          cr.address.toString() === user1.publicKey.toString() && cr.isBlocked
      )
    );
  });

  it("Fund: Test Unblock Creators", async () => {
    // Test unblocking creator
    await unblockCreator(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt
      )
    );

    let creators = await program.account.creators.fetch(pdaCreators);
    assert.isTrue(
      creators.creators.some(
        (cr) =>
          cr.address.toString() === user1.publicKey.toString() && !cr.isBlocked
      )
    );
  });

  it("Fund: Test create block user proposal", async () => {
    currentProposalId += 1;
    await createBlockUserProposal(user1.publicKey, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test approve block user proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test Block Users", async () => {
    // Test blocking user
    await blacklistUser(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt
      )
    );

    let blacklist = await program.account.blacklist.fetch(pdaBlacklist);
    assert.isTrue(
      JSON.stringify(blacklist.users).includes(JSON.stringify(user1.publicKey))
    );
  });

  it("Fund: Test create unblock user proposal", async () => {
    currentProposalId += 1;
    await createUnblockUserProposal(user1.publicKey, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );

    let blacklist = await program.account.blacklist.fetch(pdaBlacklist);
    assert.isTrue(
      JSON.stringify(blacklist.users).includes(JSON.stringify(user1.publicKey))
    );
  });

  it("Fund: Test approve unblock user proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );

    let blacklist = await program.account.blacklist.fetch(pdaBlacklist);
    assert.isTrue(
      JSON.stringify(blacklist.users).includes(JSON.stringify(user1.publicKey))
    );
  });

  it("Fund: Test Unblock Users", async () => {
    // Test unblocking user
    await unblockUser(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt
      )
    );

    let blacklist = await program.account.blacklist.fetch(pdaBlacklist);
    assert.isFalse(
      JSON.stringify(blacklist.users).includes(JSON.stringify(user1.publicKey))
    );
  });

  it("Fund: Test create block user proposal for rejection", async () => {
    currentProposalId += 1;
    await createBlockUserProposal(user1.publicKey, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test reject block user proposal", async () => {
    await rejectProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.rejected &&
          proposal.executedAt === null
      )
    );
  });

  it("Fund: Test Update Status with creator account", async () => {
    [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
      [FUND_DATA, mintAccount.toBuffer()],
      program.programId
    );

    // Update status = fundraisingVip
    let params = {
      token: TOKEN,
      status: { fundraisingVip: {} },
    };

    await updateStatus(params, creator);

    let fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    assert.equal(fundStore.status.toString(), params.status.toString());

    // Update status = FundraisingParty
    params = {
      token: TOKEN,
      status: { fundraisingParty: {} },
    };

    await updateStatus(params, creator);

    fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    assert.equal(fundStore.status.toString(), params.status.toString());

    // Update status = trade
    params = {
      token: TOKEN,
      status: { trade: {} },
    };

    await updateStatus(params, creator);

    fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    assert.equal(fundStore.status.toString(), params.status.toString());

    // Update status = expired
    params = {
      token: TOKEN,
      status: { expired: {} },
    };

    await updateStatus(params, creator);

    fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    assert.equal(fundStore.status.toString(), params.status.toString());

    // Update status = closed
    params = {
      token: TOKEN,
      status: { closed: {} },
    };

    await updateStatus(params, creator);

    fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    assert.equal(fundStore.status.toString(), params.status.toString());

    // Update status = fundraiseSuccess
    params = {
      token: TOKEN,
      status: { fundraisingSuccess: {} },
    };

    await updateStatus(params, creator);

    fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    assert.equal(fundStore.status.toString(), params.status.toString());
  });

  it("Fund: Test Add Sub Admins", async () => {
    let addSubAdmins = await program.methods
      .addSubAdminAccounts([user1.publicKey])
      .accounts({
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(addSubAdmins);

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isTrue(
      JSON.stringify(globalConfig.subAdmins).includes(
        JSON.stringify(user1.publicKey)
      )
    );
  });

  it("Fund: Test Remove Sub Admins", async () => {
    // Test valid removal
    let removeSubAdmins = await program.methods
      .removeSubAdminAccounts([user1.publicKey])
      .accounts({
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();
    await confirmTransaction(removeSubAdmins);

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isFalse(
      JSON.stringify(globalConfig.subAdmins).includes(
        JSON.stringify(user1.publicKey)
      ),
      "Sub-admin not removed"
    );

    // Test removing non-existent sub-admin
    try {
      await program.methods
        .removeSubAdminAccounts([user2.publicKey])
        .accounts({
          authority: admin.publicKey,
        })
        .signers([admin])
        .rpc();
      assert.fail("Should throw SubAdminNotFound error");
    } catch (err) {
      assert.include(err.message, "SubAdminNotFound");
    }

    // Test unauthorized removal
    try {
      await program.methods
        .removeSubAdminAccounts([admin.publicKey])
        .accounts({
          authority: user1.publicKey,
        })
        .signers([user1])
        .rpc();
      assert.fail("Should throw Unauthorized error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });

  it("Fund: Test create add admin proposal", async () => {
    currentProposalId += 1;
    await createAddAdminProposal(user4.publicKey, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isFalse(
      JSON.stringify(globalConfig.admins).includes(
        JSON.stringify(user4.publicKey)
      )
    );
  });

  it("Fund: Test approve add admin proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isFalse(
      JSON.stringify(globalConfig.admins).includes(
        JSON.stringify(user4.publicKey)
      )
    );
  });

  it("Fund: Test add admin", async () => {
    await addAdmin(currentProposalId, admin);

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isTrue(
      JSON.stringify(globalConfig.admins).includes(
        JSON.stringify(user4.publicKey)
      )
    );

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt
      )
    );
  });

  it("Fund: Test admin with other than admin account", async () => {
    // Test invalid authority
    try {
      await addAdmin(currentProposalId, payer);
      assert.fail("Should throw Unauthorized error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });

  it("Fund: Test create remove admin proposal", async () => {
    currentProposalId += 1;
    await createRemoveAdminProposal(user4.publicKey, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isTrue(
      JSON.stringify(globalConfig.admins).includes(
        JSON.stringify(user4.publicKey)
      )
    );
  });

  it("Fund: Test approve remove admin proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isTrue(
      JSON.stringify(globalConfig.admins).includes(
        JSON.stringify(user4.publicKey)
      )
    );
  });

  it("Fund: Test remove admin", async () => {
    await removeAdmin(currentProposalId, admin);

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isFalse(
      JSON.stringify(globalConfig.admins).includes(
        JSON.stringify(user4.publicKey)
      )
    );

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt
      )
    );
  });

  it("Fund: Test remove admin with other than admin account", async () => {
    // Test invalid authority
    try {
      await removeAdmin(currentProposalId, payer);
      assert.fail("Should throw Unauthorized error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });

  it("Fund: Test create remove deployer proposal", async () => {
    currentProposalId += 1;
    await createRemoveDeployerProposal(deployer.publicKey, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isTrue(
      JSON.stringify(globalConfig.deployers).includes(
        JSON.stringify(deployer.publicKey)
      )
    );
  });

  it("Fund: Test approve remove deployer proposal", async () => {
    await approveProposal(currentProposalId, admin);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isTrue(
      JSON.stringify(globalConfig.deployers).includes(
        JSON.stringify(deployer.publicKey)
      )
    );
  });

  it("Fund: Remove deployer", async () => {
    await removeDeployer(currentProposalId, admin);

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isFalse(
      JSON.stringify(globalConfig.deployers).includes(
        JSON.stringify(deployer.publicKey)
      )
    );

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt
      )
    );
  });

  it("Fund: Test create update owner proposal", async () => {
    // Adding 2 more admins for approval
    currentProposalId += 1;
    await createAddAdminProposal(user3.publicKey, admin);
    await approveProposal(currentProposalId, admin);
    await addAdmin(currentProposalId, admin);

    currentProposalId += 1;
    await createAddAdminProposal(user4.publicKey, admin);
    await approveProposal(currentProposalId, admin);
    await addAdmin(currentProposalId, admin);

    currentProposalId += 1;
    await createUpdateOwnerProposal(deployer.publicKey, user3);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.pending &&
          proposal.executedAt === null
      )
    );

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isFalse(
      JSON.stringify(globalConfig.owner).includes(
        JSON.stringify(owner.publicKey)
      )
    );
  });

  it("Fund: Test approve update owner proposal", async () => {
    await approveProposal(currentProposalId, admin);
    await approveProposal(currentProposalId, user3);
    await approveProposal(currentProposalId, user4);

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt === null
      )
    );

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isFalse(
      JSON.stringify(globalConfig.owner).includes(
        JSON.stringify(owner.publicKey)
      )
    );
  });

  it("Fund: Update owner", async () => {
    await updateOwner(currentProposalId, admin);

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.isFalse(
      JSON.stringify(globalConfig.owner).includes(
        JSON.stringify(owner.publicKey)
      )
    );

    let proposalList = await program.account.proposalsList.fetch(
      pdaProposalList
    );
    assert.isTrue(
      proposalList.proposals.some(
        (proposal) =>
          proposal.id === currentProposalId &&
          proposal.status.approved &&
          proposal.executedAt
      )
    );
  });

  it("Fund: Test Update Fees", async () => {
    let params = {
      address: creator.publicKey,
      token: TOKEN,
      feePercent: 5,
    };

    await updateFees(params, admin);

    [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
      [FUND_DATA, mintAccount.toBuffer()],
      program.programId
    );

    let fundStore = await program.account.fundDataStore.fetch(pdaFundDataStore);
    assert.equal(fundStore.feePercent, params.feePercent);
  });

  it("Fund: Test Update Fees with other account", async () => {
    let params = {
      address: creator.publicKey,
      token: TOKEN,
      feePercent: 5000000, // 5%
    };

    // Test invalid authority
    try {
      await updateFees(params, payer);

      assert.fail("Should throw Unauthorized error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });

  it("Fund: Test Update Fee Collection Account", async () => {
    await updateFeeAccount(payer.publicKey, admin);

    [pdaFeeAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [FEE],
      program.programId
    );

    let feeAccount = await program.account.feeAccount.fetch(pdaFeeAccount);
    assert.equal(
      feeAccount.feesCollectionAccount.toBase58(),
      payer.publicKey.toBase58()
    );
  });

  it("Fund: Test Update Fees with other account", async () => {
    // Test invalid authority
    try {
      await updateFeeAccount(payer.publicKey, creator);

      assert.fail("Should throw Unauthorized error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });
});

describe("Bonding Curve", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BondingCurve as Program<BondingCurve>;
  bondingCurveProgramId = program.programId;

  const confirmTransaction = async (tx) => {
    const latestBlockHash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    });
  };

  const initTrade = async () => {
    [pdaTokenReserve] = anchor.web3.PublicKey.findProgramAddressSync(
      [RESERVE, MINT, mintAccount.toBuffer()],
      program.programId
    );

    // Test init trade instruction
    let init = await program.methods
      .initTrade()
      .accounts({
        fundGlobalConfig,
        mintAccount,
        payer: deployer.publicKey,
      })
      .signers([deployer])
      .rpc();

    await confirmTransaction(init);
  };

  const addLiquidity = async () => {
    [pdaTokenReserve] = anchor.web3.PublicKey.findProgramAddressSync(
      [RESERVE, MINT, mintAccount.toBuffer()],
      program.programId
    );

    // Test add liquidity instruction
    let add = await program.methods
      .addLiquidity(addLiquidityProposalId)
      .accounts({
        fundGlobalConfig,
        creators: pdaCreators,
        escrowSolAccount: pdaEscrowSolAccount,
        fundDataStore: pdaFundDataStore,
        escrowMintAccount: pdaEscrowMintAccount,
        escrowMintAta: escrowMintAta,
        mintAccount,
        proposalsList: pdaProposalList,
        payer: deployer.publicKey,
      })
      .signers([deployer])
      .rpc();

    await confirmTransaction(add);
  };

  const getEstimatedAmount = async (amount, amountType): Promise<any> => {
    return await program.methods
      .getEstimatedAmount(amount, amountType)
      .accounts({
        mintAccount,
      })
      .view();
  };

  const removeLiquidity = async () => {
    // Test remove liquidity instruction
    let remove = await program.methods
      .removeLiquidity(removeLiquidityProposalId)
      .accounts({
        fundGlobalConfig,
        mintAccount,
        proposalsList: pdaProposalList,
        toAccount: user1.publicKey,
        authority: deployer.publicKey,
      })
      .signers([deployer])
      .rpc();

    await confirmTransaction(remove);
  };

  const buy = async (solAmount, signer, feesCollectionAccount) => {
    // Test buy tokens instruction
    let buy = await program.methods
      .buyTokens(solAmount)
      .accounts({
        mintAccount,
        blacklist: pdaBlacklist,
        feesCollectionAccount,
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(buy);
  };

  const sell = async (tokenAmount, signer, feesCollectionAccount) => {
    // Test sell tokens instruction
    let sell = await program.methods
      .sellTokens(tokenAmount)
      .accounts({
        mintAccount,
        blacklist: pdaBlacklist,
        feesCollectionAccount,
        payer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(sell);
  };

  const updateFeeAccount = async (address, signer) => {
    let update = await program.methods
      .updateFeeAccount(address)
      .accounts({
        fundGlobalConfig,
        authority: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(update);
  };

  const updateFees = async (feePercent, signer) => {
    let update = await program.methods
      .updateFees(feePercent)
      .accounts({
        fundGlobalConfig,
        mintAccount,
        authority: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(update);
  };

  it("Bonding Curve: Initialize global account", async () => {
    // Test initialize instruction
    let init = await program.methods
      .init(feesCollectionAccount.publicKey)
      .accounts({
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(init);
  });

  it("Bonding Curve: Initialize Trade", async () => {
    // Test initialize instruction
    await initTrade();
  });

  it("Bonding Curve: Test Add Liquidity", async () => {
    [bondingCurveGlobalConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [GLOBAL_CONFIG],
      program.programId
    );

    let supply = await provider.connection.getTokenSupply(mintAccount);
    console.log(supply);

    let pdaEscrowMintAtaTokenBalanceBefore = (
      await getAccount(provider.connection, escrowMintAta)
    ).amount;
    console.log(Number(pdaEscrowMintAtaTokenBalanceBefore));

    let escrowSolAccountBalanceBefore = await provider.connection.getBalance(
      pdaEscrowSolAccount
    );
    console.log(Number(escrowSolAccountBalanceBefore));

    let amount =
      2000 * LAMPORTS_PER_SOL - Number(escrowSolAccountBalanceBefore);

    // Create a transaction instruction for transferring SOL
    const tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: admin.publicKey,
        toPubkey: pdaEscrowSolAccount,
        lamports: amount, // Convert SOL to lamports
      })
    );

    // Send transaction and wait for confirmation
    await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [
      admin,
    ]);

    let escrowSolAccountBalanceAfter = await provider.connection.getBalance(
      pdaEscrowSolAccount
    );

    console.log(Number(escrowSolAccountBalanceAfter));

    await addLiquidity();

    let reserveBalance = await provider.connection.getBalance(pdaTokenReserve);

    console.log(Number(escrowSolAccountBalanceAfter));
    console.log("reserveBalance:", Number(reserveBalance));

    [pdaTrade] = anchor.web3.PublicKey.findProgramAddressSync(
      [TRADE, mintAccount.toBuffer()],
      program.programId
    );

    let trade = await program.account.trade.fetch(pdaTrade);
    console.log(Number(trade.solReserve));
    console.log(Number(trade.tokenReserve));
    console.log(Number(trade.feePercent));

    let fundStore = await fundProgram.account.fundDataStore.fetch(
      pdaFundDataStore
    );
    let expectedStatus = { trade: {} };
    assert.equal(fundStore.status.toString(), expectedStatus.toString());
  });

  it("Bonding Curve: Test get estimated sol", async () => {
    let solAmount = new BN(5 * LAMPORTS_PER_SOL);
    let amountType = { sol: {} };
    let result = await getEstimatedAmount(solAmount, amountType);
    console.log("estimated sol amount:", Number(result));
  });

  it("Bonding Curve: Test get estimated token", async () => {
    let tokenAmount = new BN("1000000000").mul(
      new BN(Math.pow(10, DECIMALS).toString())
    );
    let amountType = { token: {} };
    let result = await getEstimatedAmount(tokenAmount, amountType);
    console.log("estimated token amount:", Number(result));
  });

  it("Bonding Curve: Test Buy Tokens", async () => {
    let solAmount = new BN(5 * LAMPORTS_PER_SOL);

    await buy(solAmount, admin, feesCollectionAccount.publicKey);

    let adminAta = await getAssociatedTokenAddress(
      mintAccount,
      admin.publicKey
    );

    let adminTokenBalance = Number(
      (await getAccount(provider.connection, adminAta)).amount
    );

    console.log(adminTokenBalance);

    // Selling with other fee collection account
    try {
      await buy(solAmount, admin, payer.publicKey);

      assert.fail("Should throw UnknownFeeAccount error");
    } catch (err) {
      assert.include(err.message, "UnknownFeeAccount");
    }
  });

  it("Bonding Curve: Test Sell Tokens", async () => {
    let tokenAmount = new BN("1").mul(
      new BN(Math.pow(10, DECIMALS).toString())
    );

    await sell(tokenAmount, admin, feesCollectionAccount.publicKey);

    // Selling with other fee account user
    try {
      await sell(tokenAmount, admin, payer.publicKey);

      assert.fail("Should throw UnknownFeeAccount error");
    } catch (err) {
      assert.include(err.message, "UnknownFeeAccount");
    }
  });

  it("Bonding Curve: Test Update Fees", async () => {
    // Setting fee percent as 5%
    let feePercent = 5000000;

    await updateFees(feePercent, admin);

    [pdaTrade] = anchor.web3.PublicKey.findProgramAddressSync(
      [TRADE, mintAccount.toBuffer()],
      program.programId
    );

    let trade = await program.account.trade.fetch(pdaTrade);
    assert.equal(trade.feePercent, feePercent);
  });

  it("Bonding Curve: Test Update Fees with other account", async () => {
    let feePercent = 5000000;

    // Test invalid authority
    try {
      await updateFees(feePercent, payer);
      assert.fail("Should throw Unauthorized error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });

  it("Bonding Curve: Test Remove Liquidity", async () => {
    await removeLiquidity();
  });

  it("Bonding Curve: Test Update Fee Collection Account", async () => {
    await updateFeeAccount(payer.publicKey, admin);

    [pdaGlobalConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [GLOBAL_CONFIG],
      program.programId
    );

    let globalConfig = await program.account.globalConfig.fetch(
      pdaGlobalConfig
    );
    assert.equal(
      globalConfig.feesCollectionAccount.toBase58(),
      payer.publicKey.toBase58()
    );
  });

  it("Bonding Curve: Test Update Fees with other account", async () => {
    // Test invalid authority
    try {
      await updateFeeAccount(payer.publicKey, feesCollectionAccount);

      assert.fail("Should throw Unauthorized error");
    } catch (err) {
      assert.include(err.message, "Unauthorized");
    }
  });
});

describe("Proxy", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Proxy as Program<Proxy>;

  const confirmTransaction = async (tx) => {
    const latestBlockHash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    });
  };

  const create = async (params) => {
    [pdaCreatorInfo] = anchor.web3.PublicKey.findProgramAddressSync(
      [CREATOR, creator.publicKey.toBuffer()],
      fundProgramId
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST_3_BUFFER],
      fundProgramId
    );

    [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [METADATA, TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintAccount.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    );

    [pdaFundDataStore] = anchor.web3.PublicKey.findProgramAddressSync(
      [FUND_DATA, mintAccount.toBuffer()],
      fundProgramId
    );

    [pdaEscrowMintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [ESCROW, MINT, mintAccount.toBuffer()],
      fundProgramId
    );

    escrowMintAta = anchor.utils.token.associatedAddress({
      mint: mintAccount,
      owner: pdaEscrowMintAccount,
    });

    let create = await program.methods
      .create(params)
      .accounts({
        creators: pdaCreators,
        creatorInfo: pdaCreatorInfo,
        fundDataStore: pdaFundDataStore,
        daoList: pdaDaoList,
        mintAccount: mintAccount,
        metadata: metadataAddress,
        escrowMintAccount: pdaEscrowMintAccount,
        escrowMintAta: escrowMintAta,
        feesCollectionAccount: admin.publicKey,
        payer: creator.publicKey,
      })
      .signers([creator])
      .rpc();

    await confirmTransaction(create);
  };

  const updateStatus = async (params) => {
    // Test updateStatus instruction
    let updateStatus = await fundProgram.methods
      .updateStatus(params)
      .accounts({
        metadata: metadataAddress,
        payer: creator.publicKey,
      })
      .signers([creator])
      .rpc();

    await confirmTransaction(updateStatus);
  };

  const addLiquidity = async () => {
    let add = await program.methods
      .addLiquidity(currentProposalId)
      .accounts({
        fundGlobalConfig,
        creators: pdaCreators,
        bondingCurveGlobalConfig,
        escrowSolAccount: pdaEscrowSolAccount,
        mintAccount: mintAccount,
        trade: pdaTrade,
        fundDataStore: pdaFundDataStore,
        solReserve: pdaSolReserve,
        tokenReserve: pdaTokenReserve,
        escrowMintAccount: pdaEscrowMintAccount,
        escrowMintAta: escrowMintAta,
        proposalsList: pdaProposalList,
        payer: deployer.publicKey,
      })
      .signers([deployer])
      .rpc();

    await confirmTransaction(add);
  };

  it("Proxy: Test Create", async () => {
    let params = {
      name: TEST_3_TOKEN,
      symbol: "tar",
      decimals: DECIMALS,
      uri: "https://arweave.net/J9NcfqEeame4QcTBNKWktUYVaF7rcMtvpEiSTe9UVrEq",
      fundraisingGoal: new BN("2000").mul(new BN(LAMPORTS_PER_SOL)),
      amount: new BN("1000000000").mul(
        new BN(Math.pow(10, DECIMALS).toString())
      ),
      vestingPercent: {
        firstClaim: 20000000, // 20%
        dailyClaim: 2000000, // 2%
      },
    };

    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 300000,
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1,
    });

    const transaction = new Transaction()
      .add(modifyComputeUnits)
      .add(addPriorityFee);

    // Sign and send transaction
    await sendAndConfirmTransaction(provider.connection, transaction, [payer]);

    await create(params);
  });

  it("Proxy: Test add liquidity", async () => {
    [pdaTokenReserve] = anchor.web3.PublicKey.findProgramAddressSync(
      [RESERVE, MINT, mintAccount.toBuffer()],
      bondingCurveProgramId
    );

    [pdaSolReserve] = anchor.web3.PublicKey.findProgramAddressSync(
      [RESERVE, SOL, mintAccount.toBuffer()],
      bondingCurveProgramId
    );

    [pdaTrade] = anchor.web3.PublicKey.findProgramAddressSync(
      [TRADE, mintAccount.toBuffer()],
      bondingCurveProgramId
    );

    [pdaEscrowSolAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [ESCROW, SOL, mintAccount.toBuffer()],
      fundProgramId
    );

    let pdaEscrowMintAtaTokenBalanceBefore = (
      await getAccount(provider.connection, escrowMintAta)
    ).amount;
    console.log(Number(pdaEscrowMintAtaTokenBalanceBefore));

    let escrowSolAccountBalanceBefore = await provider.connection.getBalance(
      pdaEscrowSolAccount
    );
    console.log(Number(escrowSolAccountBalanceBefore));

    let amount = 222222222222;

    // Create a transaction instruction for transferring SOL
    const tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: admin.publicKey,
        toPubkey: pdaEscrowSolAccount,
        lamports: amount, // Convert SOL to lamports
      })
    );

    // Send transaction and wait for confirmation
    await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [
      admin,
    ]);

    let escrowSolAccountBalanceAfter = await provider.connection.getBalance(
      pdaEscrowSolAccount
    );

    console.log(Number(escrowSolAccountBalanceAfter));

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST_3_BUFFER],
      fundProgramId
    );

    [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [METADATA, TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintAccount.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    );

    let updateParams = {
      token: TEST_3_TOKEN,
      status: { fundraisingSuccess: {} },
    };

    await updateStatus(updateParams);

    currentProposalId += 1;
    let create = await fundProgram.methods
      .createPublishToAmmProposal(TEST_3_TOKEN, 2000000)
      .accounts({
        signer: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(create);

    let approve = await fundProgram.methods
      .approveProposal(currentProposalId)
      .accounts({
        approver: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(approve);

    await addLiquidity();
  });
});
