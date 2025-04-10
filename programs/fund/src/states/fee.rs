use super::*;

#[account]
#[derive(InitSpace)]
pub struct FeeAccount {
    /// Fee collection account
    pub fees_collection_account: Pubkey,
}
