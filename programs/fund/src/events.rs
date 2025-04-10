use super::*;

/// Event emitted when the program is initialized
/// Contains the initial admin and sub-admin addresses
#[event]
pub struct Init {
    /// The primary administrator's public key
    pub admin: Pubkey,
    /// The initial sub-administrator's public key
    pub sub_admin: Pubkey,
}

/// Event emitted when a new commitment is initialized for a token
#[event]
pub struct InitCommitment {
    /// The token identifier for which commitment is initialized
    pub token: String,
}

/// Event emitted when user groups are initialized for a token
#[event]
pub struct UsersInitiated {
    /// The token identifier
    pub token: String,
}

/// Event emitted when multisig is initiated
#[event]
pub struct MultisigInitiated {}

/// Event emitted when creator accounts are initialized
#[event]
pub struct InitCreators {}

/// Event emitted when creators list is modified
#[event]
pub struct CreatorAdded {
    /// Updated count of creators
    pub current_creators_count: u32,
}

/// Event emitted when user lists are modified
#[event]
pub struct ManageUsers {
    /// The token identifier
    pub token: String,
    /// Type of user (VIP/Party)
    pub user_type: UserType,
    /// Type of update (Add/Remove)
    pub manage_type: UpdateType,
}

/// Event emitted when a new token is created
#[event]
pub struct Create {
    /// Name of the created token
    pub name: String,
}

/// Event emitted when tokens are minted
#[event]
pub struct Mint {
    /// The token identifier
    pub token: String,
    /// Amount of tokens minted
    pub amount: u64,
}

/// Event emitted when tokens are burned
#[event]
pub struct Burn {
    /// The token identifier
    pub token: String,
    /// Amount of tokens burned
    pub amount: u64,
}

/// Event emitted when a commitment is made
#[event]
pub struct Commitment {
    /// The token identifier
    pub token: String,
    /// Amount of SOL committed
    pub sol_amount: u64,
    /// Amount of tokens to receive
    pub token_amount: u64,
}

/// Event emitted when tokens or SOL are claimed
#[event]
pub struct Claim {
    /// The token identifier
    pub token: String,
    /// Amount claimed
    pub amount: u64,
}

/// Event emitted when tokens are transferred
#[event]
pub struct Transfer {
    /// The token identifier
    pub token: String,
    /// Recipient's public key
    pub to: Pubkey,
    /// Amount transferred
    pub amount: u64,
}

#[event]
pub struct MoveToLP {
    /// The token identifier
    pub token: String,

    pub token_amount: u64,

    /// Amount transferred
    pub sol_amount: u64,
}

#[event]
pub struct TransferredSolToCreator {
    /// The token identifier
    pub creator: Pubkey,

    pub amount: u64,
}

#[event]
pub struct TransferredSolToDeployer {
    /// The token identifier
    pub deployer: Pubkey,

    pub amount: u64,
}

/// Event emitted when admin is updated
#[event]
pub struct UpdateAdmin {
    /// Previous admin's public key
    pub from: Pubkey,
    /// New admin's public key
    pub to: Pubkey,
}

/// Event emitted when sub-admin list is modified
#[event]
pub struct UpdateSubAdmins {
    /// Type of update (Add/Remove)
    pub update_type: UpdateType,
    /// List of affected sub-admin addresses
    pub addresses: Vec<Pubkey>,
}

/// Event emitted when fee structure is updated
#[event]
pub struct UpdateFees {
    /// Previous fee amount
    pub from: u32,
    /// New fee amount
    pub to: u32,
}

/// Event emitted when token status changes
#[event]
pub struct UpdateStatus {
    /// The token identifier
    pub token: String,
    /// New status value
    pub status: Status,
}

/// Event emitted when token fees are updated
#[event]
pub struct FeeUpdated {
    /// Token mint address
    pub token: Pubkey,
    /// Previous fee percentage
    pub from: u32,
    /// New fee percentage
    pub to: u32,
}

/// Event emitted when fee collection account is updated
#[event]
pub struct FeeAccountUpdated {
    /// Previous fee collection account
    pub from: Pubkey,
    /// New fee collection account
    pub to: Pubkey,
}

/// Event emitted when dao is started
#[event]
pub struct DaoStarted {
    /// Name of the created token
    pub token: String,
}

/// Event emitted when party round is started
#[event]
pub struct PartyRoundStarted {
    /// Token name
    pub token: String,
}

/// Event emitted when dao is ended
#[event]
pub struct DaoEnded {
    /// Token name
    pub token: String,
}

/// Event emitted when dao is blocked
#[event]
pub struct DaoBlacklisted {
    /// Token name
    pub token: String,
}

/// Event emitted when creator is blocked
#[event]
pub struct CreatorBlacklisted {
    /// Creator Address
    pub creator: Pubkey,
}

/// Event emitted when creator is unblocked
#[event]
pub struct CreatorUnblocked {
    /// Creator Address
    pub creator: Pubkey,
}

/// Event emitted when user is blocked
#[event]
pub struct UserBlacklisted {
    /// User Address
    pub user: Pubkey,
}

/// Event emitted when user is unblocked
#[event]
pub struct UserUnblocked {
    /// User Address
    pub user: Pubkey,
}

#[event]
pub struct WithdrawalToContract {
    /// The token identifier
    pub token: String,

    /// Token Amount
    pub token_amount: u64,

    /// Amount transferred
    pub sol_amount: u64,
}

/// Event emitted when account is closed
#[event]
pub struct AccountReset {}
