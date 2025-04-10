use super::*;

/// Function to update the trading fee percentage
///
/// # Arguments
/// * `ctx` - The execution context containing relevant accounts
/// * `fee_percent` - The new fee percentage to be set
///
/// # Returns
/// * `Result<()>` - Returns Ok(()) if successful, otherwise an error
pub fn handler(ctx: Context<UpdateFees>, fee_percent: u32) -> Result<()> {
    // Get mutable references to the global configuration and trade accounts
    let trade = &mut ctx.accounts.trade;

    // Ensure the caller has sub-admin rights
    has_admin_or_sub_admin_rights(
        *ctx.accounts.authority.key,
        ctx.accounts.fund.to_account_info(),
        ctx.accounts.fund_global_config.to_account_info(),
    )?;

    // Store the previous fee percentage before updating
    let from = trade.fee_percent;

    // Update the trade account's fee percentage
    trade.fee_percent = fee_percent;

    // Emit an event to log the fee update
    emit!(events::FeeUpdated {
        token: ctx.accounts.mint_account.key(), // Token associated with this trade
        from,                                   // Previous fee percentage
        to: fee_percent,                        // New fee percentage
    });

    // Return success
    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct UpdateFees<'info> {
    /// CHECK: Fund's global configuration account, which stores admin and sub-admin information
    pub fund_global_config: AccountInfo<'info>,

    /// CHECK: Fund Program Address
    #[account(executable, address = fund::ID)]
    pub fund: AccountInfo<'info>,

    // Trade account, which stores trade-related details including the fee percentage
    #[account(
        mut,
        seeds = [TRADE_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub trade: Box<Account<'info, Trade>>,

    // Mint account, which represents the token mint
    #[account(mut)]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    // Authority account, which must be a signer and must have sub-admin permissions
    #[account(mut)]
    pub authority: Signer<'info>,

    // System program, required for executing system-related operations
    pub system_program: Program<'info, System>,
}
