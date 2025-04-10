use super::*;

/// The struct containing instructions for update status params
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Params {
    /// Token Name
    pub token: String,

    /// Date
    pub date: i64,
}
