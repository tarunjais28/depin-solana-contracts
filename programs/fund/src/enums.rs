use super::*;

/// Update Type
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum UpdateType {
    Add,
    Remove,
    Block,
}

/// Amount Type
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum AmountType {
    Sol,
    Token,
}

/// Proposal Status
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ProposalStatus {
    Pending,
    Rejected { timestamp: i64 },
    Approved { timestamp: i64 },
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ApproverType {
    Admin,
    Deployer,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ExecutorType {
    Admin,
    Owner,
    Creator,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ProposalType {
    UpdateOwner,
    AddAdmin,
    RemoveAdmin,
    AddDeployer,
    RemoveDeployer,
    TransferSolToDeployer,
    TransferSolToCreator,
    PublishToAMM,
    RemoveLiquidity,
    BlockListDAO,
    BlockListCreator,
    UnblockCreator,
    BlocklistUser,
    UnblockUser,
}
