use super::*;

/// Function to create token
pub fn handler(ctx: Context<CreateDao>, params: structs::create::Params) -> Result<()> {
    let create_params = params.to_create_token_params();
    let mint_params = params.to_mint_params();
    let cpi_program = ctx.accounts.fund.to_account_info();

    let cpi_accounts = fund::cpi::accounts::CreateToken {
        mint_account: ctx.accounts.mint_account.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        payer: ctx.accounts.payer.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        creators: ctx.accounts.creators.to_account_info(),
        creator_info: ctx.accounts.creator_info.to_account_info(),
        metadata: ctx.accounts.metadata.to_account_info(),
        fund_data_store: ctx.accounts.fund_data_store.to_account_info(),
        dao_list: ctx.accounts.dao_list.to_account_info(),
        associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
        token_metadata_program: ctx.accounts.token_metadata_program.to_account_info(),
        rent: ctx.accounts.rent.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);

    fund::cpi::create(cpi_ctx, create_params)?;

    let cpi_accounts = fund::cpi::accounts::MintToken {
        mint_account: ctx.accounts.mint_account.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
        escrow_mint_account: ctx.accounts.escrow_mint_account.to_account_info(),
        escrow_mint_ata: ctx.accounts.escrow_mint_ata.to_account_info(),
        authority: ctx.accounts.payer.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    fund::cpi::mint(cpi_ctx, mint_params)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(params: structs::create::Params)]
pub struct CreateDao<'info> {
    /// CHECK: Creator
    #[account(mut)]
    pub creators: AccountInfo<'info>,

    /// CHECK: Creator Info
    #[account(mut)]
    pub creator_info: AccountInfo<'info>,

    /// CHECK: Mint Account
    #[account(mut)]
    pub mint_account: AccountInfo<'info>,

    /// CHECK: New Metaplex Account being created
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// CHECK: PDA for storing fund data
    #[account(mut)]
    pub fund_data_store: AccountInfo<'info>,

    /// CHECK: Dao List
    #[account(mut)]
    pub dao_list: AccountInfo<'info>,

    /// CHECK: This is the escrow account that we want to authorise mint tokens
    #[account(mut)]
    pub escrow_mint_account: AccountInfo<'info>,

    /// CHECK: This is the escrow ata that we want to hold minted tokens
    #[account(mut)]
    pub escrow_mint_ata: AccountInfo<'info>,

    /// CHECK: Signer of the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Fees collection account
    #[account(mut)]
    pub fees_collection_account: AccountInfo<'info>,

    /// CHECK: Fund Program Address
    #[account(executable, address = fund::ID)]
    pub fund: AccountInfo<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub token_metadata_program: Program<'info, Metadata>,

    pub rent: Sysvar<'info, Rent>,
}
