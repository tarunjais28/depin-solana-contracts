use super::*;

/// Function to update the fees collection account
///
/// # Arguments
/// * `ctx` - The execution context containing the global configuration and authority account
/// * `new_account` - The new public key for the fees collection account
///
/// # Returns
/// * `Result<()>` - Returns Ok(()) if successful, otherwise an error
pub fn handler(ctx: Context<UpdateGlobalConfig>, new_account: Pubkey) -> Result<()> {
    // Get a mutable reference to the global configuration account
    let global_config = &mut ctx.accounts.global_config;

    // Ensure that the caller has sub-admin rights
    has_admin_or_sub_admin_rights(
        *ctx.accounts.authority.key,
        ctx.accounts.fund.to_account_info(),
        ctx.accounts.fund_global_config.to_account_info(),
    )?;

    // Store the old fees collection account before updating
    let from = global_config.fees_collection_account;

    // Update the fees collection account with the new account provided
    global_config.fees_collection_account = new_account;

    // Emit an event to log the update of the fee collection account
    emit!(events::FeeAccountUpdated {
        from: from,      // Previous fees collection account
        to: new_account, // New fees collection account
    });

    // Return success
    Ok(())
}

/// Accounts required for the `UpdateGlobalConfig` instruction.
/// This struct defines the necessary accounts for updating the global admin.
#[derive(Accounts)]
#[instruction()]
pub struct UpdateGlobalConfig<'info> {
    /// Global configuration account that holds fee and admin-related details.
    #[account(
        mut,
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    /// CHECK: Fund's global configuration account, which stores admin and sub-admin information
    pub fund_global_config: AccountInfo<'info>,

    /// CHECK: Fund Program Address
    #[account(executable, address = fund::ID)]
    pub fund: AccountInfo<'info>,

    /// The account that is making the update request (must be the current admin).
    #[account(mut)]
    pub authority: Signer<'info>,

    /// The Solana System Program used for account updates.
    pub system_program: Program<'info, System>,
}
