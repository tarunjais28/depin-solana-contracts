use super::*;

/// Calculates the required storage size for the `Trade` account.
/// Ensures the account has enough space to store its data.
///
/// # Returns
/// * `usize` - The total calculated size required for the `Trade` account.
pub fn calc_trade_size() -> usize {
    // Account discriminator (8 bytes) + size of `Trade` struct
    8 + size_of::<Trade>()
}

pub fn has_admin_or_sub_admin_rights<'info>(
    address: Pubkey,
    cpi_program: AccountInfo<'info>,
    global_config: AccountInfo<'info>,
) -> Result<()> {
    let cpi_accounts = fund::cpi::accounts::HasRole { global_config };
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    let is_either_admin_or_sub_admin =
        fund::cpi::is_either_admin_or_sub_admin(cpi_ctx, address)?.get();

    require!(
        is_either_admin_or_sub_admin,
        fund::errors::CustomError::Unauthorized // Return an error if unauthorized
    );

    Ok(())
}

pub fn is_owner<'info>(
    address: Pubkey,
    cpi_program: AccountInfo<'info>,
    global_config: AccountInfo<'info>,
) -> Result<()> {
    let cpi_accounts = fund::cpi::accounts::HasRole { global_config };
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    let is_owner = fund::cpi::is_owner(cpi_ctx, address)?.get();

    require!(
        is_owner,
        fund::errors::CustomError::Unauthorized // Return an error if unauthorized
    );

    Ok(())
}
