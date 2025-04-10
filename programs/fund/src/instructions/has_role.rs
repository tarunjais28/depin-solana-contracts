use super::*;

/// Checks if the given address has an owner role.
///
/// # Arguments
/// * `ctx` - The context containing the required accounts.
/// * `address` - The public key of the user to check.
///
/// # Returns
/// * `Ok(true)` if the address is an owner, otherwise `Ok(false)`.
pub fn is_owner(ctx: Context<HasRole>, address: &Pubkey) -> Result<bool> {
    let global_config = &mut ctx.accounts.global_config;

    // Check if the provided address is listed as an owner in the global configuration.
    Ok(global_config.is_owner(address))
}

/// Checks if the given address has an admin role.
///
/// # Arguments
/// * `ctx` - The context containing the required accounts.
/// * `address` - The public key of the user to check.
///
/// # Returns
/// * `Ok(true)` if the address is an admin, otherwise `Ok(false)`.
pub fn is_admin(ctx: Context<HasRole>, address: &Pubkey) -> Result<bool> {
    let global_config = &mut ctx.accounts.global_config;

    // Check if the provided address is listed as an admin in the global configuration.
    Ok(global_config.is_admin(address))
}

/// Checks if the given address has a sub-admin role.
///
/// # Arguments
/// * `ctx` - The context containing the required accounts.
/// * `address` - The public key of the user to check.
///
/// # Returns
/// * `Ok(true)` if the address is a sub-admin, otherwise `Ok(false)`.
pub fn is_sub_admin(ctx: Context<HasRole>, address: &Pubkey) -> Result<bool> {
    let global_config = &mut ctx.accounts.global_config;

    // Check if the provided address is listed as a sub-admin in the global configuration.
    Ok(global_config.is_sub_admin(address))
}

/// Checks if the given address has either admin or sub-admin role.
///
/// # Arguments
/// * `ctx` - The context containing the required accounts.
/// * `address` - The public key of the user to check.
///
/// # Returns
/// * `Ok(true)` if the address is a sub-admin or sub-admin, otherwise `Ok(false)`.
pub fn is_either_admin_or_sub_admin(ctx: Context<HasRole>, address: &Pubkey) -> Result<bool> {
    let global_config = &mut ctx.accounts.global_config;

    // Check if the provided address is listed as a sub-admin in the global configuration.
    Ok(global_config.is_sub_admin(address) || global_config.is_admin(address))
}

/// Struct representing the accounts required for checking admin or sub-admin roles.
#[derive(Accounts)]
#[instruction()]
pub struct HasRole<'info> {
    /// The global configuration account that stores information about admin and sub-admin roles.
    #[account(
        seeds = [GLOBAL_CONFIG_TAG], // Uses a predefined tag to derive the account address.
        bump,
    )]
    pub global_config: Box<Account<'info, GlobalConfig>>,
}
