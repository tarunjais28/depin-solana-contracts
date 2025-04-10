use super::*;

pub fn handler(
    ctx: Context<CreateCreatorProposal>,
    token: String,
    transfer_amount: u64,
    deployer_address: Pubkey,
) -> Result<u32> {
    let creators = &ctx.accounts.creators;
    let fund_store = &ctx.accounts.fund_data_store;

    creators.is_creator(
        &ctx.accounts.signer.key(),
        ctx.accounts.metadata.creators.clone(),
    )?;

    require!(
        matches!(
            fund_store.status,
            Status::FundraisingSuccess | Status::Trade
        ),
        CustomError::PermissionDenied
    );

    fund_store.check_deployer_withdrawl(transfer_amount)?;

    create_creator_proposal(
        ctx,
        ProposalType::TransferSolToDeployer,
        Some(deployer_address),
        1,
        Some(token),
        Some(transfer_amount),
        ExecutorType::Creator,
        ApproverType::Deployer,
    )
}
