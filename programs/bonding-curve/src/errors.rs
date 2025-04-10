/// Custom error definitions for the bonding curve program
/// These errors provide specific feedback when operations fail
use super::*;

/// Enumeration of all possible custom errors that can occur in the program
#[error_code]
pub enum CustomError {
    /// Error thrown when a transaction amount is specified as zero
    #[msg("Error: Amount can't be zero!")]
    AmountCantBeZero,

    /// Error thrown when an unauthorized user attempts to perform a restricted operation
    #[msg("Error: Unauthorized User!")]
    Unauthorized,

    /// Error thrown when an operation references an unknown or invalid fee account
    #[msg("Error: Unknown Fee Account!")]
    UnknownFeeAccount,
}
