use super::*;

/// Function to transfer tokens or SOL from the escrow account to a recipient.
/// This function ensures that only authorized sub-admins can perform transfers
/// and that the DAO fundraising goal has been met before transferring funds.
///
/// # Arguments
/// * `ctx` - The execution context containing all relevant accounts
/// * `params` - Parameters for the transfer operation including amount and type
///
/// # Errors
/// * `Unauthorized` - If the caller is not a sub-admin
/// * `PermissionDenied` - If the DAO has not met the fundraising goal
pub fn handler(
    ctx: Context<TransferSolToDeployer>,
    params: structs::transfer::Params,
) -> Result<()> {
    let creator = &ctx.accounts.creators;
    let fund_store = &ctx.accounts.fund_data_store;
    let proposals_list = &mut ctx.accounts.proposals_list;

    // Ensure the caller has creator's rights
    creator.is_creator(
        ctx.accounts.payer.key,
        ctx.accounts.metadata.creators.clone(),
    )?;

    let proposal = proposals_list
        .perform_execution(params.proposal_id, &ProposalType::TransferSolToDeployer)?;

    // Ensure that the DAO has reached the fundraising success status
    require!(
        fund_store.status.eq(&Status::FundraisingSuccess) || fund_store.status.eq(&Status::Trade),
        CustomError::DaoNotInTrading
    );

    // Ensure the deployer address is valid
    let deployer_address = &ctx.accounts.deployer_address.key();
    require!(
        proposal
            .address
            .ok_or(CustomError::AddressNotFound)?
            .eq(deployer_address),
        CustomError::AccountMisMatch
    );
    let mint_key = ctx.accounts.mint_account.key();

    let seeds = &[
        ESCROW_TAG,
        SOL_TAG,
        mint_key.as_ref(),
        &[ctx.bumps.escrow_sol_account],
    ];
    let signer = [&seeds[..]];

    // Prepare Solana system program transfer instruction
    let cpi_accounts = system_program::Transfer {
        from: ctx.accounts.escrow_sol_account.to_account_info(),
        to: ctx.accounts.deployer_address.to_account_info(),
    };

    let amount = proposal.transfer_amount.unwrap_or_default();

    fund_store.check_deployer_withdrawl(amount)?;

    if fund_store.is_new_deployer(deployer_address) {
        upgrade_account_size(
            ctx.accounts.to_upgrade_account_ctx(),
            fund_store.realloc_for_deployer(),
        )?;
    }

    let fund_store = &mut ctx.accounts.fund_data_store;
    fund_store.update_deployer_amount(*deployer_address, amount)?;

    // Execute the SOL transfer from escrow to recipient
    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            cpi_accounts,
            &signer,
        ),
        amount,
    )?;

    // Emit a transfer event for logging purposes
    emit!(events::TransferredSolToDeployer {
        deployer: *deployer_address,
        amount
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(params: structs::transfer::Params)]
pub struct TransferSolToDeployer<'info> {
    /// Account storing creator information
    #[account(
        seeds = [CREATOR_TAG],
        bump,
    )]
    pub creators: Box<Account<'info, Creators>>,

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
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    /// The mint account for the token being transferred
    #[account(
        mut,
        seeds = [MINT_TAG, params.token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: Metadata account for the token
    #[account()]
    pub metadata: Box<Account<'info, MetadataAccount>>,

    /// The recipient's account that will receive the SOL or tokens
    /// CHECK: This is the user's main account.
    #[account(mut)]
    pub deployer_address: AccountInfo<'info>,

    /// The payer who initiates the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The Solana System program
    pub system_program: Program<'info, System>,
}

impl<'info> TransferSolToDeployer<'info> {
    pub fn to_upgrade_account_ctx(&self) -> Context<'_, '_, '_, 'info, UpgradeAccount<'info>> {
        let upgrade = UpgradeAccount {
            account: self.fund_data_store.to_account_info(),
            payer: self.payer.clone(),
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
