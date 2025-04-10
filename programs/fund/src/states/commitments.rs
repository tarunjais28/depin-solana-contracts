use super::*;

/// Account struct to manage commitments made by users.
#[account]
pub struct Commitments {
    /// List of individual commitment details.
    pub commiters: Vec<CommitmentDetails>,

    /// Total amount of SOL committed.
    pub total_commited_sols: u64,
}

/// Struct to store details of an individual commitment.
#[account]
#[derive(Debug, Default)]
pub struct CommitmentDetails {
    /// Address of the committer.
    pub address: Pubkey,

    /// Amount of SOL committed.
    pub sol_amount: u64,

    /// Amount of tokens received in exchange for SOL.
    pub token_amount: u64,

    /// Timestamp of the last claimed amount (if any).
    pub last_claimed_at: Option<i64>,

    /// Total amount of tokens claimed by the committer.
    pub amount_claimed: u64,
}

impl Commitments {
    /// Adds a new commitment or updates an existing one.
    ///
    /// # Arguments
    /// * `token` - The token identifier.
    /// * `address` - The address of the committer.
    /// * `amount` - The amount of SOL committed.
    /// * `fund_store` - Reference to the fund data store containing token exchange rates.
    ///
    /// # Returns
    /// * `events::Commitment` - An event capturing the commitment details.
    pub fn add(
        &mut self,
        token: String,
        address: Pubkey,
        amount: u64,
        tokens_per_sol: u64,
    ) -> events::Commitment {
        if let Some(commiter) = self
            .commiters
            .iter_mut()
            .find(|commiter| commiter.address == address)
        {
            // If the committer already exists, update their commitment details.
            commiter.sol_amount += amount;
            commiter.token_amount += amount * tokens_per_sol;
            commiter.into_events(token)
        } else {
            // Create a new commitment record.
            let commiter_details = CommitmentDetails::new(address, amount, tokens_per_sol);
            self.commiters.push(commiter_details.clone());
            commiter_details.into_events(token)
        }
    }

    /// Allows a committer to claim their committed SOL or tokens.
    ///
    /// # Arguments
    /// * `address` - Reference to the committer's public key.
    /// * `amount_type` - The type of amount being claimed (SOL or Token).
    /// * `fund_store` - Reference to the fund data store containing vesting rules.
    ///
    /// # Returns
    /// * `Result<u64>` - The amount that was successfully claimed, or an error if the committer is not found.
    pub fn claim_amount(
        &mut self,
        address: &Pubkey,
        amount_type: AmountType,
        vesting_percent: &VestingPercent,
        day: i64,
    ) -> Result<u64> {
        if let Some(commiter) = self
            .commiters
            .iter_mut()
            .find(|commiter| commiter.address == *address)
        {
            use AmountType::*;
            let mut amount;
            match amount_type {
                Sol => {
                    // Claim the entire SOL amount.
                    amount = commiter.sol_amount;
                    commiter.sol_amount = 0;
                }
                Token => {
                    require!(
                        commiter.token_amount >= commiter.amount_claimed,
                        CustomError::AlreadyClaimed
                    );

                    // let now = Clock::get()
                    //     .map_err(|_| CustomError::TimestampError)?
                    //     .unix_timestamp;
                    let now = day;
                    if let Some(last_claimed) = commiter.last_claimed_at {
                        // Calculate the number of days since last claim.
                        let days = calc_days(last_claimed, now) as u128;

                        // Calculate claimable amount based on daily vesting percentage.
                        amount = calc_amount(
                            commiter.token_amount as u128,
                            vesting_percent.daily_claim as u128 * days,
                        );
                    } else {
                        // First-time claim uses the first claim percentage.
                        amount = calc_amount(
                            commiter.token_amount as u128,
                            vesting_percent.first_claim as u128,
                        );
                    }
                    // Update committer's claimed amount and last claimed timestamp.
                    if commiter.token_amount < commiter.amount_claimed + amount {
                        amount = commiter.token_amount - commiter.amount_claimed;
                        commiter.amount_claimed = commiter.token_amount;
                    } else {
                        commiter.amount_claimed += amount;
                    }

                    commiter.last_claimed_at = Some(now);
                }
            };

            Ok(amount)
        } else {
            Err(CustomError::NotFound.into())
        }
    }

    /// Retrieves the total SOL amount committed by a given address.
    ///
    /// # Arguments
    /// * `address` - Reference to the committer's public key.
    ///
    /// # Returns
    /// * `u64` - The amount of SOL committed by the given address (default is 0 if not found).
    pub fn get_commitment_amount(&self, address: &Pubkey) -> u64 {
        self.commiters
            .iter()
            .find_map(|commiter| (commiter.address == *address).then_some(commiter.sol_amount))
            .unwrap_or_default()
    }
}

impl CommitmentDetails {
    /// Creates a new commitment entry.
    ///
    /// # Arguments
    /// * `address` - The public key of the committer.
    /// * `sol_amount` - The amount of SOL committed.
    /// * `tokens_per_sol` - The number of tokens given per SOL committed.
    ///
    /// # Returns
    /// * `CommitmentDetails` - A new commitment details instance.
    fn new(address: Pubkey, sol_amount: u64, tokens_per_sol: u64) -> Self {
        Self {
            address,
            sol_amount,
            token_amount: sol_amount * tokens_per_sol,
            ..Default::default()
        }
    }

    /// Converts commitment details into an event structure.
    ///
    /// # Arguments
    /// * `token` - The token identifier.
    ///
    /// # Returns
    /// * `events::Commitment` - The event representation of the commitment details.
    fn into_events(&self, token: String) -> events::Commitment {
        events::Commitment {
            token,
            sol_amount: self.sol_amount,
            token_amount: self.token_amount,
        }
    }
}
