use super::*;

/// Function to manage creators (add or remove creators from the system)
///
/// # Parameters
/// - `ctx`: Execution context containing all necessary accounts
/// - `params`: Struct containing the address of the creator and the type of management action (add/remove)
///
/// # Returns
/// - `Result<()>`: Indicates success or failure of the operation
pub fn handler(ctx: Context<AddCreators>, params: structs::add_creator::Params) -> Result<()> {
    let global_config = &ctx.accounts.global_config;
    let creators = &mut ctx.accounts.creators;
    let creator_info = &mut ctx.accounts.creator_info;

    // Ensure that the payer has sub-admin rights before modifying creators
    require!(
        global_config.is_sub_admin(ctx.accounts.payer.key),
        CustomError::Unauthorized
    );

    // Ensure that the admin is not going to add as creator
    require!(
        !global_config.is_admin(&params.address),
        CustomError::PresentInAdminList
    );

    // Set the creator's fee percentage
    creator_info.fee_percent = params.fee_percent;

    // Add a new creator to the list
    creators.add(params.address)?;

    // Emit an event indicating a creator has been managed (added or removed)
    emit!(events::CreatorAdded {
        current_creators_count: creators.creators.len() as u32
    });

    Ok(())
}

/// Account structure for managing creators
#[derive(Accounts)]
#[instruction(params: structs::add_creator::Params)]
pub struct AddCreators<'info> {
    /// Reference to the global configuration account
    #[account(
        seeds = [GLOBAL_CONFIG_TAG],
        bump,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    /// The account storing the list of creators
    #[account(
        mut,
        seeds = [CREATOR_TAG],
        bump,
        realloc = calc_creators_size(creators.creators.len()),
        realloc::payer = payer,
        realloc::zero = false,
    )]
    pub creators: Box<Account<'info, Creators>>,

    /// Account containing additional creator information (fee percentage, etc.)
    #[account(
        init_if_needed,
        seeds = [CREATOR_TAG, params.address.as_ref()],
        bump,
        space = calc_creator_info_size(),
        payer = payer,
    )]
    pub creator_info: Box<Account<'info, CreatorInfo>>,

    /// The payer who is executing the transaction (must have sub-admin rights)
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The system program required for account initialization
    pub system_program: Program<'info, System>,
}
