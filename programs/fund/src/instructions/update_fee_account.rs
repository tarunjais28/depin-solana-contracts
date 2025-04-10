use super::*;

/// Function to update the fee collection account
///
/// This function updates the `fees_collection_account` field of the `FeeAccount`.
/// It ensures that only sub-admins are authorized to perform this action.
///
/// # Arguments
/// * `ctx` - The context containing all account information
/// * `fee_collection_account` - The new fee collection account public key
///
/// # Errors
/// * `Unauthorized` - If the caller is not a sub-admin
pub fn handler(ctx: Context<UpdateFeeAccount>, fee_collection_account: Pubkey) -> Result<()> {
    let global_config = &ctx.accounts.global_config;

    // Ensure the caller has sub-admin rights
    require!(
        global_config.is_sub_admin(&ctx.accounts.authority.key),
        CustomError::Unauthorized
    );

    // Retrieve and update the fee collection account
    let fee_account = &mut ctx.accounts.fee_account;
    let from = fee_account.fees_collection_account;
    fee_account.fees_collection_account = fee_collection_account;

    // Emit an event to log the fee collection account update
    emit!(events::FeeAccountUpdated {
        from: from,
        to: fee_collection_account,
    });

    Ok(())
}

/// Account validation struct for updating the fee collection account
#[derive(Accounts)]
#[instruction()]
pub struct UpdateFeeAccount<'info> {
    /// The global configuration account storing system-wide settings
    #[account(
        seeds = [GLOBAL_CONFIG_TAG],
        bump
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    /// The fee account storing fee collection details
    #[account(
        mut,
        seeds = [FEE_TAG],
        bump
    )]
    pub fee_account: Box<Account<'info, FeeAccount>>,

    /// The authority (must be a signer) requesting the fee account update
    #[account(mut)]
    pub authority: Signer<'info>,

    /// The Solana System program account
    pub system_program: Program<'info, System>,
}
