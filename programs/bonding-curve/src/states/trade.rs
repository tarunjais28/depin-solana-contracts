use super::*;

/// Structure representing a trade, including liquidity reserves, market cap, and fees
#[account]
#[derive(Debug, Copy)]
pub struct Trade {
    /// Amount of SOL in the liquidity pool
    pub sol_reserve: u64,

    /// Amount of tokens in the liquidity pool
    pub token_reserve: u64,

    /// Trading fee percentage
    pub fee_percent: u32,
}
