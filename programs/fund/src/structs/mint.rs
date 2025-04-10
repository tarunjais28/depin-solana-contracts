use super::*;

/// The struct containing instructions for claim params
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Params {
    /// Token Name
    pub token: String,

    /// Amount
    pub amount: u64,
}

impl Params {
    pub fn to_event(&self) -> events::Mint {
        events::Mint {
            token: self.token.to_string(),
            amount: self.amount,
        }
    }
}
