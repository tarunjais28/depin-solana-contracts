/// The `handler` function in Rust handles the start of a DAO by updating the fund status and emitting
/// an event.
///
/// Arguments:
///
/// * `ctx`: The `ctx` parameter in the `handler` function is of type `Context<StartDao>`. It provides
/// contextual information and access to the accounts specified in the `StartDao` struct. This context
/// is used to interact with the accounts and perform actions within the Solana program.
/// * `params`: The `params` parameter in the `handler` function and the `StartDao` struct represents
/// the input parameters required for starting a DAO. It includes the following fields:
///
/// Returns:
///
/// The `handler` function returns a `Result<()>`, which indicates that it can return either `Ok(())` if
/// the operation is successful or an error if there is a problem during the execution.
use super::*;

/// Handles the start of a DAO by updating the fund status and emitting an event.
pub fn handler(ctx: Context<StartDao>, token: String) -> Result<()> {
    let global_config = &ctx.accounts.global_config;
    let fund_store = &mut ctx.accounts.fund_data_store;

    // Ensure the payer has sub-admin rights before proceeding
    require!(
        global_config.is_sub_admin(ctx.accounts.payer.key),
        CustomError::Unauthorized
    );

    // Ensure that the fund status is in the correct state for starting a DAO
    require!(
        fund_store.status.eq(&Status::Created),
        CustomError::PermissionDenied
    );

    // Update the fund status to indicate VIP fundraising has started
    fund_store.update_status(Status::FundraisingVip)?;

    // Emit an event to notify the system that the DAO has been started
    emit!(events::DaoStarted { token: token });

    Ok(())
}

/// Struct defining the accounts required for starting the DAO.
#[derive(Accounts)]
#[instruction(token: String)]
pub struct StartDao<'info> {
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
