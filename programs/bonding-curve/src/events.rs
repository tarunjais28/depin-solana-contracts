use super::*;

/// Event emitted when the contract is initialized.
/// Contains information about the admin and the initial sub-admin.
#[event]
pub struct Initiated {}

/// Event emitted when tokens are bought in a trade.
/// Captures the token details, buyer, and amount purchased.
#[event]
pub struct TokensBought {
    /// Address of the token being bought
    pub token: Pubkey,

    /// Address of the buyer
    pub by: Pubkey,

    /// Amount of tokens purchased
    pub amount: u64,
}

/// Event emitted when liquidity is added to the pool.
/// Captures the token address and updated reserve amounts.
#[event]
pub struct LiquidityAdded {
    /// Address of the token whose liquidity is added
    pub token: Pubkey,

    /// Updated token reserve amount in the liquidity pool
    pub token_reserve: u64,

    /// Updated SOL reserve amount in the liquidity pool
    pub sol_reserve: u64,
}

/// Event emitted when trade is initiated.
#[event]
pub struct TradeInitaited {
    /// Address of the token which is going to trade
    pub token: Pubkey,
}

/// Event emitted when liquidity is removed from the pool.
/// Captures the token address and amounts of tokens and SOL removed.
#[event]
pub struct LiquidityRemoved {
    /// Address of the token whose liquidity is removed
    pub token: Pubkey,

    /// Amount of tokens withdrawn from the liquidity pool
    pub token_amount: u64,

    /// Amount of SOL withdrawn from the liquidity pool
    pub sol_amount: u64,
}

/// Event emitted when tokens are sold in a trade.
/// Captures the token details, seller, and amount sold.
#[event]
pub struct TokensSold {
    /// Address of the token being sold
    pub token: Pubkey,

    /// Address of the seller
    pub by: Pubkey,

    /// Amount of tokens sold
    pub amount: u64,
}

/// Event emitted when the admin is updated.
/// Captures the old and new admin addresses.
#[event]
pub struct UpdateAdmin {
    /// Address of the previous admin
    pub from: Pubkey,

    /// Address of the new admin
    pub to: Pubkey,
}

/// Event emitted when sub-admins are updated.
/// Captures the type of update and affected addresses.
#[event]
pub struct UpdateSubAdmins {
    /// Type of update (e.g., added or removed sub-admins)
    pub update_type: UpdateType,

    /// List of sub-admin addresses affected by the update
    pub addresses: Vec<Pubkey>,
}

/// Event emitted when trading fees are updated.
/// Captures the token, previous fee, and new fee.
#[event]
pub struct FeeUpdated {
    /// Address of the token for which the fee is updated
    pub token: Pubkey,

    /// Previous fee percentage
    pub from: u32,

    /// New fee percentage
    pub to: u32,
}

/// Event emitted when the fee collection account is updated.
/// Captures the previous and new fee collection account addresses.
#[event]
pub struct FeeAccountUpdated {
    /// Previous fee collection account address
    pub from: Pubkey,

    /// New fee collection account address
    pub to: Pubkey,
}
