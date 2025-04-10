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

    /// Amount
    pub amount: u64,

    /// Fundraising Goal in USD
    pub fundraising_goal: u64,

    /// Vesting Percent
    pub vesting_percent: fund::VestingPercent,
}

impl Params {
    pub fn to_create_token_params(&self) -> fund::CreateParams {
        fund::CreateParams {
            name: self.name.to_string(),
            symbol: self.symbol.to_string(),
            decimals: self.decimals,
            uri: self.uri.to_string(),
            fundraising_goal: self.fundraising_goal,
            vesting_percent: self.vesting_percent,
            amount: self.amount,
        }
    }

    pub fn to_mint_params(&self) -> fund::MintParams {
        fund::MintParams {
            token: self.name.to_string(),
            amount: self.amount,
        }
    }
}
