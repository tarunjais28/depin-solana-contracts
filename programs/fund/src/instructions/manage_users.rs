use super::*;

/// Function to manage (add/remove) users
/// This function allows creators to add or remove VIP or Party users based on the given parameters.
///
/// # Arguments
/// * `ctx` - The program execution context containing all required accounts.
/// * `params` - Parameters specifying user management actions (user type, action type, and user list).
///
/// # Returns
/// * `Result<()>` - Returns an Ok result if successful, otherwise returns an error.
pub fn handler(ctx: Context<ManageUsers>, params: structs::manage_users::Params) -> Result<()> {
    let creators = &ctx.accounts.creators;
    let users = &mut ctx.accounts.users;
    let blacklist = &ctx.accounts.blacklist;
    let fund_store = &ctx.accounts.fund_data_store;

    // Ensure the caller has creator rights
    creators.is_creator(
        &ctx.accounts.payer.key(),
        ctx.accounts.metadata.creators.clone(),
    )?;

    require!(
        matches!(
            fund_store.status,
            Status::Created | Status::FundraisingVip | Status::FundraisingParty
        ),
        CustomError::PermissionDenied
    );

    // Convert the input parameters into an event structure for logging
    let event = params.to_events();

    use UpdateType::*;
    use UserType::*;
    match params.manage_type {
        Add => match params.user_type {
            Vip => {
                users.add_vip_users(params.users, &blacklist)?;
            }
            Party => {
                users.add_party_users(params.users, &blacklist)?;
            }
        },
        Remove => match params.user_type {
            Vip => {
                users.remove_vip_users(params.users);
            }
            Party => {
                users.remove_party_users(params.users);
            }
        },
        _ => return Err(CustomError::PermissionDenied.into()),
    }

    // Emit event to log the user management action
    emit!(event);

    Ok(())
}

/// Struct defining the accounts required for managing users
#[derive(Accounts)]
#[instruction(params: structs::manage_users::Params)]
pub struct ManageUsers<'info> {
    /// Account storing creator information, used to verify permissions
    #[account(
        seeds = [CREATOR_TAG],
        bump,
    )]
    pub creators: Box<Account<'info, Creators>>,

    /// Account storing user information, updated based on the action (add/remove users)
    #[account(
        mut,
        seeds = [USER_TAG, mint_account.key().as_ref()],
        bump,
        realloc = calc_user_size(&users, &params), // Resize storage dynamically if needed
        realloc::payer = payer,
        realloc::zero = false,
    )]
    pub users: Box<Account<'info, Users>>,

    /// Fund data store account.
    /// Stores details about the fundraising process, including the current status.
    #[account(
        seeds = [FUND_DATA_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub fund_data_store: Box<Account<'info, FundDataStore>>,

    /// Account storing blacklist users
    #[account(
        seeds = [BLACKLIST_TAG],
        bump,
    )]
    pub blacklist: Box<Account<'info, Blacklist>>,

    /// CHECK: This is the mint account used for referencing the token
    #[account(
        seeds = [MINT_TAG, params.token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: Metadata account for the token
    #[account()]
    pub metadata: Box<Account<'info, MetadataAccount>>,

    /// The payer responsible for the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// System program required for allocation and execution of instructions
    pub system_program: Program<'info, System>,
}
