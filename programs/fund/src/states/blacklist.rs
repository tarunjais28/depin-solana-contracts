use super::*;

#[account]
pub struct Blacklist {
    /// List of blacklist users.
    pub users: Vec<Pubkey>,
}

impl Blacklist {
    /// Adds to blacklist
    pub fn add_user(&mut self, user: Pubkey) -> Result<()> {
        let existing_addresses: HashSet<_> = self.users.iter().collect();

        if existing_addresses.contains(&user) {
            return Err(CustomError::DuplicateUser.into());
        }
        self.users.push(user);

        Ok(())
    }

    /// Remove from blacklist
    pub fn remove_user(&mut self, user: Pubkey) -> Result<()> {
        // Ensure user is present in the blacklist
        require!(self.users.contains(&user), CustomError::NotFound);

        self.users.retain(|u| user.ne(u));

        Ok(())
    }

    pub fn is_blocked(&self, user: &Pubkey) -> bool {
        self.users.contains(user)
    }
}
