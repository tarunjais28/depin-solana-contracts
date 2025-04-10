use super::*;

/// Function to claim tokens or SOL based on the fundraising status
pub fn handler(ctx: Context<Claim>, token: String) -> Result<()> {
    let commitments = &mut ctx.accounts.commitments;
    let fund_store = &ctx.accounts.fund_data_store;
    let amount; // Variable to store claimable amount
    let sol_amount; // Variable to store SOL equivalent amount

    let mint_key = ctx.accounts.mint_account.key();
    let day = Clock::get()
        .map_err(|_| CustomError::TimestampError)?
        .unix_timestamp;

    use Status::*;
    match fund_store.status {
        FundraisingFail | Closed => {
            // Define signer seeds for SOL escrow account
            let seeds = &[
                ESCROW_TAG,
                SOL_TAG,
                mint_key.as_ref(),
                &[ctx.bumps.escrow_sol_account],
            ];
            let signer = [&seeds[..]];

            // Transfer SOL to user account from escrow account
            let cpi_accounts = system_program::Transfer {
                from: ctx.accounts.escrow_sol_account.to_account_info(),
                to: ctx.accounts.payer.to_account_info(),
            };

            // Determine the amount of SOL to claim
            amount = commitments.claim_amount(
                &ctx.accounts.payer.key,
                AmountType::Sol,
                &fund_store.vesting_percent,
                day,
            )?;
            sol_amount = amount;

            // Execute the transfer
            system_program::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    cpi_accounts,
                    &signer,
                ),
                amount,
            )?;
        }
        FundraisingSuccess | Trade => {
            // Define signer seeds for token escrow account
            let seeds = &[
                ESCROW_TAG,
                MINT_TAG,
                mint_key.as_ref(),
                &[ctx.bumps.escrow_mint_account],
            ];
            let signer = [&seeds[..]];

            // Transfer token from escrow account to user ATA account
            let cpi_accounts = Transfer {
                from: ctx.accounts.escrow_mint_ata.to_account_info(),
                to: ctx.accounts.to_account.to_account_info(),
                authority: ctx.accounts.escrow_mint_account.to_account_info(),
            };

            // Determine the amount of tokens to claim
            amount = commitments.claim_amount(
                &ctx.accounts.payer.key,
                AmountType::Token,
                &fund_store.vesting_percent,
                day,
            )?;
            sol_amount = (amount as u128 / fund_store.tokens_per_sol as u128) as u64;

            // Execute the token transfer
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    cpi_accounts,
                    &signer,
                ),
                amount,
            )?;
        }
        _ => return Err(CustomError::PermissionDenied.into()),
    }

    // Calculate fees based on the SOL equivalent of the claimed amount
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

    // Emit claim event
    emit!(events::Claim { token, amount });

    Ok(())
}

/// Function to claim tokens or SOL based on the fundraising status for testing purpose
pub fn test(ctx: Context<Claim>, token: String, day: i64) -> Result<()> {
    let commitments = &mut ctx.accounts.commitments;
    let fund_store = &ctx.accounts.fund_data_store;
    let amount; // Variable to store claimable amount
    let sol_amount; // Variable to store SOL equivalent amount

    let mint_key = ctx.accounts.mint_account.key();

    use Status::*;
    match fund_store.status {
        FundraisingFail | Closed => {
            // Define signer seeds for SOL escrow account
            let seeds = &[
                ESCROW_TAG,
                SOL_TAG,
                mint_key.as_ref(),
                &[ctx.bumps.escrow_sol_account],
            ];
            let signer = [&seeds[..]];

            // Transfer SOL to user account from escrow account
            let cpi_accounts = system_program::Transfer {
                from: ctx.accounts.escrow_sol_account.to_account_info(),
                to: ctx.accounts.payer.to_account_info(),
            };

            // Determine the amount of SOL to claim
            amount = commitments.claim_amount(
                &ctx.accounts.payer.key,
                AmountType::Sol,
                &fund_store.vesting_percent,
                day,
            )?;
            sol_amount = amount;

            // Execute the transfer
            system_program::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    cpi_accounts,
                    &signer,
                ),
                amount,
            )?;
        }
        FundraisingSuccess | Trade => {
            // Define signer seeds for token escrow account
            let seeds = &[
                ESCROW_TAG,
                MINT_TAG,
                mint_key.as_ref(),
                &[ctx.bumps.escrow_mint_account],
            ];
            let signer = [&seeds[..]];

            // Transfer token from escrow account to user ATA account
            let cpi_accounts = Transfer {
                from: ctx.accounts.escrow_mint_ata.to_account_info(),
                to: ctx.accounts.to_account.to_account_info(),
                authority: ctx.accounts.escrow_mint_account.to_account_info(),
            };

            // Determine the amount of tokens to claim
            amount = commitments.claim_amount(
                &ctx.accounts.payer.key,
                AmountType::Token,
                &fund_store.vesting_percent,
                day,
            )?;
            sol_amount = (amount as u128 / fund_store.tokens_per_sol as u128) as u64;

            // Execute the token transfer
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    cpi_accounts,
                    &signer,
                ),
                amount,
            )?;
        }
        _ => return Err(CustomError::PermissionDenied.into()),
    }

    // Calculate fees based on the SOL equivalent of the claimed amount
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

    // Emit claim event
    emit!(events::Claim { token, amount });

    Ok(())
}

#[derive(Accounts)]
#[instruction(token: String)]
pub struct Claim<'info> {
    /// Account storing fee information
    #[account(
        seeds = [FEE_TAG],
        bump
    )]
    pub fee_account: Box<Account<'info, FeeAccount>>,

    /// CHECK: Escrow Sol Account holding SOL for refunds
    #[account(
        mut,
        seeds = [ESCROW_TAG, SOL_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub escrow_sol_account: AccountInfo<'info>,

    /// CHECK: Stores commitments for claimable amounts
    #[account(
        mut,
        seeds = [COMMITMENT_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub commitments: Box<Account<'info, Commitments>>,

    /// Account that stores fund-related data
    #[account(
        seeds = [FUND_DATA_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    /// CHECK: Escrow account for holding minted tokens
    #[account(
        mut,
        seeds = [ESCROW_TAG, MINT_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub escrow_mint_account: AccountInfo<'info>,

    /// CHECK: Escrow-associated token account for holding tokens
    #[account(
        mut,
        associated_token::mint = mint_account,
        associated_token::authority = escrow_mint_account,
        associated_token::token_program = token_program,
    )]
    pub escrow_mint_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Mint account for the token being claimed
    #[account(
        mut,
        seeds = [MINT_TAG, token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: User's associated token account for receiving tokens
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint_account,
        associated_token::authority = payer,
        associated_token::token_program = token_program,
    )]
    pub to_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// User making the claim
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Fees collection account for collecting applicable fees
    #[account(
        mut,
        constraint = fees_collection_account.key() == fee_account.fees_collection_account @CustomError::UnknownFeeAccount
    )]
    pub fees_collection_account: AccountInfo<'info>,

    /// Solana Token Program
    pub token_program: Program<'info, Token>,

    /// Solana Associated Token Program
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// Solana System Program
    pub system_program: Program<'info, System>,
}
