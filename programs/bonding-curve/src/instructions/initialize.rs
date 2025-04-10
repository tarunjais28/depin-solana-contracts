use super::*;

/// Function to initialize the contract.
/// This function sets up the global configuration and assigns the initial admin.
///
/// # Arguments
/// * `ctx` - The transaction context containing all necessary accounts.
/// * `fees_collection_account` - The public key of the account where collected fees will be stored.
///
/// # Returns
/// * `Result<()>` - Returns `Ok(())` if successful, otherwise an error.
pub fn handler(ctx: Context<Initialize>, fees_collection_account: Pubkey) -> Result<()> {
    // Initialize and configure the global contract settings
    let global_config = &mut ctx.accounts.global_config;
    global_config.save(fees_collection_account);

    // Emit an event signaling the contract initialization
    emit!(events::Initiated {});

    Ok(())
}

/// Accounts required for the `Initialize` instruction.
/// This struct defines the necessary accounts used during contract initialization.
#[derive(Accounts)]
#[instruction()]
pub struct Initialize<'info> {
    /// The global configuration account that holds contract settings.
    #[account(
        init,                                    // This account is being initialized
        seeds = [GLOBAL_CONFIG_TAG],             // Use a predefined seed to derive its address
        bump,                                    // Automatically calculate the bump
        payer = authority,                       // The initializing authority pays for account creation
        space = size_of::<GlobalConfig>() + 32   // Allocate space for the config data
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    /// The account that is initializing the contract (also the initial admin).
    #[account(mut)]
    pub authority: Signer<'info>,

    /// The Solana System Program used for account creation and rent exemption.
    pub system_program: Program<'info, System>,
}
