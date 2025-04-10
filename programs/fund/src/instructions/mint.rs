use super::*;

/// Instruction handler for minting tokens
///
/// This function handles the minting of new tokens to an escrow account.
/// The minted tokens are held in an escrow account until they are claimed or transferred.
///
/// # Arguments
/// * `ctx` - The context containing all account information
/// * `params` - Parameters for the mint operation including token name and amount
///
/// # Errors
/// * `AmountCantBeZero` - When attempting to mint 0 tokens
/// * Other SPL Token errors from mint_to operation
pub fn handler(ctx: Context<MintToken>, params: structs::mint::Params) -> Result<()> {
    // Generate the seeds for signing as the mint authority
    let seeds = &[MINT_TAG, params.token.as_bytes(), &[ctx.bumps.mint_account]];
    let signer = [&seeds[..]];
    let cpi_program = ctx.accounts.token_program.to_account_info();

    // Validate that mint amount is greater than 0
    require_gt!(params.amount, 0, CustomError::AmountCantBeZero);

    // Create the token mint instruction
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint_account.to_account_info(),
        to: ctx.accounts.escrow_mint_ata.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };

    // Execute the mint instruction with PDA signer
    token::mint_to(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, &signer),
        params.amount,
    )?;

    // Update the mint authority to prevent further minting
    ctx.accounts.update_mint_authority(&signer)?;

    // TODO: @Tarun Where will we get the token address
    // Emit event for the mint operation
    emit!(params.to_event());

    Ok(())
}

/// Account validation struct for the mint instruction
#[derive(Accounts)]
#[instruction(params: structs::mint::Params)]
pub struct MintToken<'info> {
    /// The mint account for the token being minted
    /// This account must be initialized with the correct seed
    #[account(
        mut,
        seeds = [MINT_TAG, params.token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// The escrow account that will be authorized to mint tokens
    /// This is a PDA that acts as an intermediary holder
    /// CHECK: This is the escrow account that we want to authorize to mint tokens
    #[account(
        init_if_needed,
        seeds = [ESCROW_TAG, MINT_TAG, mint_account.key().as_ref()],
        bump,
        payer = authority,
        space = 8
    )]
    pub escrow_mint_account: AccountInfo<'info>,

    /// The associated token account for the escrow to hold minted tokens
    /// This account is initialized if it doesn't exist
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = mint_account,
        associated_token::authority = escrow_mint_account,
        associated_token::token_program = token_program,
    )]
    pub escrow_mint_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The authority that can mint tokens
    /// Must be a signer and pays for any account initialization
    #[account(mut)]
    pub authority: Signer<'info>,

    /// The SPL Token program account
    pub token_program: Program<'info, Token>,

    /// The Solana System program account
    pub system_program: Program<'info, System>,

    /// The SPL Associated Token program account
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> MintToken<'info> {
    /// Updates the mint authority to None, effectively disabling further minting
    ///
    /// # Arguments
    /// * `signer` - The PDA signer seeds for the mint account
    ///
    /// # Returns
    /// * `ProgramResult` indicating success or failure
    #[inline(never)]
    fn update_mint_authority(&self, signer: &[&[&[u8]]; 1]) -> ProgramResult {
        let cpi_accounts = SetAuthority {
            current_authority: self.authority.to_account_info(),
            account_or_mint: self.mint_account.to_account_info(),
        };
        let cpi_ctx =
            CpiContext::new_with_signer(self.token_program.to_account_info(), cpi_accounts, signer);

        // Remove mint authority to prevent further minting
        set_authority(
            cpi_ctx,
            spl_token::instruction::AuthorityType::MintTokens,
            None,
        )?;

        Ok(())
    }
}
