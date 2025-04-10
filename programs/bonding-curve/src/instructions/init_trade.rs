use super::*;

/// Handles the initialization of a trade by setting up required accounts and ensuring rent is paid.
pub fn handler(ctx: Context<InitTrade>) -> Result<()> {
    // Ensure the payer has sub-admin rights before proceeding.
    // This prevents unauthorized users from initiating a trade.
    is_owner(
        *ctx.accounts.payer.key,
        ctx.accounts.fund.to_account_info(),
        ctx.accounts.fund_global_config.to_account_info(),
    )?;

    // Calculate the minimum rent-exempt balance required for the SOL reserve account.
    // This ensures the account is rent-exempt and can be used properly in future transactions.
    let rent = Rent::get()?.minimum_balance(ctx.accounts.sol_reserve.to_account_info().data_len());

    // Prepare and execute a Cross-Program Invocation (CPI) to transfer the required SOL amount.
    // This funds the SOL reserve account with enough rent to be rent-exempt.
    let cpi_accounts = system_program::Transfer {
        from: ctx.accounts.payer.to_account_info(), // SOL is transferred from the payer.
        to: ctx.accounts.sol_reserve.to_account_info(), // To the SOL reserve account.
    };

    // Execute the SOL transfer via the system program.
    system_program::transfer(
        CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts),
        rent,
    )?;

    // Reload the token reserve account to ensure its data is updated after the transaction.
    ctx.accounts.token_reserve.reload()?;

    // Emit an event to notify the system that the trade has been successfully initialized.
    emit!(events::TradeInitaited {
        token: ctx.accounts.mint_account.key(),
    });

    Ok(())
}

/// Accounts required for the `InitTrade` instruction.
/// This struct defines the necessary accounts used in the transaction.
#[derive(Accounts)]
#[instruction()]
pub struct InitTrade<'info> {
    /// CHECK: Fund's global configuration account, which stores admin and sub-admin information
    pub fund_global_config: AccountInfo<'info>,

    /// CHECK: Fund Program Address
    #[account(executable, address = fund::ID)]
    pub fund: AccountInfo<'info>,

    /// SOL reserve account, which stores SOL liquidity required for trading.
    /// CHECK: This account is used to hold the reserved SOL and must be properly funded.
    #[account(
        mut,
        seeds = [RESERVE_TAG, SOL_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub sol_reserve: AccountInfo<'info>,

    /// Token reserve account, which stores token liquidity for the trade.
    /// This is initialized if needed, ensuring there is a token reserve available.
    /// CHECK: This account holds the reserved tokens required for liquidity.
    #[account(
        init,
        seeds = [RESERVE_TAG, MINT_TAG, mint_account.key().as_ref()],
        bump,
        payer = payer,
        token::mint = mint_account, // The token reserve must match the mint account.
        token::authority = token_reserve, // The reserve itself is the authority over this account.
    )]
    pub token_reserve: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The mint account associated with the token being added to the liquidity pool.
    /// This represents the token that will be traded in the liquidity pool.
    #[account(mut)]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// The payer account, which is responsible for signing and funding the transaction.
    /// This account must be a valid signer and provide the required SOL for rent.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Token program required for token-related operations such as minting and transfers.
    pub token_program: Program<'info, Token>,

    /// System program required for system-level operations, including transferring SOL.
    /// This is needed for funding the SOL reserve account.
    pub system_program: Program<'info, System>,
}
