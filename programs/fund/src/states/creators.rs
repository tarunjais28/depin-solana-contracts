use super::*;

/// Struct that manages a list of creators.
#[account]
pub struct Creators {
    /// List of registered creators.
    pub creators: Vec<Creator>,
}

/// Struct representing an individual creator.
#[account]
#[derive(Debug, PartialEq, PartialOrd)]
pub struct Creator {
    /// The public key of the creator.
    pub address: Pubkey,

    /// Boolean flag indicating whether the creator has been blocked.
    pub is_blocked: bool,
}

impl Creator {
    /// Creates a new `Creator` instance with the given address.
    fn new(address: Pubkey) -> Self {
        Self {
            address,
            is_blocked: false, // Default to false until the creator actually being blocked.
        }
    }
}

impl Creators {
    /// Adds a new creator to the list if they are not already present.
    pub fn add(&mut self, address: Pubkey) -> Result<()> {
        if !self.creators.iter().any(|cr| cr.address == address) {
            self.creators.push(Creator::new(address));
            Ok(())
        } else {
            return Err(CustomError::DuplicateUser.into());
        }
    }

    /// Checks if the given address belongs to a registered creator.
    pub fn is_creator(
        &self,
        address: &Pubkey,
        token_creators: Option<Vec<mpl_token_metadata::types::Creator>>,
    ) -> Result<()> {
        require!(self.in_creator_list(address), CustomError::Unauthorized);
        require!(
            self.creators
                .iter()
                .any(|cr| cr.address == *address && !cr.is_blocked),
            CustomError::BlockedAccount
        );

        if let Some(creators) = token_creators {
            require!(
                creators.iter().any(|cr| cr.address == *address),
                CustomError::Unauthorized
            );
        }
        Ok(())
    }

    pub fn in_creator_list(&self, address: &Pubkey) -> bool {
        self.creators.iter().any(|cr| cr.address == *address)
    }

    /// Marks the creator as blocked / unblocked
    pub fn block(&mut self, address: &Pubkey, is_blocked: bool) {
        if let Some(creator) = self.creators.iter_mut().find(|c| c.address == *address) {
            creator.is_blocked = is_blocked;
        }
    }

    /// Checks if a creator is blocked or active.
    /// Returns `true` if the creator exists and has been blocked.
    pub fn is_blocked(&self, address: &Pubkey) -> bool {
        self.creators
            .iter()
            .any(|cr| cr.address == *address && !cr.is_blocked)
    }
}
