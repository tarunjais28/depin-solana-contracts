use super::*;

pub fn handler(ctx: Context<CreateCreatorProposal>, token: String, amount: u64) -> Result<u32> {
    let creators = &ctx.accounts.creators;
    let fund_store = &mut ctx.accounts.fund_data_store;
    let caller = &ctx.accounts.signer.key();
    creators.is_creator(caller, ctx.accounts.metadata.creators.clone())?;

    require!(
        fund_store.status.eq(&Status::FundraisingSuccess) || fund_store.status.eq(&Status::Trade),
        CustomError::InValidDaoStatus
    );

    require!(fund_store.created_by.eq(caller), CustomError::Unauthorized);

    fund_store.check_creator_withdrawl(amount)?;

    create_creator_proposal(
        ctx,
        ProposalType::TransferSolToCreator,
        Some(*caller),
        1,
        Some(token),
        Some(amount),
        ExecutorType::Admin,
        ApproverType::Admin,
    )
}
