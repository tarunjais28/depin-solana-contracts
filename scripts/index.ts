import * as fund from "./fund";
import * as proxy from "./proxy";
import * as bc from "./bc";
import * as ray from "./moveToRaydium";

const callTheFunction = async () => {
  console.log("Triggering functions , please wait !");
  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // await fund.init();
  // await fund.initCreators();
  // await fund.initMultisig();
  // await fund.addCreator();
  // await fund.initUsers();
  // await fund.createDao();
  // await fund.getFundStore();
  // await fund.getTokenBaseKeys();
  // await fund.initCommitment();
  // await fund.commitment();
  // await fund.getCommitmentList();
  // await fund.updateStatus();
  // await fund.getCreatorsList();
  // await fund.removeCreators();
  // await fund.getCreatorsList();
  // await fund.addPartyUsers();
  // await fund.addVipUsers();
  // await fund.removePartyUsers();
  // await fund.removeVipUsers();
  // await fund.getUsers();
  // await fund.addSubAdmins();
  await fund.fetchMaintainers();
  // await fund.mint();
  // await fund.fetchBalances();
  // await fund.burn();
  // await fund.claim();
  // await fund.TransferSolToDeployer();
  // await fund.transferTokens();
  // await fund.getTokenDetails();
  // await fund.getFeeAccount();
  // await fund.getCreatorInfo();
  // await fund.upgradeAccount();
  // await fund.getDAOs();
  // await fund.getDaoList();
  // await fund.createAddAdminProposal();
  // await fund.addAdmin();
  // await fund.createRemoveAdminProposal();
  // await fund.removeAdmin();
  // await fund.createAddDeployerProposal();
  // await fund.addDeployer();
  // await fund.createRemoveDeployerProposal();
  // await fund.removeDeployer();
  // await fund.getProposalList();
  // await fund.getProposalById();
  // await fund.createUpdateOwnerProposal();
  // await fund.updateOwner();
  // await fund.createBlockDaoProposal();
  // await fund.approveProposal();
  // await fund.getBlacklistedCreators();
  // await fund.getBlacklistedUsers();
  // await fund.reset();
  // await fund.getEscrowSolBalance();

  // await bc.init();
  // await bc.getPoolDetails();
  // await bc.getEstimatedSolAmount();
  // await bc.getEstimatedTokenAmount();
  // await bc.addSubAdmins();
  // await bc.fetchMaintainers();
  // await bc.initTrade();
  // await bc.addLiquidity();
  // await bc.getBaseKeys();
  // await bc.getReserveSolBalance();

  // await proxy.create();

  // await ray.createPool();

  console.log("Functions Triggered, success !");
  console.log("sent =>>>>>>>>");
  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
};

callTheFunction();

// npm start run
