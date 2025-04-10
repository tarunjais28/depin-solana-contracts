use super::*;

/// The struct containing instructions for manage users params
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub struct Params {
    /// Token Name
    pub token: String,

    /// User Type
    pub user_type: UserType,

    /// Manage Type
    pub manage_type: UpdateType,

    /// Users
    pub users: Vec<UserDetails>,
}

impl Params {
    pub fn to_events(&self) -> events::ManageUsers {
        events::ManageUsers {
            token: self.token.to_string(),
            user_type: self.user_type,
            manage_type: self.manage_type,
        }
    }
}
