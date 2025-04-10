use super::*;

/// The struct containing instructions for transfer params
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Params {
    /// Token Name
    pub token: String,

    /// Proposal Id
    pub proposal_id: u32,
}
