use std::str::FromStr;

use super::*;

pub fn handler(ctx: Context<MoveToLP>, token: String) -> Result<()> {
    let global_config = &ctx.accounts.global_config;
    let fund_store = &mut ctx.accounts.fund_data_store;

    // Ensure the caller has sub-admin rights before proceeding
    require!(
        global_config.is_owner(ctx.accounts.payer.key),
        CustomError::Unauthorized
    );

    let expected_caller = Pubkey::from_str("ADgy4JNoyTP8X78cC9nV3sw8Wk9Yz6mNX49Y7YCzzkJX")
        .map_err(|_| CustomError::ParseError)?;
    require!(
        ctx.accounts.caller_program.key() == expected_caller,
        CustomError::Unauthorized
    );

    // Ensure that the DAO has reached the fundraising success status before allowing withdrawals
    require!(
        fund_store.status.eq(&Status::FundraisingSuccess),
        CustomError::PermissionDenied
    );

    // Update status as Trade
    fund_store.update_status(Status::Trade)?;

    let mint_key = ctx.accounts.mint_account.key();

    let (token_amount, sol_amount) =
        fund_store.calc_lp_pairs(ctx.accounts.mint_account.supply as u128);

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
        to: ctx.accounts.to_account.to_account_info(),           // Destination: Recipient's account
    };

    // Execute the SOL transfer from the escrow account to the recipient
    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            cpi_accounts,
            &signer,
        ),
        sol_amount, // Amount of SOL to transfer
    )?;

    // Define signer seeds for the escrow token account
    let seeds = &[
        ESCROW_TAG,
        MINT_TAG,
        mint_key.as_ref(),
        &[ctx.bumps.escrow_mint_account],
    ];
    let signer = [&seeds[..]];

    // Prepare an SPL token transfer instruction
    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow_mint_ata.to_account_info(), // Source: Escrow's token ATA
        to: ctx.accounts.to_ata.to_account_info(),            // Destination: Recipient's ATA
        authority: ctx.accounts.escrow_mint_account.to_account_info(), // Authority over the escrow tokens
    };

    // Execute the token transfer from escrow to recipient's associated token account (ATA)
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            &signer,
        ),
        token_amount, // Amount of tokens to transfer
    )?;

    // Emit a withdrawal event for logging and tracking purposes
    emit!(events::MoveToLP {
        token: token,
        token_amount,
        sol_amount,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(token: String)]
pub struct MoveToLP<'info> {
    /// Global configuration storing administrative permissions
    #[account(
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

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

    /// The escrow account that holds the minted tokens
    /// CHECK: Escrow account for holding minted tokens
    #[account(
        mut,
        seeds = [ESCROW_TAG, MINT_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub escrow_mint_account: AccountInfo<'info>,

    /// The escrow associated token account (ATA) for storing tokens before transfer
    #[account(mut)]
    pub escrow_mint_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The mint account for the token being transferred
    #[account(
        mut,
        seeds = [MINT_TAG, token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// The recipient's account that will receive the SOL or tokens
    /// CHECK: This is the user's main account.
    #[account(mut)]
    pub to_account: AccountInfo<'info>,

    /// The recipient's associated token account (ATA) for receiving tokens
    #[account(mut)]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The payer who initiates the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Must be the executable bonding-curve program
    #[account(executable)]
    pub caller_program: UncheckedAccount<'info>,

    /// The SPL Token program
    pub token_program: Program<'info, Token>,

    /// The SPL Associated Token program
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// The Solana System program
    pub system_program: Program<'info, System>,
}
