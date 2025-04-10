use super::*;

/// Function to check wheather the user is blocked
pub fn handler(ctx: Context<IsUserBlocked>, address: Pubkey) -> Result<()> {
    // Ensure the user is not blacklisted
    let blacklist = &mut ctx.accounts.blacklist;
    require!(!blacklist.is_blocked(&address), CustomError::BlockedAccount);

    Ok(())
}

#[derive(Accounts)]
pub struct IsUserBlocked<'info> {
    /// Account storing blacklist users
    #[account(
        seeds = [BLACKLIST_TAG],
        bump,
    )]
    pub blacklist: Box<Account<'info, Blacklist>>,
}
