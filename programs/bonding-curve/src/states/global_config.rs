use super::*;

/// Global configuration struct to manage admin roles and fee collection settings
#[account]
pub struct GlobalConfig {
    /// Account where fees are collected
    pub fees_collection_account: Pubkey,
}

impl GlobalConfig {
    /// Initialize and save the global configuration settings
    ///
    /// # Arguments
    /// * `caller` - The public key of the caller (becomes the admin)
    /// * `fees_collection_account` - The public key of the fee collection account
    pub fn save(&mut self, fees_collection_account: Pubkey) {
        self.fees_collection_account = fees_collection_account; // Set the fee collection account
    }
}
