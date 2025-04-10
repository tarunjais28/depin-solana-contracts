use super::*;

/// Function to initialize the creators account
/// This function emits an event to signal the initialization of creators.
pub fn handler(_ctx: Context<InitCreators>) -> Result<()> {
    // Emit an event indicating that the creators account has been initialized
    emit!(events::InitCreators {});

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct InitCreators<'info> {
    /// Account to store creator-related data
    /// CHECK: This account is initialized with a unique seed to ensure uniqueness
    #[account(
        init,
        seeds = [CREATOR_TAG],
        bump,
        space = size_of::<Creators>() + 32, // Allocate space for the Creators struct
        payer = payer,
    )]
    pub creators: Box<Account<'info, Creators>>,

    /// Account storing blacklist users
    #[account(
        init,
        seeds = [BLACKLIST_TAG],
        bump,
        payer = payer,
        space = size_of::<Blacklist>() +  8
    )]
    pub blacklist: Box<Account<'info, Blacklist>>,

    /// Signer responsible for paying the account creation fee
    #[account(mut)]
    pub payer: Signer<'info>,

    /// System program required for account initialization
    pub system_program: Program<'info, System>,
}
