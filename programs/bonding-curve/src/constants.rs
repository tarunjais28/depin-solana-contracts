/// Constants used throughout the bonding curve program for account and data identification
use super::*;

/// Tag for mint accounts
#[constant]
pub const MINT_TAG: &[u8] = b"mint";

/// Tag for reserve accounts that hold liquidity
#[constant]
pub const RESERVE_TAG: &[u8] = b"reserve";

/// Tag for trade-related accounts and operations
#[constant]
pub const TRADE_TAG: &[u8] = b"trade";

/// Tag for SOL-related operations and accounts
#[constant]
pub const SOL_TAG: &[u8] = b"sol";

/// Tag for global configuration accounts
#[constant]
pub const GLOBAL_CONFIG_TAG: &[u8] = b"global_config";
