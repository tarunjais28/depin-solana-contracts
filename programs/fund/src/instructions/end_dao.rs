use super::*;

/// The `handler` function in Rust processes the ending of a DAO by updating fund status, checking
/// permissions, and emitting an event.
///
/// Arguments:
///
/// * `ctx`: The `ctx` parameter in the `handler` function represents the context of the program
/// execution. It contains various accounts and information that are needed for the operation to be
/// performed. In this case, it includes accounts like `global_config`, `fund_data_store`,
/// `escrow_sol_account`, `mint
/// * `params`: The `params` struct contains the parameters required for ending the DAO. It likely
/// includes information such as the end date of the DAO and the token associated with the DAO.
///
/// Returns:
///
/// The `handler` function is returning a `Result<()>`, which indicates that it can return either
/// `Ok(())` if the operation is successful or an error if there is a problem during execution.
pub fn handler(ctx: Context<EndDao>, token: String) -> Result<()> {
    let global_config = &ctx.accounts.global_config;
    let fund_store = &mut ctx.accounts.fund_data_store;

    // Ensure the payer has sub-admin rights before proceeding
    require!(
        global_config.is_sub_admin(ctx.accounts.payer.key),
        CustomError::Unauthorized
    );

    // Ensure that the fund status is in the correct state for ending the dao
    require!(
        fund_store.status.eq(&Status::FundraisingVip)
            || fund_store.status.eq(&Status::FundraisingParty),
        CustomError::PermissionDenied
    );

    // Update the fund status to indicate dao has ended
    let escrow_sol_account = &ctx.accounts.escrow_sol_account;
    let rent = Rent::get()?.minimum_balance(escrow_sol_account.to_account_info().data_len());
    if fund_store.fundraising_goal == escrow_sol_account.lamports() - rent {
        fund_store.update_status(Status::FundraisingSuccess)?;
    } else {
        fund_store.update_status(Status::FundraisingFail)?;
    }

    // Emit an event to notify the system that the dao has ended
    emit!(events::DaoEnded { token: token });

    Ok(())
}

/// Struct defining the accounts required for ending the dao.
#[derive(Accounts)]
#[instruction(token: String)]
pub struct EndDao<'info> {
    /// Reference to the global configuration account
    #[account(
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    /// Fund data store account.
    /// Stores details about the fundraising process, including the current status.
    #[account(
        mut,
        seeds = [FUND_DATA_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    /// CHECK: Escrow SOL Account that will hold the committed SOL funds
    #[account(
        mut,
        seeds = [ESCROW_TAG, SOL_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub escrow_sol_account: SystemAccount<'info>,

    /// Mint account associated with the DPIT token.
    /// This is used for identifying the token related to the DAO.
    /// CHECK: This account is used for reference and does not require verification.
    #[account(
        seeds = [MINT_TAG, token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// The payer (signer) initiating the DAO start.
    /// Must be an authorized creator to perform this action.
    #[account(mut)]
    pub payer: Signer<'info>,
}
