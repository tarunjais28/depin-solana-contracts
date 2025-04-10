/// Constants used throughout the fund program for account and data identification
/// These constants serve as tags for different types of accounts and operations
use super::*;

/// Tag for mint accounts that create and manage tokens
#[constant]
pub const MINT_TAG: &[u8] = b"mint";

/// Tag for escrow accounts that hold funds temporarily
#[constant]
pub const ESCROW_TAG: &[u8] = b"escrow";

/// Tag for commitment tracking accounts
#[constant]
pub const COMMITMENT_TAG: &[u8] = b"commitment";

/// Tag for fee-related accounts and operations
#[constant]
pub const FEE_TAG: &[u8] = b"fee";

/// Tag for user accounts and related data
#[constant]
pub const USER_TAG: &[u8] = b"users";

/// Tag for creator accounts and their permissions
#[constant]
pub const CREATOR_TAG: &[u8] = b"creators";

/// Tag for SOL-related operations and accounts
#[constant]
pub const SOL_TAG: &[u8] = b"sol";

/// Tag for global configuration accounts
#[constant]
pub const GLOBAL_CONFIG_TAG: &[u8] = b"global_config";

/// Tag for counter accounts used in various operations
#[constant]
pub const DAO_TAG: &[u8] = b"dao_list";

/// Tag for fund-specific data accounts
#[constant]
pub const FUND_DATA_TAG: &[u8] = b"fund_data";

/// Tag for proposal data accounts
#[constant]
pub const PROPOSAL_TAG: &[u8] = b"proposal";

/// Tag for block user
#[constant]
pub const BLACKLIST_TAG: &[u8] = b"blacklist";
