use super::*;

/// Update Type
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum UpdateType {
    Add,
    Remove,
}

/// Amount Type
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum AmountType {
    Sol,
    Token,
}
