use super::*;

/// Function to initialize the commitment
///
/// This function sets up the commitment by transferring the minimum required rent
/// to the escrow SOL account and emitting an event.
pub fn handler(ctx: Context<InitCommitment>, token: String) -> Result<()> {
    // Calculate the minimum balance required for rent exemption
    let rent =
        Rent::get()?.minimum_balance(ctx.accounts.escrow_sol_account.to_account_info().data_len());

    // Prepare accounts for system program transfer (rent deposit)
    let cpi_accounts = system_program::Transfer {
        from: ctx.accounts.payer.to_account_info(),
        to: ctx.accounts.escrow_sol_account.to_account_info(),
    };

    // Transfer rent-exempt balance to the escrow SOL account
    system_program::transfer(
        CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts),
        rent,
    )?;

    // Emit event indicating successful commitment initialization
    emit!(events::InitCommitment { token });

    Ok(())
}

#[derive(Accounts)]
#[instruction(token: String)]
pub struct InitCommitment<'info> {
    /// Commitment account that stores commitment-related data
    #[account(
        init,
        seeds = [COMMITMENT_TAG, mint_account.key().as_ref()],
        bump,
        payer = payer,
        space = size_of::<GlobalConfig>() + 32
    )]
    pub commitments: Box<Account<'info, Commitments>>,

    /// CHECK: Escrow SOL Account that will hold the committed SOL funds
    #[account(
        mut,
        seeds = [ESCROW_TAG, SOL_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub escrow_sol_account: SystemAccount<'info>,

    /// CHECK: This is the mint account associated with the commitment
    #[account(
        seeds = [MINT_TAG, token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// The payer account funding the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Solana System Program for handling system instructions
    pub system_program: Program<'info, System>,
}
