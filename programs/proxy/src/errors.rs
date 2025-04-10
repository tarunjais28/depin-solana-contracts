use super::*;

#[error_code]
pub enum CustomError {
    #[msg("Error: Amount can't be zero!")]
    AmountCantBeZero,

    #[msg("Error: User ineligible to commit!")]
    InEligible,

    #[msg("Error: Unauthorized User!")]
    Unauthorized,

    #[msg("Error: Unknown Receiver!")]
    UnknownReceiver,

    #[msg("Error: Users stack is full!")]
    UsersStackFull,

    #[msg("Error: Not Found!")]
    NotFound,

    #[msg("Error: Permission Denied!")]
    PermissionDenied,
}
