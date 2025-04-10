use super::*;

/// Function to remove liquidity from the protocol.
/// This function allows authorized sub-admins to withdraw both SOL and tokens
/// from the liquidity pool. It transfers assets from the reserve accounts
/// to the specified recipient accounts.
///
/// # Arguments
/// * `ctx` - The transaction context containing necessary accounts.
/// * `percent` - The percent of amount to be moved out from liquidity, upto 6 decimal places.
///
/// # Returns
/// * `Result<()>` - Returns `Ok(())` if successful, otherwise an error.
pub fn handler(ctx: Context<RemoveLiquidity>, proposal_id: u32) -> Result<()> {
    let trade = &ctx.accounts.trade;

    // Ensure that the caller has admin rights
    is_owner(
        *ctx.accounts.authority.key,
        ctx.accounts.fund.to_account_info(),
        ctx.accounts.fund_global_config.to_account_info(),
    )?;

    let cpi_accounts = fund::cpi::accounts::GetProposalData {
        global_config: ctx.accounts.fund_global_config.to_account_info(),
        proposals_list: ctx.accounts.proposals_list.to_account_info(),
        executer: ctx.accounts.authority.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(ctx.accounts.fund.to_account_info(), cpi_accounts);

    let proposal =
        fund::cpi::get_proposal_data(cpi_ctx, proposal_id, fund::ProposalType::RemoveLiquidity)?
            .get();

    let mint_account = &ctx.accounts.mint_account.to_account_info();
    let mint_key = mint_account.key();

    // Define the seeds and signer for the SOL reserve account
    let seeds = &[
        RESERVE_TAG,
        SOL_TAG,
        mint_key.as_ref(),
        &[ctx.bumps.sol_reserve],
    ];
    let signer = [&seeds[..]];

    // Transfer all SOL from the reserve account to the recipient account
    let cpi_accounts = system_program::Transfer {
        from: ctx.accounts.sol_reserve.to_account_info(),
        to: ctx.accounts.to_account.to_account_info(),
    };

    let percent = u128::from(proposal.transfer_amount.unwrap_or_default());
    let sol_amount = calc_amount(u128::from(trade.sol_reserve), percent);

    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            cpi_accounts,
            &signer,
        ),
        sol_amount,
    )?;

    // Define the seeds and signer for the token reserve account
    let seeds = &[
        RESERVE_TAG,
        MINT_TAG,
        mint_key.as_ref(),
        &[ctx.bumps.token_reserve],
    ];
    let signer = [&seeds[..]];

    // Transfer all tokens from the reserve account to the recipient's associated token account
    let cpi_accounts = Transfer {
        from: ctx.accounts.token_reserve.to_account_info(),
        to: ctx.accounts.to_ata.to_account_info(),
        authority: ctx.accounts.token_reserve.to_account_info(),
    };

    let token_amount = calc_amount(u128::from(trade.token_reserve), percent);

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            &signer,
        ),
        token_amount,
    )?;

    // Emit an event to log the liquidity removal action
    emit!(events::LiquidityRemoved {
        token: ctx.accounts.mint_account.key(),
        token_amount,
        sol_amount,
    });

    Ok(())
}

/// Accounts required for the `RemoveLiquidity` instruction.
/// This struct defines the necessary accounts for executing a liquidity removal.
#[derive(Accounts)]
#[instruction()]
pub struct RemoveLiquidity<'info> {
    /// CHECK: Fund's global configuration account, which stores admin and sub-admin information
    pub fund_global_config: AccountInfo<'info>,

    /// CHECK: Fund Program Address
    #[account(executable, address = fund::ID)]
    pub fund: AccountInfo<'info>,

    /// Trade account that stores liquidity pool details.
    #[account(
        seeds = [TRADE_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub trade: Box<Account<'info, Trade>>,

    /// Reserve SOL account that holds liquidity in SOL.
    /// CHECK: This is a manually validated reserve account.
    #[account(
        mut,
        seeds = [RESERVE_TAG, SOL_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub sol_reserve: AccountInfo<'info>,

    /// Reserve token account that holds liquidity in tokens.
    /// CHECK: This is a manually validated reserve account.
    #[account(
        mut,
        seeds = [RESERVE_TAG, MINT_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub token_reserve: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: Proposal List
    #[account(mut)]
    pub proposals_list: AccountInfo<'info>,

    /// The mint account associated with the token being withdrawn.
    #[account(mut)]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// The recipient's associated token account where withdrawn tokens will be transferred.
    /// CHECK: This is manually validated.
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = mint_account,
        associated_token::authority = to_account,
        associated_token::token_program = token_program,
    )]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The recipient account where withdrawn SOL will be transferred.
    /// CHECK: This is a manually validated account.
    #[account(mut)]
    pub to_account: AccountInfo<'info>,

    /// The authority executing the transaction, who must have sub-admin privileges.
    #[account(mut)]
    pub authority: Signer<'info>,

    /// The Solana token program, used for token transfers.
    pub token_program: Program<'info, Token>,

    /// The associated token program required for managing token accounts.
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// The Solana system program, used for SOL transfers.
    pub system_program: Program<'info, System>,
}
