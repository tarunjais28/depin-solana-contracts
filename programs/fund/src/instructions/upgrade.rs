use super::*;

pub fn upgrade_account_size(ctx: Context<UpgradeAccount>, new_size: usize) -> Result<()> {
    let account = &mut ctx.accounts.account;

    let rent = Rent::get()?;
    let lamports_required = rent.minimum_balance(new_size);
    let current_lamports = account.to_account_info().lamports();
    let additional_lamports = lamports_required.saturating_sub(current_lamports);

    // Reallocate space for the account
    account.to_account_info().realloc(new_size, false)?;

    // Transfer lamports to meet the new rent requirement
    if additional_lamports > 0 {
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.payer.to_account_info(),
                    to: account.to_account_info(),
                },
            ),
            additional_lamports,
        )?;
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct UpgradeAccount<'info> {
    /// CHECK: Account whose going to upgrade
    #[account(mut)]
    pub account: AccountInfo<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
