use super::*;

/// The `handler` function in Rust code initiates the start of a DAO fundraising round, checking
/// permissions and updating the fund status accordingly.
///
/// Arguments:
///
/// * `ctx`: The `ctx` parameter in the `handler` function represents the context of the transaction or
/// interaction with the Solana blockchain. It contains various accounts and information relevant to the
/// current operation. In this specific case, `ctx` is of type `Context<StartPartRound>`, which means it
/// includes
/// * `token`: The `token` parameter in the code snippet represents a string value that is passed as an
/// argument to the `handler` function. This token is used as part of the `StartPartRound` struct
/// definition where it is specified as an instruction.
///
/// Returns:
///
/// The `handler` function returns a `Result<()>`, which means it returns a result indicating success or
/// an error. If the function completes successfully, it returns `Ok(())`, indicating that the operation
/// was successful. If there is an error during the execution of the function, it will return an error
/// value.
pub fn handler(ctx: Context<StartPartRound>, token: String) -> Result<()> {
    let creators = &ctx.accounts.creators;
    let fund_store = &mut ctx.accounts.fund_data_store;

    // Ensure that the caller is an authorized creator before proceeding
    creators.is_creator(
        &ctx.accounts.payer.key(),
        ctx.accounts.metadata.creators.clone(),
    )?;

    // Ensure that the fund status is in the correct state for starting party round
    require!(
        fund_store.status.eq(&Status::FundraisingVip),
        CustomError::PermissionDenied
    );

    // Update the fund status to indicate party round fundraising has started
    fund_store.update_status(Status::FundraisingParty)?;

    // Emit an event to notify the system that the party round has started
    emit!(events::PartyRoundStarted { token });

    Ok(())
}

/// Struct defining the accounts required for starting the party round.
#[derive(Accounts)]
#[instruction(token: String)]
pub struct StartPartRound<'info> {
    /// Creators account.
    /// Stores information about the DAO creators and their permissions.
    #[account(
        seeds = [CREATOR_TAG],
        bump,
    )]
    pub creators: Box<Account<'info, Creators>>,

    /// CHECK: Metadata account for the token
    #[account()]
    pub metadata: Box<Account<'info, MetadataAccount>>,

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
