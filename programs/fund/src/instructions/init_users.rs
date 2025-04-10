use super::*;

/// Function to initialize the users
/// This function sets up user accounts and assigns a maximum allowable amount for commitments.
/// It ensures that only authorized creators can initialize users.
pub fn handler(_: Context<InitUsers>, token: String) -> Result<()> {
    // Emit an event indicating that users have been initialized
    emit!(events::UsersInitiated { token });

    Ok(())
}

#[derive(Accounts)]
#[instruction(token: String)]
pub struct InitUsers<'info> {
    /// Stores user-related data, such as maximum allowable commitment amount
    #[account(
        init,
        seeds = [USER_TAG, mint_account.key().as_ref()],
        bump,
        payer = payer,
        space = calc_init_user_size()
    )]
    pub users: Box<Account<'info, Users>>,

    /// CHECK: This is the mint account associated with the token
    #[account(
        seeds = [MINT_TAG, token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// The signer of the transaction who is initializing the users
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The Solana System Program, required for account initialization
    pub system_program: Program<'info, System>,
}
