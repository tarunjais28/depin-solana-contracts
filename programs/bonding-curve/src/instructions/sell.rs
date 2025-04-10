use super::*;

/// Function to handle the selling of tokens in exchange for SOL.
/// This function ensures the correct transfer of assets, applies fees,
/// and updates the trade reserves accordingly.
///
/// # Arguments
/// * `ctx` - The transaction context containing all necessary accounts.
/// * `token_amount` - The amount of tokens being sold.
///
/// # Returns
/// * `Result<()>` - Returns `Ok(())` if successful, otherwise an error.
pub fn handler(ctx: Context<Sell>, token_amount: u64) -> Result<()> {
    // Ensure that the amount being sold is greater than zero
    require_gt!(token_amount, 0, CustomError::AmountCantBeZero);

    // Ensure signer is not blocked
    let cpi_accounts = fund::cpi::accounts::IsUserBlocked {
        blacklist: ctx.accounts.blacklist.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.fund.to_account_info(), cpi_accounts);
    fund::cpi::is_user_blocked(cpi_ctx, *ctx.accounts.payer.key)?;

    let trade = &mut ctx.accounts.trade;

    // Compute the amount of SOL to be received after selling the tokens
    let sol_amount = get_amount_out(
        token_amount as u128,
        trade.token_reserve as u128,
        trade.sol_reserve as u128,
    );

    let mint_account = &ctx.accounts.mint_account.to_account_info();
    let mint_key: Pubkey = mint_account.key();
    let seeds = &[
        RESERVE_TAG,
        SOL_TAG,
        mint_key.as_ref(),
        &[ctx.bumps.sol_reserve],
    ];
    let signer = [&seeds[..]];

    // Compute and deduct trading fees if applicable
    let fees = calc_amount(sol_amount as u128, trade.fee_percent as u128);
    if fees > 0 {
        let cpi_accounts = system_program::Transfer {
            from: ctx.accounts.sol_reserve.to_account_info(),
            to: ctx.accounts.fees_collection_account.to_account_info(),
        };

        // Transfer calculated fees to the designated fees collection account
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                cpi_accounts,
                &signer,
            ),
            fees,
        )?;
    }

    // Calculate the final amount of SOL to be received after deducting fees
    let sol_amount_after_fee = sol_amount - fees;

    // Update the trade reserves accordingly
    trade.sol_reserve -= sol_amount;
    trade.token_reserve += token_amount;

    // Transfer SOL from the reserve account to the seller's account
    let cpi_accounts = system_program::Transfer {
        from: ctx.accounts.sol_reserve.to_account_info(),
        to: ctx.accounts.payer.to_account_info(),
    };

    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            cpi_accounts,
            &signer,
        ),
        sol_amount_after_fee,
    )?;

    // Transfer the sold tokens from the seller's account to the reserve
    let cpi_accounts = Transfer {
        from: ctx.accounts.from_ata.to_account_info(),
        to: ctx.accounts.token_reserve.to_account_info(),
        authority: ctx.accounts.payer.to_account_info(),
    };

    token::transfer(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts),
        token_amount,
    )?;

    // Emit an event to log the token sale transaction
    emit!(events::TokensSold {
        token: mint_key,
        by: ctx.accounts.payer.key(),
        amount: token_amount,
    });

    Ok(())
}

/// Accounts required for the `Sell` instruction.
/// This struct defines the necessary accounts for executing a token sale.
#[derive(Accounts)]
#[instruction()]
pub struct Sell<'info> {
    /// The global configuration account that holds contract settings.
    #[account(
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    /// The trade account storing trade-related data.
    #[account(
        mut,
        seeds = [TRADE_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub trade: Box<Account<'info, Trade>>,

    /// Reserve SOL account where SOL is held for trade settlements.
    /// This is a manually checked account (not a structured type).
    /// CHECK: This is a validated SOL reserve account.
    #[account(
        mut,
        seeds = [RESERVE_TAG, SOL_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub sol_reserve: AccountInfo<'info>,

    /// Reserve token account where tokens are stored for trades.
    /// CHECK: This is a manually validated token reserve account.
    #[account(
        mut,
        seeds = [RESERVE_TAG, MINT_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub token_reserve: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The mint account associated with the token being traded.
    #[account(mut)]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// The account holding the tokens being sold (user's associated token account).
    /// CHECK: This is a manually validated account.
    #[account(
        mut,
        associated_token::mint = mint_account,
        associated_token::authority = payer,
        associated_token::token_program = token_program,
    )]
    pub from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The fees collection account where trading fees are sent.
    /// CHECK: This is manually validated to match the expected global config setting.
    #[account(mut,
        constraint = fees_collection_account.key() == global_config.fees_collection_account @CustomError::UnknownFeeAccount
    )]
    pub fees_collection_account: AccountInfo<'info>,

    /// The user executing the sell transaction.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Blacklist User Account
    pub blacklist: AccountInfo<'info>,

    /// CHECK: Fund Program Address
    #[account(executable, address = fund::ID)]
    pub fund: AccountInfo<'info>,

    /// The Solana token program for managing token transfers.
    pub token_program: Program<'info, Token>,

    /// The associated token program required for managing token accounts.
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// The Solana system program, used for SOL transfers.
    pub system_program: Program<'info, System>,
}
