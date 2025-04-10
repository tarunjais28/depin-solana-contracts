use super::*;

pub mod add_admin;
pub mod add_deployer;
pub mod block_creator;
pub mod block_dao;
pub mod block_user;
pub mod publish_to_amm;
pub mod remove_admin;
pub mod remove_deployer;
pub mod remove_liquidity;
pub mod transfer_sol_to_creator;
pub mod trasnfer_sol_to_deployer;
pub mod unblock_creator;
pub mod unblock_user;
pub mod update_owner;

fn create_proposal(
    ctx: Context<CreateProposal>,
    proposal_type: ProposalType,
    address: Option<Pubkey>,
    approver_threshold: u8,
    dao_name: Option<String>,
    transfer_amount: Option<u64>,
    executor_type: ExecutorType,
    approve_type: ApproverType,
) -> Result<u32> {
    let proposal_id = ctx.accounts.proposals_list.proposals.len() as u32 + 1;
    let proposal = ProposalData {
        id: proposal_id,
        created_at: Clock::get()?.unix_timestamp,
        created_by: ctx.accounts.signer.key(),
        proposal_type,
        approver_threshold,
        address,
        dao_name,
        transfer_amount,
        executor_type,
        approve_type,
        executed_at: None,
        status: ProposalStatus::Pending,
        approvers: vec![],
    };

    ctx.accounts.proposals_list.add_proposal(proposal)?;

    Ok(proposal_id)
}

fn create_dao_proposal(
    ctx: Context<CreateDaoProposal>,
    proposal_type: ProposalType,
    address: Option<Pubkey>,
    approver_threshold: u8,
    dao_name: Option<String>,
    transfer_amount: Option<u64>,
    executor_type: ExecutorType,
    approver_type: ApproverType,
) -> Result<u32> {
    let proposal_id = ctx.accounts.proposals_list.proposals.len() as u32 + 1;
    let proposal = ProposalData {
        id: proposal_id,
        created_at: Clock::get()?.unix_timestamp,
        created_by: ctx.accounts.signer.key(),
        proposal_type,
        approver_threshold,
        address,
        dao_name,
        transfer_amount,
        executor_type,
        approve_type: approver_type,
        status: ProposalStatus::Pending,
        executed_at: None,
        approvers: vec![],
    };

    ctx.accounts.proposals_list.add_proposal(proposal)?;

    Ok(proposal_id)
}

fn create_creator_proposal(
    ctx: Context<CreateCreatorProposal>,
    proposal_type: ProposalType,
    address: Option<Pubkey>,
    approver_threshold: u8,
    dao_name: Option<String>,
    transfer_amount: Option<u64>,
    executor_type: ExecutorType,
    approve_type: ApproverType,
) -> Result<u32> {
    let proposal_id = ctx.accounts.proposals_list.proposals.len() as u32 + 1;
    let proposal = ProposalData {
        id: proposal_id,
        created_at: Clock::get()?.unix_timestamp,
        created_by: ctx.accounts.signer.key(),
        proposal_type,
        approver_threshold,
        address,
        dao_name,
        transfer_amount,
        executor_type,
        approve_type,
        status: ProposalStatus::Pending,
        executed_at: None,
        approvers: vec![],
    };

    ctx.accounts.proposals_list.add_proposal(proposal)?;

    Ok(proposal_id)
}
#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(
        mut,
        seeds = [GLOBAL_CONFIG_TAG],
        bump
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(
        mut,
        seeds = [PROPOSAL_TAG],
        bump,
    )]
    pub proposals_list: Account<'info, ProposalsList>,

    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(token: String)]
pub struct CreateDaoProposal<'info> {
    #[account(
        mut,
        seeds = [GLOBAL_CONFIG_TAG],
        bump
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(
        mut,
        seeds = [PROPOSAL_TAG],
        bump,
    )]
    pub proposals_list: Account<'info, ProposalsList>,

    #[account(
        mut,
        seeds = [FUND_DATA_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    #[account(
        seeds = [MINT_TAG, token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(token: String)]
pub struct CreateCreatorProposal<'info> {
    #[account(
        mut,
        seeds = [PROPOSAL_TAG],
        bump,
    )]
    pub proposals_list: Account<'info, ProposalsList>,

    /// Account storing creator information
    #[account(
        mut,
        seeds = [CREATOR_TAG],
        bump,
    )]
    pub creators: Box<Account<'info, Creators>>,

    /// CHECK: Metadata account for the token
    #[account()]
    pub metadata: Box<Account<'info, MetadataAccount>>,

    #[account(
        mut,
        seeds = [FUND_DATA_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    #[account(
        mut,
        seeds = [MINT_TAG, token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
