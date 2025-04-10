use super::*;

/// Function to handle token purchase by exchanging SOL for tokens.
/// This function calculates applicable fees, updates reserves, and transfers tokens.
///
/// # Arguments
/// * `ctx` - The transaction context containing all necessary accounts.
/// * `sol_amount` - The amount of SOL the user wants to exchange for tokens.
///
/// # Returns
/// * `Result<()>` - Returns `Ok(())` if successful, otherwise an error.
pub fn handler(ctx: Context<Buy>, sol_amount: u64) -> Result<()> {
    // Ensure the provided SOL amount is greater than zero
    require_gt!(sol_amount, 0, CustomError::AmountCantBeZero);

    // Ensure signer is not blocked
    let cpi_accounts = fund::cpi::accounts::IsUserBlocked {
        blacklist: ctx.accounts.blacklist.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.fund.to_account_info(), cpi_accounts);
    fund::cpi::is_user_blocked(cpi_ctx, *ctx.accounts.payer.key)?;

    let trade = &mut ctx.accounts.trade;

    // Compute the transaction fee based on the trade's fee percentage
    let fees = calc_amount(sol_amount as u128, trade.fee_percent as u128);

    // If there are applicable fees, transfer them to the fee collection account
    if fees > 0 {
        let cpi_accounts = system_program::Transfer {
            from: ctx.accounts.payer.to_account_info(),
            to: ctx.accounts.fees_collection_account.to_account_info(),
        };

        system_program::transfer(
            CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts),
            fees,
        )?;
    }

    // Compute the amount of SOL available for token purchase after deducting fees
    let sol_amount_after_fee = sol_amount - fees;

    // Calculate the number of tokens the user will receive
    let token_amount = get_amount_out(
        sol_amount_after_fee as u128,
        trade.sol_reserve as u128,
        trade.token_reserve as u128,
    );

    // Update liquidity pool reserves
    trade.sol_reserve += sol_amount_after_fee;
    trade.token_reserve -= token_amount;

    // Transfer the SOL amount (after fees) from the payer to the SOL reserve account
    let cpi_accounts = system_program::Transfer {
        from: ctx.accounts.payer.to_account_info(),
        to: ctx.accounts.sol_reserve.to_account_info(),
    };

    system_program::transfer(
        CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts),
        sol_amount_after_fee,
    )?;

    // Prepare a signer for the token reserve account
    let mint_account = &ctx.accounts.mint_account.to_account_info();
    let mint_key = mint_account.key();
    let seeds = &[
        RESERVE_TAG,
        MINT_TAG,
        mint_key.as_ref(),
        &[ctx.bumps.token_reserve],
    ];
    let signer = [&seeds[..]];

    // Transfer tokens from the reserve account to the recipient's associated token account
    let cpi_accounts = Transfer {
        from: ctx.accounts.token_reserve.to_account_info(),
        to: ctx.accounts.to_ata.to_account_info(),
        authority: ctx.accounts.token_reserve.to_account_info(),
    };

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            &signer,
        ),
        token_amount,
    )?;

    // Emit an event indicating that tokens have been purchased
    emit!(events::TokensBought {
        token: mint_key,
        by: ctx.accounts.payer.key(),
        amount: token_amount,
    });

    Ok(())
}

/// Accounts required for the `Buy` instruction.
/// This struct defines the necessary accounts used in the transaction.
#[derive(Accounts)]
#[instruction()]
pub struct Buy<'info> {
    /// Global configuration account that holds fee and admin-related details.
    #[account(
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    /// Trade account that holds liquidity pool details.
    #[account(
        mut,
        seeds = [TRADE_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub trade: Box<Account<'info, Trade>>,

    /// SOL reserve account that holds liquidity pool SOL funds.
    /// CHECK: This account stores the SOL reserve.
    #[account(
        mut,
        seeds = [RESERVE_TAG, SOL_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub sol_reserve: AccountInfo<'info>,

    /// Token reserve account that holds liquidity pool token funds.
    /// CHECK: This account stores the token reserve.
    #[account(
        mut,
        seeds = [RESERVE_TAG, MINT_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub token_reserve: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The mint account associated with the token being purchased.
    #[account(mut)]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// Associated Token Account (ATA) of the recipient, where tokens will be transferred.
    /// If not initialized, it will be created.
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint_account,
        associated_token::authority = payer,
        associated_token::token_program = token_program,
    )]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Account where collected trading fees are stored.
    /// Ensures it matches the global configuration's fee collection account.
    /// CHECK: This is manually validated to match the expected global config setting.
    #[account(mut,
        constraint = fees_collection_account.key() == global_config.fees_collection_account @CustomError::UnknownFeeAccount
    )]
    pub fees_collection_account: AccountInfo<'info>,

    /// The payer account, which funds the transaction and where the purchased tokens will be credited.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Blacklist User Account
    pub blacklist: AccountInfo<'info>,

    /// CHECK: Fund Program Address
    #[account(executable, address = fund::ID)]
    pub fund: AccountInfo<'info>,

    /// Token program used for token transfers.
    pub token_program: Program<'info, Token>,

    /// Associated Token Program used for managing ATAs.
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// System program used for SOL transfers and account initialization.
    pub system_program: Program<'info, System>,
}
