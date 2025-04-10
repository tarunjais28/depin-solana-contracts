use super::*;

/// Function to add liquidity
pub fn handler(ctx: Context<AddLiquidity>, proposal_id: u32) -> Result<()> {
    let cpi_program = ctx.accounts.bonding_curve_program.to_account_info();

    let cpi_accounts = bonding_curve::cpi::accounts::InitTrade {
        fund_global_config: ctx.accounts.fund_global_config.to_account_info(),
        sol_reserve: ctx.accounts.sol_reserve.to_account_info(),
        token_reserve: ctx.accounts.token_reserve.to_account_info(),
        mint_account: ctx.accounts.mint_account.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        payer: ctx.accounts.payer.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        fund: ctx.accounts.fund.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);

    bonding_curve::cpi::init_trade(cpi_ctx)?;

    let cpi_accounts = bonding_curve::cpi::accounts::AddLiquidity {
        fund_global_config: ctx.accounts.fund_global_config.to_account_info(),
        sol_reserve: ctx.accounts.sol_reserve.to_account_info(),
        token_reserve: ctx.accounts.token_reserve.to_account_info(),
        mint_account: ctx.accounts.mint_account.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
        escrow_mint_account: ctx.accounts.escrow_mint_account.to_account_info(),
        escrow_mint_ata: ctx.accounts.escrow_mint_ata.to_account_info(),
        payer: ctx.accounts.payer.to_account_info(),
        escrow_sol_account: ctx.accounts.escrow_sol_account.to_account_info(),
        fund_data_store: ctx.accounts.fund_data_store.to_account_info(),
        fund: ctx.accounts.fund.to_account_info(),
        trade: ctx.accounts.trade.to_account_info(),
        creators: ctx.accounts.creators.to_account_info(),
        proposals_list: ctx.accounts.proposals_list.to_account_info(),
        bonding_curve_program: ctx.accounts.bonding_curve_program.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    bonding_curve::cpi::add_liquidity(cpi_ctx, proposal_id)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct AddLiquidity<'info> {
    /// CHECK: Fund Global Config
    #[account()]
    pub fund_global_config: AccountInfo<'info>,

    /// CHECK: Bonding Curve Global Config
    #[account()]
    pub bonding_curve_global_config: AccountInfo<'info>,

    /// CHECK: Escrow Sol Account
    #[account(mut)]
    pub escrow_sol_account: AccountInfo<'info>,

    /// CHECK: Mint Account
    #[account(mut)]
    pub mint_account: AccountInfo<'info>,

    /// CHECK: Liquidity Pool Account
    #[account(mut)]
    pub trade: AccountInfo<'info>,

    /// CHECK: PDA for storing fund data
    #[account(mut)]
    pub fund_data_store: AccountInfo<'info>,

    /// CHECK: Token Counter
    #[account(mut)]
    pub sol_reserve: AccountInfo<'info>,

    /// CHECK: Token Reserve
    #[account(mut)]
    pub token_reserve: AccountInfo<'info>,

    /// CHECK: This is the escrow account that we want to authorise mint tokens
    #[account(mut)]
    pub escrow_mint_account: AccountInfo<'info>,

    /// CHECK: This is the escrow ata that we want to hold minted tokens
    #[account(mut)]
    pub escrow_mint_ata: AccountInfo<'info>,

    /// CHECK: Creators
    pub creators: AccountInfo<'info>,

    /// CHECK: Proposal List
    #[account(mut)]
    pub proposals_list: AccountInfo<'info>,

    /// CHECK: Signer of the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Fund Program Address
    #[account(executable, address = fund::ID)]
    pub fund: AccountInfo<'info>,

    /// CHECK: Bonding Curve Program Address
    #[account(executable, address = bonding_curve::ID)]
    pub bonding_curve_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,
}
