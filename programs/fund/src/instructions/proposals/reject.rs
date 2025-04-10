use super::*;

pub fn handler(ctx: Context<ApproveProposal>, proposal_id: u32) -> Result<bool> {
    let global_config = &ctx.accounts.global_config;
    let proposals_list = &mut ctx.accounts.proposals_list;

    require!(
        global_config.is_admin(ctx.accounts.approver.key),
        CustomError::Unauthorized
    );

    let proposal = proposals_list
        .proposals
        .iter_mut()
        .find(|p| p.id == proposal_id)
        .ok_or(CustomError::NotFound)?;

    require!(!proposal.is_executed(), CustomError::AlreadyExecuted);

    proposal.rejected()?;

    Ok(proposal.is_rejected())
}
