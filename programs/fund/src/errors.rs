/// Custom error definitions for the fund program
/// These errors provide specific feedback when operations fail or validation checks don't pass
use super::*;

/// Enumeration of all possible custom errors that can occur in the program
#[error_code]
pub enum CustomError {
    /// Error thrown when a transaction amount is specified as zero
    #[msg("Error: Amount can't be zero!")]
    AmountCantBeZero,

    /// Error thrown when a transaction amount is lesser than minimum allowed sols
    #[msg("Error: Amount must be greater than or equals to 0.1 sols!")]
    MinimumAmountNotMet,

    /// Error thrown when a transaction amount is specified as greater than max_allowable_amount
    #[msg("Error: Commit amount can't be exceeded by max allowable commit amount!")]
    CommitAmountExceeded,

    /// Error thrown when a all tokens are already claimed
    #[msg("Error: All tokens are claimed already!")]
    AlreadyClaimed,

    /// Error thrown when proposal is already approved by same approver
    #[msg("Error: Proposal is already approved by same approver!")]
    AlreadyApproved,

    /// Error thrown when a user is already present in the list
    #[msg("Error: User is already added!")]
    DuplicateUser,

    /// Error thrown when a user is blacklisted!
    #[msg("Error: Address is blacklisted!")]
    BlockedAccount,

    /// Error thrown when a user attempts to commit but doesn't meet eligibility criteria
    #[msg("Error: User ineligible to commit!")]
    InEligible,

    /// Error thrown when an unauthorized user attempts to perform a restricted operation
    #[msg("Error: Unauthorized User!")]
    Unauthorized,

    /// Error thrown when an operation references an unknown or invalid fee account
    #[msg("Error: Unknown Fee Account!")]
    UnknownFeeAccount,

    /// Error thrown when attempting to send funds to an unknown or invalid receiver
    #[msg("Error: Unknown Receiver!")]
    UnknownReceiver,

    /// Error thrown when a requested resource or account is not found
    #[msg("Error: Not Found!")]
    NotFound,

    /// Error thrown when a requested address is not found
    #[msg("Error: Address Not Found!")]
    AddressNotFound,

    /// Error thrown when a user lacks the required permissions for an operation
    #[msg("Error: Permission Denied!")]
    PermissionDenied,

    /// Error thrown during fetching current timestamp
    #[msg("Error: while getting current timestamp!")]
    TimestampError,

    #[msg("Error: Excceding the withdraw limit!")]
    ExceedsWithdrawLimit,

    #[msg("Error: Fundraise is not successfull!")]
    FundraiseFailed,

    #[msg("Error: Dao status is not Trading!")]
    DaoNotInTrading,

    #[msg("Error: Amount Cannot be Zero!")]
    AmountCannotBeZero,

    #[msg("Error: Couldn't parse to Pubkey!")]
    ParseError,

    #[msg("Proposal has already been executed.")]
    AlreadyExecuted,

    #[msg("Proposal has not been approved yet.")]
    NotApproved,

    #[msg("InValidDaoStatus.")]
    InValidDaoStatus,

    #[msg("Invalid Proposal.")]
    InvalidProposalType,

    #[msg("AccountMisMatch.")]
    AccountMisMatch,

    #[msg("Same Proposal.")]
    DuplicateProposal,

    #[msg("Address present in deployer list.")]
    PresentInDeployerList,

    #[msg("Address present in creator list.")]
    PresentInCreatorList,

    #[msg("Address present in admin list.")]
    PresentInAdminList,
}
