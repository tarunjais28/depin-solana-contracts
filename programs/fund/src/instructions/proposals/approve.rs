use super::*;

pub fn handler(ctx: Context<ApproveProposal>, proposal_id: u32) -> Result<(bool, u8)> {
    let global_config = &ctx.accounts.global_config;
    let proposals_list = &mut ctx.accounts.proposals_list;
    let proposal = proposals_list
        .proposals
        .iter_mut()
        .find(|p| p.id == proposal_id);

    require!(proposal.is_some(), CustomError::NotFound);
    let proposal = proposal.unwrap();

    match proposal.approve_type {
        ApproverType::Admin => {
            require!(
                global_config.is_admin(ctx.accounts.approver.key),
                CustomError::Unauthorized
            );
        }
        ApproverType::Deployer => {
            require!(
                global_config.is_deployer(ctx.accounts.approver.key),
                CustomError::Unauthorized
            );
            require!(
                proposal.address.is_some()
                    && proposal.address.unwrap() == ctx.accounts.approver.key(),
                CustomError::AccountMisMatch
            );
        }
    }

    require!(!proposal.is_executed(), CustomError::AlreadyExecuted);

    let approver = ctx.accounts.approver.key();
    require!(
        !proposal.approvers.contains(&approver),
        CustomError::AlreadyApproved
    );
    proposal.approvers.push(approver);

    let pending_approvals = proposal
        .approver_threshold
        .saturating_sub(proposal.approvers.len() as u8);
    proposal.approved()?;

    Ok((proposal.is_approved(), pending_approvals))
}

#[derive(Accounts)]
pub struct ApproveProposal<'info> {
    #[account(
        mut,
        seeds = [GLOBAL_CONFIG_TAG],
        bump
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(
        mut,
        seeds = [PROPOSAL_TAG],
        bump,
    )]
    pub proposals_list: Account<'info, ProposalsList>,

    #[account(mut)]
    pub approver: Signer<'info>,
}
