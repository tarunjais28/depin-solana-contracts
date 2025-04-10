use super::*;

/// The function `handler` in Rust blocks a DAO by updating its status and emitting an event, with
/// authorization and status checks.
///
/// Arguments:
///
/// * `ctx`: The `ctx` parameter in the `handler` function is of type `Context<BlockDao>`. This context
/// provides access to the accounts specified in the `BlockDao` struct, allowing the function to
/// interact with those accounts during its execution.
/// * `token`: The token name:
///
/// Returns:
///
/// The `handler` function is returning a `Result<()>`, which indicates that it can return either
/// `Ok(())` if the operation is successful or an error if there is a problem during execution.
pub fn handler(ctx: Context<BlockDao>, token: String, proposal_id: u32) -> Result<()> {
    let proposals_list = &mut ctx.accounts.proposals_list;
    let global_config = &ctx.accounts.global_config;
    let fund_store = &mut ctx.accounts.fund_data_store;

    let proposal = proposals_list
        .proposals
        .iter_mut()
        .find(|p| p.id == proposal_id);

    require!(proposal.is_some(), CustomError::NotFound);
    let proposal = proposal.unwrap();
    require!(
        proposal.proposal_type == ProposalType::BlockListDAO,
        CustomError::InvalidProposalType
    );
    require!(proposal.is_approved(), CustomError::NotApproved);
    require!(!proposal.is_executed(), CustomError::AlreadyExecuted);
    require!(
        global_config.is_owner(&ctx.accounts.payer.key()),
        CustomError::Unauthorized
    );

    fund_store.update_status(Status::Closed)?;
    proposal.execution_completed()?;

    // Emit an event to notify the system that the dao has been blacklisted
    emit!(events::DaoBlacklisted { token: token });

    Ok(())
}

/// Struct defining the accounts required for blocking the dao.
#[derive(Accounts)]
#[instruction(token: String)]
pub struct BlockDao<'info> {
    /// Reference to the global configuration account
    #[account(
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(
        mut,
        seeds = [PROPOSAL_TAG],
        bump,
    )]
    pub proposals_list: Account<'info, ProposalsList>,

    /// Fund data store account.
    /// Stores details about the fundraising process, including the current status.
    #[account(
        mut,
        seeds = [FUND_DATA_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    /// Mint account associated with the DPIT token.
    /// This is used for identifying the token related to the DAO.
    /// CHECK: This account is used for reference and does not require verification.
    #[account(
        seeds = [MINT_TAG, token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// The payer (signer) initiating the DAO start.
    /// Must be an authorized creator to perform this action.
    #[account(mut)]
    pub payer: Signer<'info>,
}
