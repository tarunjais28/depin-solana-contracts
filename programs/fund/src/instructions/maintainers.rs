use super::*;

/// Function to update the main admin of the contract
/// Only the current admin is authorized to make this change
pub fn update_owner(ctx: Context<UpdateGlobalConfig>, proposal_id: u32) -> Result<()> {
    let proposals_list = &mut ctx.accounts.proposals_list;
    let global_config = &mut ctx.accounts.global_config;

    require!(
        global_config.is_owner(&ctx.accounts.executor.key()),
        CustomError::Unauthorized
    );

    // Find the proposal as a mutable reference
    let proposal = proposals_list
        .proposals
        .iter_mut()
        .find(|p| p.id == proposal_id);

    require!(proposal.is_some(), CustomError::NotFound);
    let proposal = proposal.unwrap();
    require!(
        proposal.proposal_type == ProposalType::UpdateOwner,
        CustomError::InvalidProposalType
    );
    require!(proposal.is_approved(), CustomError::NotApproved);
    require!(!proposal.is_executed(), CustomError::AlreadyExecuted);

    // Update owner and mark as executed
    global_config.set_owner(proposal.address.clone().unwrap());
    proposal.execution_completed()?;

    Ok(())
}

/// Function to add new sub-admins
/// Only the main admin is authorized to perform this action
pub fn add_admin(ctx: Context<UpdateMaintainers>, proposal_id: u32) -> Result<()> {
    let proposals_list = &mut ctx.accounts.proposals_list;
    let global_config = &mut ctx.accounts.global_config;
    let creators = &mut ctx.accounts.creators;
    let proposal = proposals_list
        .proposals
        .iter_mut()
        .find(|p| p.id == proposal_id);

    require!(
        global_config.is_owner(&ctx.accounts.executor.key()),
        CustomError::Unauthorized
    );
    require!(proposal.is_some(), CustomError::NotFound);
    let proposal = proposal.unwrap();
    require!(
        proposal.proposal_type == ProposalType::AddAdmin,
        CustomError::InvalidProposalType
    );
    require!(proposal.is_approved(), CustomError::NotApproved);

    let address = proposal.address.ok_or(CustomError::NotFound)?;

    require!(
        !global_config.is_deployer(&address),
        CustomError::PresentInDeployerList
    );

    require!(
        !creators.in_creator_list(&address),
        CustomError::PresentInCreatorList
    );

    global_config.add_admin(vec![address]);
    proposal.execution_completed()?;

    Ok(())
}

pub fn remove_admin(ctx: Context<UpdateGlobalConfig>, proposal_id: u32) -> Result<()> {
    let proposals_list = &mut ctx.accounts.proposals_list;
    let global_config = &mut ctx.accounts.global_config;
    let proposal = proposals_list
        .proposals
        .iter_mut()
        .find(|p| p.id == proposal_id);

    require!(
        global_config.is_owner(&ctx.accounts.executor.key()),
        CustomError::Unauthorized
    );
    require!(proposal.is_some(), CustomError::NotFound);
    let proposal = proposal.unwrap();
    require!(
        proposal.proposal_type == ProposalType::RemoveAdmin,
        CustomError::InvalidProposalType
    );
    require!(proposal.is_approved(), CustomError::NotApproved);

    global_config.remove_admins(vec![proposal.address.clone().unwrap()]);
    proposal.execution_completed()?;

    Ok(())
}

/// Function to add new sub-admins
/// Only the main admin is authorized to perform this action
pub fn add_deployer(ctx: Context<UpdateMaintainers>, proposal_id: u32) -> Result<()> {
    let proposals_list = &mut ctx.accounts.proposals_list;
    let global_config = &mut ctx.accounts.global_config;
    let proposal = proposals_list
        .proposals
        .iter_mut()
        .find(|p| p.id == proposal_id);

    require!(
        global_config.is_owner(&ctx.accounts.executor.key()),
        CustomError::Unauthorized
    );
    require!(proposal.is_some(), CustomError::NotFound);
    let proposal = proposal.unwrap();
    require!(
        proposal.proposal_type == ProposalType::AddDeployer,
        CustomError::InvalidProposalType
    );
    require!(proposal.is_approved(), CustomError::NotApproved);

    // Ensure that the admin is not going to add as deployer
    let address = proposal.address.ok_or(CustomError::NotFound)?;
    require!(
        !global_config.is_admin(&address),
        CustomError::PresentInAdminList
    );

    global_config.add_deployers(vec![address]);
    proposal.execution_completed()?;

    Ok(())
}

