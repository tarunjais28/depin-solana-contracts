use super::*;

/// Enum representing different types of users in the system.
#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum UserType {
    /// VIP users with special privileges.
    Vip,

    /// Regular party users participating in fundraising.
    Party,
}

#[account]
pub struct Users {
    /// List of VIP users (addresses with special privileges).
    pub vip: Vec<UserDetails>,

    /// List of party users (regular users participating in fundraising).
    pub party: Vec<UserDetails>,
}

impl Users {
    /// Adds a list of new VIP users, ensuring no duplicates.
    pub fn add_vip_users(&mut self, users: Vec<UserDetails>, blacklist: &Blacklist) -> Result<()> {
        let existing_addresses: HashSet<_> = self
            .vip
            .iter()
            .chain(self.party.iter()) // Combine iterators efficiently
            .map(|user| user.address)
            .collect();

        for user in users {
            if existing_addresses.contains(&user.address) {
                return Err(CustomError::DuplicateUser.into());
            }

            // Ensure max_allowable_amount can't be 0
            require!(
                user.max_allowable_amount > 0,
                CustomError::AmountCannotBeZero
            );

            // Ensure the user is not blacklisted
            require!(
                !blacklist.is_blocked(&user.address),
                CustomError::BlockedAccount
            );

            self.vip.push(user);
        }

        Ok(())
    }

    /// Removes a list of VIP users from the list.
    pub fn remove_vip_users(&mut self, users: Vec<UserDetails>) {
        self.vip
            .retain(|user| !users.iter().any(|u| u.address == user.address));
    }

    /// Adds a list of new party users, ensuring no duplicates.
    pub fn add_party_users(
        &mut self,
        users: Vec<UserDetails>,
        blacklist: &Blacklist,
    ) -> Result<()> {
        let existing_addresses: HashSet<_> = self
            .vip
            .iter()
            .chain(self.party.iter()) // Combine iterators efficiently
            .map(|user| user.address)
            .collect();

        for user in users {
            if existing_addresses.contains(&user.address) {
                return Err(CustomError::DuplicateUser.into());
            }

            // Ensure max_allowable_amount can't be 0
            require!(
                user.max_allowable_amount > 0,
                CustomError::AmountCannotBeZero
            );

            // Ensure the user is not blacklisted
            require!(
                !blacklist.is_blocked(&user.address),
                CustomError::BlockedAccount
            );

            self.party.push(user);
        }

        Ok(())
    }

    /// Removes a list of party users from the list.
    pub fn remove_party_users(&mut self, users: Vec<UserDetails>) {
        self.vip
            .retain(|user| !users.iter().any(|u| u.address == user.address));
    }

    /// Checks if a given user (identified by `address`) is eligible to participate in fundraising.
    /// VIP users are always eligible, while party users can only participate in the `FundraisingParty` phase.
    pub fn is_eligible(&self, address: &Pubkey, status: Status) -> bool {
        self.vip.iter().any(|u| &u.address == address)
            || (self.party.iter().any(|u| &u.address == address)
                && status == Status::FundraisingParty)
    }

    /// Checks if the provided amount is within the maximum allowable limit for a given address.
    ///
    /// This function iterates through both `vip` and `party` user lists to determine
    /// if the given `address` has a `max_allowable_amount` greater than the specified `amount`.
    ///
    /// # Arguments
    /// * `address` - The public key of the user whose limit is being checked.
    /// * `amount` - The amount to compare against the user's maximum allowable limit.
    ///
    /// # Returns
    /// * `true` if the user exists in either list and their max allowable amount is greater than `amount`.
    /// * `false` otherwise.
    pub fn is_max_allowable_amount_reached(&self, address: &Pubkey, amount: u64) -> bool {
        // Check if the address exists in the VIP list and has a max allowable amount greater than `amount`
        // If not found in VIP, check in the party list
        self.vip
            .iter()
            .any(|u| &u.address == address && u.max_allowable_amount >= amount)
            || self
                .party
                .iter()
                .any(|u| &u.address == address && u.max_allowable_amount >= amount)
    }
}

#[account]
#[derive(PartialEq, PartialOrd)]
pub struct UserDetails {
    /// List of VIP users (addresses with special privileges).
    pub address: Pubkey,

    /// Maximum allowable contribution amount for users.
    pub max_allowable_amount: u64,
}
