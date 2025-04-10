use super::*;

/// Function to blacklist creator
/// This function allows creators to add or remove VIP or Party users based on the given parameters.
///
/// # Arguments
/// * `ctx` - The program execution context containing all required accounts.
/// * `params` - Parameters specifying user management actions (user type, action type, and user list).
///
/// # Returns
/// * `Result<()>` - Returns an Ok result if successful, otherwise returns an error.
pub fn handler(ctx: Context<BlacklistCreator>, _: String, proposal_id: u32) -> Result<()> {
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
        proposal.proposal_type == ProposalType::BlockListCreator,
        CustomError::InvalidProposalType
    );
    require!(proposal.is_approved(), CustomError::NotApproved);
    require!(!proposal.is_executed(), CustomError::AlreadyExecuted);
    require!(
        global_config.is_owner(&ctx.accounts.executer.key()),
        CustomError::Unauthorized
    );
    let creator = proposal.address.ok_or(CustomError::AddressNotFound)?;

    // Block Creator
    let creators = &mut ctx.accounts.creators;
    creators.block(&creator, true);

    if matches!(
        fund_store.status,
        Status::Created
            | Status::FundraisingVip
            | Status::FundraisingParty
            | Status::FundraisingSuccess
    ) {
        fund_store.update_status(Status::FundraisingFail)?;
    }
    proposal.execution_completed()?;

    // Emit event to log the creator block action
    emit!(events::CreatorBlacklisted { creator });

    Ok(())
}

/// Struct defining the accounts required for managing users
#[derive(Accounts)]
#[instruction(token: String)]
pub struct BlacklistCreator<'info> {
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

    /// The account storing the list of creators
    #[account(
        mut,
        seeds = [CREATOR_TAG],
        bump,
    )]
    pub creators: Box<Account<'info, Creators>>,

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

    /// The executer responsible for the transaction
    #[account(mut)]
    pub executer: Signer<'info>,
}
