use super::*;

pub fn handler(ctx: Context<CreateDaoProposal>, token: String) -> Result<u32> {
    let global_config = &ctx.accounts.global_config;
    let fund_store = &mut ctx.accounts.fund_data_store;

    require!(
        global_config.is_sub_admin(ctx.accounts.signer.key),
        CustomError::Unauthorized
    );

    require!(
        matches!(
            fund_store.status,
            Status::Created
                | Status::FundraisingVip
                | Status::FundraisingParty
                | Status::FundraisingSuccess
        ),
        CustomError::PermissionDenied
    );

    create_dao_proposal(
        ctx,
        ProposalType::BlockListDAO,
        None,
        1,
        Some(token),
        None,
        ExecutorType::Admin,
        ApproverType::Admin,
    )
}
