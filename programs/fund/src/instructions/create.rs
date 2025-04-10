use super::*;

/// Function to create a new token
/// This function ensures the creator has the rights to create a token,
/// updates the necessary accounts, and initializes the token metadata.
pub fn handler(ctx: Context<CreateToken>, params: structs::create::Params) -> Result<()> {
    let creators = &mut ctx.accounts.creators;
    let creator_info = &mut ctx.accounts.creator_info;
    let caller = ctx.accounts.payer.key;

    // Ensure the creator has the necessary rights to create a token
    creators.is_creator(caller, None)?;

    let dao_list = &mut ctx.accounts.dao_list;
    dao_list.add(params.name.to_string());

    let fund_store = &mut ctx.accounts.fund_data_store;
    // Add the new token details to the fund store
    fund_store.add(&params, creator_info.fee_percent, *caller)?;
    creator_info.token = params.name.to_string();

    // TODO: @Tarun Add fundRaise Date
    // Define metadata for the new token
    let token_data = DataV2 {
        name: params.name.to_string(),
        symbol: params.symbol,
        uri: params.uri,
        seller_fee_basis_points: 0,
        creators: Some(vec![mpl_token_metadata::types::Creator {
            address: *caller,
            verified: false,
            share: 100,
        }]),
        collection: None,
        uses: None,
    };

    let seeds = &[MINT_TAG, params.name.as_bytes(), &[ctx.bumps.mint_account]];
    let signer = [&seeds[..]];

    // Create the Metadata account for the new token
    create_metadata_accounts_v3(
        CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                payer: ctx.accounts.payer.to_account_info(),
                update_authority: ctx.accounts.mint_account.to_account_info(),
                mint: ctx.accounts.mint_account.to_account_info(),
                metadata: ctx.accounts.metadata.to_account_info(),
                mint_authority: ctx.accounts.payer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            &signer,
        ),
        token_data,
        true,
        true,
        None,
    )?;

    mpl_token_metadata::instructions::SignMetadataCpi::new(
        &ctx.accounts.token_program,
        mpl_token_metadata::instructions::SignMetadataCpiAccounts {
            metadata: &ctx.accounts.metadata.to_account_info(),
            creator: &ctx.accounts.payer.to_account_info(),
        },
    )
    .invoke()?;

    // Emit an event to indicate successful token creation
    emit!(events::Create { name: params.name });

    Ok(())
}

#[derive(Accounts)]
#[instruction(params: structs::create::Params)]
pub struct CreateToken<'info> {
    /// Account storing creator information
    #[account(
        mut,
        seeds = [CREATOR_TAG],
        bump,
    )]
    pub creators: Box<Account<'info, Creators>>,

    /// Account holding specific creator data
    #[account(
        mut,
        seeds = [CREATOR_TAG, payer.key().as_ref()],
        bump,
    )]
    pub creator_info: Box<Account<'info, CreatorInfo>>,

    /// Mint account for the newly created token
    #[account(
        init,
        seeds = [MINT_TAG, params.name.as_bytes()],
        bump,
        payer = payer,
        mint::token_program = token_program,
        mint::decimals = params.decimals,
        mint::authority = payer,
        mint::freeze_authority = payer,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: Metadata account for the token
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// Fund data store account to track token information
    #[account(
        init,
        seeds = [FUND_DATA_TAG, mint_account.key().as_ref()],
        bump,
        space = size_of::<FundDataStore>() + 32,
        payer = payer,
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    /// Token counter account to track the number of tokens created
    #[account(
        mut,
        seeds = [DAO_TAG],
        bump,
    )]
    pub dao_list: Box<Account<'info, DaoList>>,

    /// Account paying for the transaction fees
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Solana System Program
    pub system_program: Program<'info, System>,

    /// Solana Token Program
    pub token_program: Program<'info, Token>,

    /// Program for handling associated token accounts
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// Metaplex Token Metadata Program
    pub token_metadata_program: Program<'info, Metadata>,

    /// Rent system variable
    pub rent: Sysvar<'info, Rent>,
}
