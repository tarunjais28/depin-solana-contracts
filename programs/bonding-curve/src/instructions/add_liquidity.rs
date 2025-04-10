use super::*;

/// Function to add liquidity to the liquidity pool.
/// This function ensures that the caller has sub-admin rights, transfers the specified
/// SOL and token amounts, and updates the trade account accordingly.
///
/// # Arguments
/// * `ctx` - The transaction context containing all necessary accounts.
/// * `params` - Parameters for adding liquidity, including token name and fee percent.
///
/// # Returns
/// * `Result<()>` - Returns `Ok(())` if successful, otherwise an error.
pub fn handler(ctx: Context<AddLiquidity>, proposal_id: u32) -> Result<()> {
    // Ensure the payer has sub-admin rights before proceeding.
    is_owner(
        *ctx.accounts.payer.key,
        ctx.accounts.fund.to_account_info(),
        ctx.accounts.fund_global_config.to_account_info(),
    )?;

    let cpi_accounts = fund::cpi::accounts::GetProposalData {
        global_config: ctx.accounts.fund_global_config.to_account_info(),
        proposals_list: ctx.accounts.proposals_list.to_account_info(),
        executer: ctx.accounts.payer.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(ctx.accounts.fund.to_account_info(), cpi_accounts);

    let proposal =
        fund::cpi::get_proposal_data(cpi_ctx, proposal_id, fund::ProposalType::PublishToAMM)?.get();

    let cpi_accounts = fund::cpi::accounts::MoveToLP {
        global_config: ctx.accounts.fund_global_config.to_account_info(),
        escrow_sol_account: ctx.accounts.escrow_sol_account.to_account_info(),
        fund_data_store: ctx.accounts.fund_data_store.to_account_info(),
        escrow_mint_account: ctx.accounts.escrow_mint_account.to_account_info(),
        escrow_mint_ata: ctx.accounts.escrow_mint_ata.to_account_info(),
        mint_account: ctx.accounts.mint_account.to_account_info(),
        to_account: ctx.accounts.sol_reserve.to_account_info(),
        to_ata: ctx.accounts.token_reserve.to_account_info(),
        payer: ctx.accounts.payer.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        caller_program: ctx.accounts.bonding_curve_program.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(ctx.accounts.fund.to_account_info(), cpi_accounts);

    let rent = ctx.accounts.sol_reserve.lamports();

    fund::cpi::move_to_lp(
        cpi_ctx,
        proposal
            .dao_name
            .ok_or(fund::errors::CustomError::NotFound)?,
    )?;

    // Reload account to update the data
    ctx.accounts.token_reserve.reload()?;

    // Update the trade account with the new liquidity details
    let trade = &mut ctx.accounts.trade;
    trade.sol_reserve = ctx.accounts.sol_reserve.lamports() - rent;
    trade.token_reserve = ctx.accounts.token_reserve.amount;
    trade.fee_percent = proposal.transfer_amount.unwrap_or_default() as u32;

    // Emit an event to notify that liquidity has been successfully added
    emit!(events::LiquidityAdded {
        token: ctx.accounts.mint_account.key(),
        token_reserve: trade.token_reserve,
        sol_reserve: trade.sol_reserve
    });

    Ok(())
}

/// Accounts required for the `AddLiquidity` instruction.
/// This struct defines the necessary accounts used in the transaction.
#[derive(Accounts)]
#[instruction()]
pub struct AddLiquidity<'info> {
    /// Global configuration account that holds sub-admin and fee collection details.
    /// CHECK: Fund Data Store
    #[account()]
    pub fund_global_config: AccountInfo<'info>,

    /// The escrow account storing SOL before it is transferred
    /// CHECK: Escrow SOL account where committed SOL is stored
    #[account(mut)]
    pub escrow_sol_account: AccountInfo<'info>,

    /// The fund data store tracking fundraising status
    /// CHECK: Fund Data Store
    #[account(mut)]
    pub fund_data_store: AccountInfo<'info>,

    /// The escrow account that holds the minted tokens
    /// CHECK: Escrow account for holding minted tokens
    #[account(mut)]
    pub escrow_mint_account: AccountInfo<'info>,

    /// The escrow associated token account (ATA) for storing tokens before transfer
    /// CHECK: Escrow ATA account
    #[account(mut)]
    pub escrow_mint_ata: AccountInfo<'info>,

    /// CHECK: Fund Program Address
    #[account(executable, address = fund::ID)]
    pub fund: AccountInfo<'info>,

    /// CHECK: Ensure this is bonding-curve program itself
    #[account(executable, address = crate::ID)]
    pub bonding_curve_program: UncheckedAccount<'info>,

    /// Trade account that stores liquidity pool details.
    #[account(
        init,
        seeds = [TRADE_TAG, mint_account.key().as_ref()],
        bump,
        payer = payer,
        space = calc_trade_size()
    )]
    pub trade: Box<Account<'info, Trade>>,

    /// SOL reserve account, which stores SOL liquidity.
    /// CHECK: This account holds the reserved SOL liquidity.
    #[account(
        mut,
        seeds = [RESERVE_TAG, SOL_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub sol_reserve: AccountInfo<'info>,

    /// Token reserve account, which stores token liquidity.
    /// CHECK: This account is used to hold reserved tokens for the liquidity pool.
    #[account(
        mut,
        seeds = [RESERVE_TAG, MINT_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub token_reserve: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The mint account associated with the token being added to the liquidity pool.
    #[account(mut)]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: Creators
    pub creators: AccountInfo<'info>,

    /// CHECK: Proposal List
    #[account(mut)]
    pub proposals_list: AccountInfo<'info>,

    /// Payer account responsible for signing and funding the transaction.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Token program required for token-related operations.
    pub token_program: Program<'info, Token>,

    /// Associated Token Program used for managing ATA accounts.
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// System program required for system-level operations, such as transferring SOL.
    pub system_program: Program<'info, System>,
}
