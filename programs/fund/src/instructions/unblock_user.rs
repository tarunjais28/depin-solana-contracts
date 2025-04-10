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
pub fn handler(ctx: Context<BlacklistUser>, proposal_id: u32) -> Result<()> {
    let proposals_list = &mut ctx.accounts.proposals_list;
    let global_config = &ctx.accounts.global_config;

    // Ensure valid executer
    require!(
        global_config.is_owner(&ctx.accounts.executer.key()),
        CustomError::Unauthorized
    );

    let proposal = proposals_list.perform_execution(proposal_id, &ProposalType::UnblockUser)?;

    let user = proposal.address.ok_or(CustomError::AddressNotFound)?;

    let blacklist = &mut ctx.accounts.blacklist;
    blacklist.remove_user(user)?;

    // Emit event to log the user block action
    emit!(events::UserUnblocked { user });

    Ok(())
}
