use super::*;

/// Function to initialize the multisig
/// This function sets up user accounts and assigns a maximum allowable amount for commitments.
/// It ensures that only authorized creators can initialize multisig.
pub fn handler(ctx: Context<InitMultisig>) -> Result<()> {
    let global_config = &ctx.accounts.global_config;

    // Ensure that the caller has sub-admin rights before proceeding
    require!(
        global_config.is_sub_admin(&ctx.accounts.payer.key),
        CustomError::Unauthorized
    );
    // MAX_PERMITTED_DATA_LENGTH
    // Emit an event indicating that multisig is initiated
    emit!(events::MultisigInitiated {});

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct InitMultisig<'info> {
    /// Reference to the global configuration account
    #[account(
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    /// Proposal List
    #[account(
        init,
        seeds = [PROPOSAL_TAG],
        bump,
        payer = payer,
        space = MAX_PERMITTED_DATA_INCREASE
    )]
    pub proposals_list: Box<Account<'info, ProposalsList>>,

    /// The signer of the transaction who is initializing the users
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The Solana System Program, required for account initialization
    pub system_program: Program<'info, System>,
}
