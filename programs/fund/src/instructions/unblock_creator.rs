use super::*;

/// Function to blacklist creator
/// This function allows creators to add or remove VIP or Party users based on the given parameters.
///
/// # Arguments
/// * `ctx` - The program execution context containing all required accounts.
/// * `params` - Parameters specifying user management actions (user type, action type, and user list).
///
/// # Returns
/// * `Result<()>` - Returns an Ok result if successful, otherwise returns an error.
pub fn handler(ctx: Context<UnblockCreator>, proposal_id: u32) -> Result<()> {
    let proposals_list = &mut ctx.accounts.proposals_list;
    let global_config = &ctx.accounts.global_config;

    // Ensure valid executer
    require!(
        global_config.is_owner(&ctx.accounts.executer.key()),
        CustomError::Unauthorized
    );
    let proposal = proposals_list.perform_execution(proposal_id, &ProposalType::UnblockCreator)?;

    let creator = proposal.address.ok_or(CustomError::AddressNotFound)?;

    // Block Creator
    let creators = &mut ctx.accounts.creators;
    creators.block(&creator, false);

    // Emit event to log the creator unblock action
    emit!(events::CreatorUnblocked { creator });

    Ok(())
}

/// Struct defining the accounts required for managing users
#[derive(Accounts)]
pub struct UnblockCreator<'info> {
    /// Reference to the global configuration account
    #[account(
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(
        mut,
        seeds = [PROPOSAL_TAG],
        bump,
    )]
    pub proposals_list: Account<'info, ProposalsList>,

    /// The account storing the list of creators
    #[account(
        mut,
        seeds = [CREATOR_TAG],
        bump,
    )]
    pub creators: Box<Account<'info, Creators>>,

    /// The executer responsible for the transaction
    #[account(mut)]
    pub executer: Signer<'info>,
}
