use super::*;

/// The struct containing instructions for manage creators params
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub struct Params {
    /// Creator Address
    pub address: Pubkey,

    /// Fee Percent
    pub fee_percent: u32,
}
