use super::*;

/// Calculates the required size in bytes for storing commitment entries.
///
/// # Arguments
/// * `commitment_size` - The number of commitments to store.
///
/// # Returns
/// * The total size in bytes needed for storing the commitments.
/// * Includes 8 bytes for account discriminator + (size of each commitment details * number of commitments).
pub fn calc_commitment_size(commitment_size: usize) -> usize {
    8 + (commitment_size * size_of::<CommitmentDetails>())
}

/// Calculates the initial size needed for storing user information.
///
/// # Returns
/// * The size in bytes required for initializing a user entry.
/// * Includes 8 bytes for account discriminator + size of Users struct.
pub fn calc_init_user_size() -> usize {
    8 + size_of::<Users>()
}

/// Calculates the required size for user storage after updates.
///
/// # Arguments
/// * `users` - Reference to the existing Users struct.
/// * `params` - Parameters defining user management actions.
///
/// # Returns
/// * The total size in bytes needed for storing users after applying changes.
/// * Accounts for both VIP and party users, along with newly added users.
///
/// TODO: Handle non-reallocation of space for some scenarios.
pub fn calc_user_size(users: &Users, params: &structs::manage_users::Params) -> usize {
    use UpdateType::*;

    match params.manage_type {
        Add => {
            calc_init_user_size()
                + (users.vip.len() + users.party.len() + params.users.len()) * size_of::<Pubkey>()
        }
        _ => calc_init_user_size() + (users.vip.len() + users.party.len()) * size_of::<Pubkey>(),
    }
}

/// Calculates the required size for blacklist storage after updates.
///
/// # Arguments
/// * `blacklist` - Reference to the existing Users struct.
///
/// # Returns
/// * The total size in bytes needed for storing blacklist users after applying changes.
pub fn calc_blacklist_size(blacklist: &Blacklist) -> usize {
    size_of::<Blacklist>() + (blacklist.users.len() + 1) * size_of::<Pubkey>() + 8
}

/// Calculates the size needed for global configuration storage.
///
/// # Arguments
/// * `old` - Current number of entries.
/// * `new` - Number of new entries to add.
///
/// # Returns
/// * Total size needed for storing global configuration, including admin keys.
pub fn calc_global_config_size(old: usize, new: usize) -> usize {
    size_of::<GlobalConfig>() + ((old + new) * 32) + 8
}

/// Calculates the size required for storing creator information.
///
/// # Returns
/// * The size in bytes required to store creator-related details.
pub fn calc_creator_info_size() -> usize {
    size_of::<CreatorInfo>() + 32
}

/// Calculates the size required for storing the creators list.
///
/// # Arguments
/// * `old` - Current number of creators.
/// * `params` - Parameters containing update type and creator details.
///
/// # Returns
/// * The total size needed for storing the updated creators list.
pub fn calc_creators_size(old: usize) -> usize {
    size_of::<Creators>() + ((old + 1) * (size_of::<Pubkey>() + size_of::<bool>()))
}
