use super::*;

/// Struct that represents the global configuration of the system.
#[account]
pub struct GlobalConfig {
    /// List of sub-admins who have limited administrative privileges.
    pub deployers: Vec<Pubkey>,

    /// List of sub-admins who have limited administrative privileges.
    pub sub_admins: Vec<Pubkey>,

    /// List of admins who have administrative privileges.
    pub admins: Vec<Pubkey>,

    /// The owner.
    pub owner: Pubkey,
}

impl GlobalConfig {
    pub fn set_owner(&mut self, owner: Pubkey) {
        self.owner = owner;
    }

    /// Sets the primary admin of the system.
    ///
    /// # Arguments
    /// * `admin` - The public key of the new admin.
    pub fn add_admin(&mut self, admins: Vec<Pubkey>) {
        self.admins.extend(admins); // Append new sub-admins.
        self.admins.sort(); // Sort for consistency.
        self.admins.dedup(); // Remove duplicate entries.
    }

    /// Removes admin from the system.
    ///
    /// # Arguments
    /// * `admin` - A vector of public keys to be removed.
    pub fn remove_admins(&mut self, admins: Vec<Pubkey>) {
        self.admins.retain(|addr| !admins.contains(addr)); // Keep only those not in the removal list.
    }

    /// Adds sub-admins to the system, ensuring no duplicates.
    ///
    /// # Arguments
    /// * `sub_admins` - A vector of public keys representing new sub-admins.
    pub fn add_sub_admins(&mut self, sub_admins: Vec<Pubkey>) {
        self.sub_admins.extend(sub_admins); // Append new sub-admins.
        self.sub_admins.sort(); // Sort for consistency.
        self.sub_admins.dedup(); // Remove duplicate entries.
    }

    /// Removes sub-admins from the system.
    ///
    /// # Arguments
    /// * `sub_admins` - A vector of public keys to be removed.
    pub fn remove_sub_admins(&mut self, sub_admins: Vec<Pubkey>) {
        self.sub_admins.retain(|addr| !sub_admins.contains(addr)); // Keep only those not in the removal list.
    }

    /// Sets the primary deployer of the system.
    ///
    /// # Arguments
    /// * `deployer` - The public key of the new deployer.
    pub fn add_deployers(&mut self, deployers: Vec<Pubkey>) {
        self.deployers.extend(deployers); // Append new sub-deployers.
        self.deployers.sort(); // Sort for consistency.
        self.deployers.dedup(); // Remove duplicate entries.
    }

    /// Removes deployer from the system.
    ///
    /// # Arguments
    /// * `deployer` - A vector of public keys to be removed.
    pub fn remove_deployers(&mut self, deployers: Vec<Pubkey>) {
        self.deployers.retain(|addr| !deployers.contains(addr)); // Keep only those not in the removal list.
    }

    /// Initializes and saves the configuration with the caller as the first admin.
    ///
    /// # Arguments
    /// * `caller` - The public key of the caller who will be set as the admin.
    pub fn save(&mut self, caller: Pubkey) {
        self.owner = caller; // The caller becomes the first and only owner initially.
        self.admins = vec![caller];
    }

    /// Checks if a given public key is a admin.
    ///
    /// # Arguments
    /// * `caller` - The public key to check.
    ///
    /// # Returns
    /// * `true` if the caller is admin, `false` otherwise.
    pub fn is_owner(&self, caller: &Pubkey) -> bool {
        self.owner.eq(caller)
    }

    /// Checks if a given public key belongs to a sub-admin.
    ///
    /// # Arguments
    /// * `caller` - The public key to check.
    ///
    /// # Returns
    /// * `true` if the caller is a sub-admin, `false` otherwise.
    pub fn is_admin(&self, caller: &Pubkey) -> bool {
        self.admins.contains(&caller)
    }

    /// Checks if a given public key belongs to a sub-admin.
    ///
    /// # Arguments
    /// * `caller` - The public key to check.
    ///
    /// # Returns
    /// * `true` if the caller is a sub-admin, `false` otherwise.
    pub fn is_sub_admin(&self, caller: &Pubkey) -> bool {
        self.admins.contains(&caller) || self.sub_admins.contains(&caller)
    }

    /// Checks if a given public key belongs to a deployer.
    ///
    /// # Arguments
    /// * `caller` - The public key to check.
    ///
    /// # Returns
    /// * `true` if the caller is a deployer, `false` otherwise.
    pub fn is_deployer(&self, caller: &Pubkey) -> bool {
        self.deployers.contains(&caller)
    }

    // /// Checks if a given public key is a admin.
    // ///
    // /// # Arguments
    // /// * `caller` - The public key to check.
    // ///
    // /// # Returns
    // /// * `true` if the caller is admin, `false` otherwise.
    // pub fn has_access(&self, caller: &Pubkey) -> bool {
    //    self.is_owner(caller) || self.is_admin(caller) || self.is_sub_admin(caller)
    // }

    /// Get current size
    pub fn get_len(&self) -> usize {
        self.admins.len() + self.sub_admins.len() + self.deployers.len() + 1
    }
}
