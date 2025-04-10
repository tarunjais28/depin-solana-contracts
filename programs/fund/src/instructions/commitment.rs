use super::*;

/// Function to commit tokens to the fundraising pool
pub fn handler(ctx: Context<Commitment>, token: String, sol_amount: u64) -> Result<()> {
    let users = &mut ctx.accounts.users;
    let fund_store = &mut ctx.accounts.fund_data_store;
    let caller = &ctx.accounts.payer.key();

    // Ensure amount is greater than or equals to 0.1 sols
    require!(sol_amount.ge(&100000000), CustomError::MinimumAmountNotMet);

    // Ensure the user is eligible to commit funds
    require!(
        users.is_eligible(caller, fund_store.status),
        CustomError::InEligible
    );

    let commitments = &mut ctx.accounts.commitments;

    // Update the total committed SOL amount
    commitments.total_commited_sols += sol_amount;

    // Ensure the total commitment does not exceed the fundraising goal
    require!(
        commitments.total_commited_sols <= fund_store.fundraising_goal,
        CustomError::PermissionDenied
    );

    // Ensure the user is not blacklisted
    let blacklist = &mut ctx.accounts.blacklist;
    require!(!blacklist.is_blocked(caller), CustomError::BlockedAccount);

    // Update fundraising status if the goal is reached
    if commitments.total_commited_sols == fund_store.fundraising_goal {
        fund_store.update_status(Status::FundraisingSuccess)?;
    }

    // Calculate applicable fees
    let fees = calc_amount(sol_amount as u128, fund_store.fee_percent as u128);

    // Deduct fees if applicable
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

    // Register the commitment event
    let commit_event = commitments.add(token, *caller, sol_amount, fund_store.tokens_per_sol);

    // Get the total committed amount by the user
    let commited_amount = commitments.get_commitment_amount(caller);

    // Ensure the committed amount does not exceed the user's max allowable limit
    require!(
        users.is_max_allowable_amount_reached(caller, commited_amount),
        CustomError::CommitAmountExceeded
    );

    // Transfer SOL to the escrow account
    let cpi_accounts = system_program::Transfer {
        from: ctx.accounts.payer.to_account_info(),
        to: ctx.accounts.escrow_sol_account.to_account_info(),
    };

    system_program::transfer(
        CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts),
        sol_amount,
    )?;

    // Emit the commit token event
    emit!(commit_event);

    Ok(())
}

#[derive(Accounts)]
#[instruction(token: String)]
pub struct Commitment<'info> {
    /// Account storing fee information
    #[account(
        seeds = [FEE_TAG],
        bump
    )]
    pub fee_account: Box<Account<'info, FeeAccount>>,

    /// User account managing commitment eligibility
    #[account(
        seeds = [USER_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub users: Box<Account<'info, Users>>,

    /// Account storing blacklist users
    #[account(
        seeds = [BLACKLIST_TAG],
        bump,
    )]
    pub blacklist: Box<Account<'info, Blacklist>>,

    /// CHECK: Escrow SOL account where committed SOL is stored
    #[account(
        mut,
        seeds = [ESCROW_TAG, SOL_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub escrow_sol_account: AccountInfo<'info>,

    /// CHECK: Stores commitment details
    #[account(
        mut,
        seeds = [COMMITMENT_TAG, mint_account.key().as_ref()],
        bump,
        realloc = calc_commitment_size(commitments.commiters.len() + 2),
        realloc::payer = payer,
        realloc::zero = false,
    )]
    pub commitments: Box<Account<'info, Commitments>>,

    /// Stores fundraising data
    #[account(
        mut,
        seeds = [FUND_DATA_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    /// CHECK: Mint account for the token being committed
    #[account(
        seeds = [MINT_TAG, token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// User committing the funds
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Fees collection account to receive applicable fees
    #[account(
        mut,
        constraint = fees_collection_account.key() == fee_account.fees_collection_account @CustomError::UnknownFeeAccount
    )]
    pub fees_collection_account: AccountInfo<'info>,

    /// Solana System Program
    pub system_program: Program<'info, System>,
}
