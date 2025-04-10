use super::*;

/// Function to initialize the contract
/// This function sets up the global configuration, fee account, and token counter.
pub fn handler(ctx: Context<Initialize>, fees_collection_account: Pubkey) -> Result<()> {
    // Get the authority's public key
    let caller = ctx.accounts.authority.to_account_info().key();

    // Initialize and save the global configuration
    let global_config = &mut ctx.accounts.global_config;
    global_config.save(caller);

    // Set the fees collection account in the fee account
    let fee_account = &mut ctx.accounts.fee_account;
    fee_account.fees_collection_account = fees_collection_account;

    // Emit an event to indicate successful initialization
    emit!(events::Init {
        admin: caller,
        sub_admin: caller
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct Initialize<'info> {
    /// Global configuration account, initialized during contract setup
    #[account(
        init,
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
        payer = authority,
        space = size_of::<GlobalConfig>() + 32
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    /// Fee account, used to store fee collection settings
    #[account(
        init,
        seeds = [FEE_TAG],
        bump,
        payer = authority,
        space = FeeAccount::INIT_SPACE + 8
    )]
    pub fee_account: Box<Account<'info, FeeAccount>>,

    /// Token counter account, used to track token-related data
    #[account(
        init,
        seeds = [DAO_TAG],
        bump,
        space = MAX_PERMITTED_DATA_INCREASE as usize,
        payer = authority,
    )]
    pub dao_list: Box<Account<'info, DaoList>>,

    /// The account that pays for the contract initialization
    #[account(mut)]
    pub authority: Signer<'info>,

    /// System program required for account initialization
    pub system_program: Program<'info, System>,
}
