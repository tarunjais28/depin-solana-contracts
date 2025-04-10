use super::*;

/// Function to manage (add/remove) users
/// This function allows creators to add or remove VIP or Party users based on the given parameters.
///
/// # Arguments
/// * `ctx` - The program execution context containing all required accounts.
/// * `params` - Parameters specifying user management actions (user type, action type, and user list).
///
/// # Returns
/// * `Result<()>` - Returns an Ok result if successful, otherwise returns an error.
pub fn handler(ctx: Context<BlacklistUser>, proposal_id: u32) -> Result<()> {
    let proposals_list = &mut ctx.accounts.proposals_list;
    let global_config = &ctx.accounts.global_config;

    let proposal = proposals_list
        .proposals
        .iter_mut()
        .find(|p| p.id == proposal_id);

    require!(proposal.is_some(), CustomError::NotFound);
    let proposal = proposal.unwrap();
    require!(
        proposal.proposal_type == ProposalType::BlocklistUser,
        CustomError::InvalidProposalType
    );
    require!(proposal.is_approved(), CustomError::NotApproved);
    require!(!proposal.is_executed(), CustomError::AlreadyExecuted);
    require!(
        global_config.is_owner(&ctx.accounts.executer.key()),
        CustomError::Unauthorized
    );

    // Marked as execution after check to handle rust borrowing
    proposal.execution_completed()?;

    let user = proposal.address.ok_or(CustomError::AddressNotFound)?;
    upgrade_account_size(
        ctx.accounts.to_upgrade_account_ctx(),
        calc_blacklist_size(&ctx.accounts.blacklist),
    )?;

    let blacklist = &mut ctx.accounts.blacklist;
    blacklist.add_user(user)?;

    // Emit event to log the user block action
    emit!(events::UserBlacklisted { user });

    Ok(())
}

/// Struct defining the accounts required for managing users
#[derive(Accounts)]
#[instruction()]
pub struct BlacklistUser<'info> {
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

    /// Account storing blacklist users
    #[account(
        mut,
        seeds = [BLACKLIST_TAG],
        bump,
    )]
    pub blacklist: Box<Account<'info, Blacklist>>,

    /// The executer responsible for the transaction
    #[account(mut)]
    pub executer: Signer<'info>,

    /// System program required for allocation and execution of instructions
    pub system_program: Program<'info, System>,
}

impl<'info> BlacklistUser<'info> {
    pub fn to_upgrade_account_ctx(&self) -> Context<'_, '_, '_, 'info, UpgradeAccount<'info>> {
        let upgrade = UpgradeAccount {
            account: self.blacklist.to_account_info(),
            payer: self.executer.clone(),
            system_program: self.system_program.clone(),
        };

        Context::new(
            &crate::ID,
            Box::leak(Box::new(upgrade)), // Convert into a static reference
            &[],
            UpgradeAccountBumps {},
        )
    }
}
