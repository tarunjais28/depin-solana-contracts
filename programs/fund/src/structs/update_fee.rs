use super::*;

/// The struct containing instructions for update fee params
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub struct Params {
    /// Creator Address
    pub address: Pubkey,

    // TODO: @Tarun Should this be token Address
    /// Creator Address
    pub token: String,

    /// Fee Percent
    pub fee_percent: u32,
}
