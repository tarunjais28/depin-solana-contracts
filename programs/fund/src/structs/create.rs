use super::*;

/// The struct containing instructions for creating tokens
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Params {
    /// Token Name
    pub name: String,

    /// Symbol
    pub symbol: String,

    /// Decimals
    pub decimals: u8,

    /// URI
    pub uri: String,

    /// Fundraising Goal in USD
    pub fundraising_goal: u64,

    /// Vesting Percent
    pub vesting_percent: VestingPercent,

    /// Token Amount
    pub amount: u64,
}
