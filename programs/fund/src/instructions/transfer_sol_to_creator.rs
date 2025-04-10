use super::*;

pub fn handler(
    ctx: Context<TransferSolToCreator>,
    params: structs::transfer::Params,
) -> Result<()> {
    let global_config = &ctx.accounts.global_config;
    let fund_store = &mut ctx.accounts.fund_data_store;
    let proposals_list = &mut ctx.accounts.proposals_list;

    // Ensure the caller has sub-admin rights before proceeding
    require!(
        global_config.is_sub_admin(ctx.accounts.payer.key),
        CustomError::Unauthorized
    );

    let proposal = proposals_list
        .perform_execution(params.proposal_id, &ProposalType::TransferSolToCreator)?;

    let creator_address = ctx.accounts.creator_address.key;
    // Ensure valid creator
    require!(
        proposal
            .address
            .ok_or(CustomError::AddressNotFound)?
            .eq(creator_address),
        CustomError::AccountMisMatch
    );

    require!(
        fund_store.status.eq(&Status::FundraisingSuccess) || fund_store.status.eq(&Status::Trade),
        CustomError::DaoNotInTrading
    );

    let withdraw_amount = proposal.transfer_amount.unwrap_or_default();
    require!(withdraw_amount > 0, CustomError::AmountCannotBeZero);

    fund_store.check_creator_withdrawl(withdraw_amount)?;
    fund_store.update_creator_amount(withdraw_amount)?;

    let mint_key = ctx.accounts.mint_account.key();

    // Define signer seeds for the escrow SOL account
    let seeds = &[
        ESCROW_TAG,
        SOL_TAG,
        mint_key.as_ref(),
        &[ctx.bumps.escrow_sol_account],
    ];
    let signer = [&seeds[..]];

    // Prepare a Solana system program transfer instruction
    let cpi_accounts = system_program::Transfer {
        from: ctx.accounts.escrow_sol_account.to_account_info(), // Source: Escrow account
        to: ctx.accounts.creator_address.to_account_info(),      // Destination: Recipient's account
    };

    // Execute the SOL transfer from the escrow account to the recipient
    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            cpi_accounts,
            &signer,
        ),
        withdraw_amount, // Amount of SOL to transfer
    )?;

    // Emit a withdrawal event for logging and tracking purposes
    emit!(events::TransferredSolToCreator {
        creator: *creator_address,
        amount: withdraw_amount
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(params: structs::transfer::Params)]
pub struct TransferSolToCreator<'info> {
    /// Global configuration storing administrative permissions
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

    /// The escrow account storing SOL before it is transferred
    /// CHECK: Escrow SOL account where committed SOL is stored
    #[account(
        mut,
        seeds = [ESCROW_TAG, SOL_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub escrow_sol_account: AccountInfo<'info>,

    /// The fund data store tracking fundraising status
    #[account(
        mut,
        seeds = [FUND_DATA_TAG, mint_account.key().as_ref()],
        bump,
        realloc = fund_data_store.realloc_for_creator(),
        realloc::payer = payer,
        realloc::zero = false,
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    /// The mint account for the token being transferred
    #[account(
        mut,
        seeds = [MINT_TAG, params.token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// The recipient's account that will receive the SOL
    /// CHECK: This is the user's main account.
    #[account(mut)]
    pub creator_address: AccountInfo<'info>,

    /// The payer who initiates the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The Solana System program
    pub system_program: Program<'info, System>,
}