pub fn remove_deployer(ctx: Context<UpdateGlobalConfig>, proposal_id: u32) -> Result<()> {
    let proposals_list = &mut ctx.accounts.proposals_list;
    let global_config = &mut ctx.accounts.global_config;
    let proposal = proposals_list
        .proposals
        .iter_mut()
        .find(|p| p.id == proposal_id);

    require!(
        global_config.is_owner(&ctx.accounts.executor.key()),
        CustomError::Unauthorized
    );

    require!(proposal.is_some(), CustomError::NotFound);
    let proposal = proposal.unwrap();
    require!(
        proposal.proposal_type == ProposalType::RemoveDeployer,
        CustomError::InvalidProposalType
    );
    require!(proposal.is_approved(), CustomError::NotApproved);

    global_config.remove_deployers(vec![proposal.address.clone().unwrap()]);
    proposal.execution_completed()?;

    Ok(())
}

/// Function to add new sub-admins
/// Only the main admin is authorized to perform this action
pub fn add_sub_admins(ctx: Context<UpdateSubAdmins>, addresses: Vec<Pubkey>) -> Result<()> {
    let caller = ctx.accounts.authority.to_account_info().key();
    let global_config = &mut ctx.accounts.global_config;

    // Ensure the caller is the current admin
    require!(global_config.is_owner(&caller), CustomError::Unauthorized);

    // Add the new sub-admin addresses to the global configuration
    global_config.add_sub_admins(addresses.clone());

    // Emit an event indicating the sub-admins have been added
    emit!(events::UpdateSubAdmins {
        update_type: UpdateType::Add,
        addresses
    });

    Ok(())
}

/// Function to remove existing sub-admins
/// Only the main admin is authorized to perform this action
pub fn remove_sub_admins(ctx: Context<UpdateSubAdmins>, addresses: Vec<Pubkey>) -> Result<()> {
    let caller = ctx.accounts.authority.to_account_info().key();
    let global_config = &mut ctx.accounts.global_config;

    // Ensure the caller is the current admin
    require!(global_config.is_owner(&caller), CustomError::Unauthorized);

    // Remove the specified sub-admin addresses from the global configuration
    global_config.remove_sub_admins(addresses.clone());

    // Emit an event indicating the sub-admins have been removed
    emit!(events::UpdateSubAdmins {
        update_type: UpdateType::Remove,
        addresses
    });

    Ok(())
}

/// Accounts struct for adding/removing sub-admins
#[derive(Accounts)]
#[instruction()]
pub struct UpdateMaintainers<'info> {
    #[account(
        mut,
        seeds = [PROPOSAL_TAG],
        bump,
    )]
    pub proposals_list: Account<'info, ProposalsList>,

    /// The account storing the list of creators
    #[account(
        seeds = [CREATOR_TAG],
        bump,
    )]
    pub creators: Box<Account<'info, Creators>>,

    #[account(
        mut,
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
        realloc = calc_global_config_size(global_config.get_len(), 1),
        realloc::payer = executor,
        realloc::zero = false,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(mut)]
    pub executor: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Accounts struct for adding/removing sub-admins
#[derive(Accounts)]
#[instruction(addresses: Vec<Pubkey>)]
pub struct UpdateSubAdmins<'info> {
    #[account(
        mut,
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
        realloc = calc_global_config_size(global_config.get_len(), addresses.len()),
        realloc::payer = authority,
        realloc::zero = false,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Accounts struct for updating the main admin
#[derive(Accounts)]
#[instruction()]
pub struct UpdateGlobalConfig<'info> {
    #[account(
        mut,
        seeds = [PROPOSAL_TAG],
        bump,
    )]
    pub proposals_list: Account<'info, ProposalsList>,

    #[account(
        mut,
        seeds = [GLOBAL_CONFIG_TAG],
        bump
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(mut)]
    pub executor: Signer<'info>,
}
