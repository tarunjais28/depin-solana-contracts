use super::*;

#[account]
pub struct CreatorInfo {
    /// Token name
    pub token: String,

    /// Fee Percent
    pub fee_percent: u32,
}
