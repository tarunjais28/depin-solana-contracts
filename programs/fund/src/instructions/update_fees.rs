use super::*;

/// Function to update fees in the system.
///
/// This function updates the fee percentage for a specific fund and its creator.
/// Only sub-admins are authorized to perform this operation.
///
/// # Arguments
/// * `ctx` - The execution context containing all relevant accounts.
/// * `params` - The struct containing the new fee percentage.
///
/// # Errors
/// * `CustomError::Unauthorized` - If the caller is not a sub-admin.
pub fn handler(ctx: Context<UpdateFees>, params: structs::update_fee::Params) -> Result<()> {
    let global_config = &ctx.accounts.global_config;

    // Ensure that the caller has sub-admin rights before proceeding
    require!(
        global_config.is_sub_admin(&ctx.accounts.authority.key),
        CustomError::Unauthorized
    );

    // Retrieve the fund data store and update the fee percentage
    let fund_store = &mut ctx.accounts.fund_data_store;
    let from = fund_store.fee_percent; // Store the previous fee percentage
    fund_store.fee_percent = params.fee_percent; // Update to the new fee percentage

    // Update the fee percentage for the creator as well
    let creator_info = &mut ctx.accounts.creator_info;
    creator_info.fee_percent = params.fee_percent;

    // Emit an event to notify that the fee percentage has been updated
    emit!(events::FeeUpdated {
        token: ctx.accounts.mint_account.key(),
        from: from,
        to: params.fee_percent,
    });

    Ok(())
}

/// Struct defining the accounts required for updating fees.
#[derive(Accounts)]
#[instruction(params: structs::update_fee::Params)]
pub struct UpdateFees<'info> {
    /// Global configuration account.
    /// This holds the list of sub-admins and other global settings.
    #[account(
        seeds = [GLOBAL_CONFIG_TAG],
        bump
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    /// Creator information account.
    /// This stores information about the creator, including their fee percentage.
    #[account(
        mut,
        seeds = [CREATOR_TAG, params.address.as_ref()],
        bump,
    )]
    pub creator_info: Box<Account<'info, CreatorInfo>>,

    /// Fund data store account.
    /// This account stores fundraising details, including fee percentages.
    #[account(
        mut,
        seeds = [FUND_DATA_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    /// The mint account for the associated token.
    /// This account is used to identify which token the fees apply to.
    /// CHECK: This account is only used for reference and does not require verification.
    #[account(
        seeds = [MINT_TAG, params.token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// The signer who must be a sub-admin to authorize this action.
    #[account(mut)]
    pub authority: Signer<'info>,

    /// The Solana System Program.
    pub system_program: Program<'info, System>,
}
