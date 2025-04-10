use super::*;

pub fn handler(ctx: Context<ResetAccount>) -> Result<()> {
    let global_config = &ctx.accounts.global_config;
    require!(
        global_config.is_admin(&ctx.accounts.receiver.key()),
        CustomError::Unauthorized
    );

    let account = &ctx.accounts.account;
    let receiver = &ctx.accounts.receiver;
    let lamports = account.lamports();

    // Transfer all remaining lamports to the receiver
    **receiver.lamports.borrow_mut() += lamports;
    **account.lamports.borrow_mut() = 0;

    // Mark account as empty by resizing data to 0
    account.realloc(0, false)?;

    // Emit when an account is reset
    emit!(events::AccountReset {});

    Ok(())
}

#[derive(Accounts)]
pub struct ResetAccount<'info> {
    /// Reference to the global configuration account
    #[account(
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    /// CHECK: Account going to be reset
    #[account(mut)]
    pub account: AccountInfo<'info>,

    #[account(mut)]
    pub receiver: Signer<'info>,
}
