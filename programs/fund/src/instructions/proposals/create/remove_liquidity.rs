use super::*;

pub fn handler(ctx: Context<CreateDaoProposal>, token: String, percent: u32) -> Result<u32> {
    let global_config = &ctx.accounts.global_config;
    let fund_store = &mut ctx.accounts.fund_data_store;

    require!(
        global_config.is_sub_admin(ctx.accounts.signer.key),
        CustomError::Unauthorized
    );

    require!(
        fund_store.status.eq(&Status::Trade),
        CustomError::PermissionDenied
    );

    create_dao_proposal(
        ctx,
        ProposalType::RemoveLiquidity,
        None,
        1,
        Some(token),
        Some(percent.into()),
        ExecutorType::Admin,
        ApproverType::Admin,
    )
}
