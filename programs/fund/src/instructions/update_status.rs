use super::*;

/// Function to update the status of a fund.
///
/// This function allows a creator to update the status of a fund.
/// It ensures that only authorized creators can make this change.
///
/// # Arguments
/// * `ctx` - The execution context containing all relevant accounts.
/// * `params` - The struct containing the new status value.
///
/// # Errors
/// * `CustomError::Unauthorized` - If the caller is not an authorized creator.
/// @TODO: start_dao -> status = created -> FundraiseingVip, record start_date, caller = sub_admin
/// @TODO: move_to_party -> status = FundraiseingVip -> FundraiseingParty, caller = creater
/// @TODO: end_dao -> status = FundraiseingParty -> FundraiseingSuccess, if goal is met else FundraiseingFail, caller = sub_admin
/// @TODO: add_liquidity -> status = FundraiseingSuccess -> Trade, caller = sub_admin
/// @TODO: blocklist_dao -> status != Trade -> Closed, caller = sub_admin, admin: -> users can claim their sols back
pub fn handler(ctx: Context<UpdateStatus>, params: structs::update_status::Params) -> Result<()> {
    let creators = &ctx.accounts.creators;
    let fund_store = &mut ctx.accounts.fund_data_store;

    // TODO: @Tarun admin also should be able to update status
    // Ensure that the caller has creator rights before proceeding
    creators.is_creator(
        &ctx.accounts.payer.key(),
        ctx.accounts.metadata.creators.clone(),
    )?;

    // Update the status of the fund
    fund_store.update_status(params.status)?;

    // Emit an event to notify that the fund status has been updated
    emit!(events::UpdateStatus {
        token: params.token,
        status: params.status,
    });

    Ok(())
}

/// Struct defining the accounts required for updating the fund status.
#[derive(Accounts)]
#[instruction(params: structs::update_status::Params)]
pub struct UpdateStatus<'info> {
    /// Creators account.
    /// This stores information about the creators, including their permissions.
    #[account(
        seeds = [CREATOR_TAG],
        bump,
    )]
    pub creators: Box<Account<'info, Creators>>,

    /// Fund data store account.
    /// This account stores fundraising details, including the current status.
    #[account(
        mut,
        seeds = [FUND_DATA_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    /// The mint account associated with the DPIT token.
    /// This is only used for reference.
    /// CHECK: This account is used for identifying the token and does not require verification.
    #[account(
        seeds = [MINT_TAG, params.token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: Metadata account for the token
    #[account()]
    pub metadata: Box<Account<'info, MetadataAccount>>,

    /// The signer who must be an authorized creator to update the status.
    #[account(mut)]
    pub payer: Signer<'info>,
}
