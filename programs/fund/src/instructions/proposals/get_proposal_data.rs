use super::*;

/// Function to get proposal data
///
/// # Arguments
/// * `ctx` - The program execution context containing all required accounts.
/// * `proposal_id` - Proposal Id.
///
/// # Returns
/// * `Result<()>` - Returns an Ok result if successful, otherwise returns an error.
pub fn handler(
    ctx: Context<GetProposalData>,
    proposal_id: u32,
    proposal_type: ProposalType,
) -> Result<ProposalData> {
    let proposals_list = &mut ctx.accounts.proposals_list;
    let global_config = &ctx.accounts.global_config;

    // Ensure valid caller
    require!(
        global_config.is_owner(&ctx.accounts.executer.key()),
        CustomError::Unauthorized
    );

    let proposal = proposals_list.perform_execution(proposal_id, &proposal_type)?;

    Ok(proposal)
}

/// Struct defining the accounts required for managing users
#[derive(Accounts)]
#[instruction()]
pub struct GetProposalData<'info> {
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

    /// The executer responsible for the transaction
    #[account(mut)]
    pub executer: Signer<'info>,
}
