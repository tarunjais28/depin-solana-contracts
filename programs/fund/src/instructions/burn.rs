use super::*;

/// Function to burn the tokens
///
/// This function can throw the following errors:
///   - any of the seeds not match with the actual seeds
///   - mint keys are different
///   - caller is not the owner of the tokens
pub fn handler(ctx: Context<BurnTokens>, params: structs::burn::Params) -> Result<()> {
    // Create the Burn struct for burning the specified amount of tokens
    let cpi_accounts = Burn {
        mint: ctx.accounts.mint_account.to_account_info(), // Mint account reference
        from: ctx.accounts.from_ata.to_account_info(), // Source account from which tokens will be burned
        authority: ctx.accounts.authority.to_account_info(), // Authority to approve the burn operation
    };

    // Burn the specified amount of tokens using the Solana Token Program
    token::burn(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts),
        params.amount, // Amount of tokens to burn
    )?;

    // Emit an event to signal that the burn operation has completed successfully
    emit!(params.to_event());

    Ok(()) // Return success
}

#[derive(Accounts)]
#[instruction(params: structs::burn::Params)]
pub struct BurnTokens<'info> {
    /// CHECK: This is the mint account associated with the DPIT token
    #[account(
        mut,
        seeds = [MINT_TAG, params.token.as_bytes()], // Derive PDA using seed values
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>, // The mint account for the SPL token

    /// CHECK: This is the token account that we want to burn tokens from (ATA)
    #[account(mut)]
    pub from_ata: InterfaceAccount<'info, TokenAccount>, // Source account from which tokens will be burned

    /// CHECK: The authority of the token accounts involved in the burn operation
    #[account(mut)]
    pub authority: Signer<'info>, // The authority that can manage the token accounts

    pub token_program: Program<'info, Token>, // Solana Token Program for handling SPL tokens

    pub system_program: Program<'info, System>, // Solana System Program
}
