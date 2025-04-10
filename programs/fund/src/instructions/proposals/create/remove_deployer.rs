use super::*;

pub fn handler(ctx: Context<CreateProposal>, deployer_address: Pubkey) -> Result<u32> {
    let global_config = &ctx.accounts.global_config;

    require!(
        global_config.is_sub_admin(ctx.accounts.signer.key),
        CustomError::Unauthorized
    );

    create_proposal(
        ctx,
        ProposalType::RemoveDeployer,
        Some(deployer_address),
        1,
        None,
        None,
        ExecutorType::Admin,
        ApproverType::Admin,
    )
}
