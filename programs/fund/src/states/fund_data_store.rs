use super::*;

/// Struct that stores fundraising-related data.
#[account]
pub struct FundDataStore {
    /// Timestamp indicating when the fundraising campaign was created.
    pub created_at: i64,

    /// created_by.
    pub created_by: Pubkey,

    /// The end date of the fundraising campaign (Unix timestamp).
    pub start_date: i64,

    /// The end date of the fundraising campaign (Unix timestamp).
    pub end_date: i64,

    /// The fundraising goal, represented in SOL.
    pub fundraising_goal: u64, // Total SOL amount to be raised.

    /// The current status of the fundraising campaign.
    pub status: Status,

    /// Number of tokens allocated per SOL contributed.
    pub tokens_per_sol: u64,

    /// Fee percentage deducted from contributions.
    pub fee_percent: u32,

    /// Vesting percentage configuration.
    pub vesting_percent: VestingPercent,

    pub creators: CreatorShare,

    pub deployers: DeployerShare,
}

impl FundDataStore {
    /// Initializes the fundraising data with given parameters.
    ///
    /// # Arguments
    /// * `create_params` - Struct containing fundraising parameters.
    /// * `fee_percent` - Percentage of fees to be applied.
    ///
    /// # Returns
    /// * `Result<()>` - Returns `Ok(())` on success or an error if timestamp retrieval fails.
    pub fn add(
        &mut self,
        create_params: &structs::create::Params,
        fee_percent: u32,
        caller: Pubkey,
    ) -> Result<()> {
        // Initialize fundraising parameters.
        self.fundraising_goal = create_params.fundraising_goal;
        self.tokens_per_sol = calc_token_per_sol(
            create_params.fundraising_goal as u128,
            create_params.amount as u128,
        );
        self.update_status(Status::Created)?; // Default status set to "Created".
        self.fee_percent = fee_percent;
        self.vesting_percent = create_params.vesting_percent;
        self.created_by = caller;

        self.calc_shares();

        Ok(())
    }

    fn calc_shares(&mut self) {
        let total_withdrawable = calc_amount(self.fundraising_goal as u128, 90000000); // 90% of the sol raised
        self.creators.total_withdrawable = calc_amount(total_withdrawable as u128, 49000000); // 49% of 90% of the sol raised
        self.deployers.total_withdrawable = calc_amount(total_withdrawable as u128, 51000000);
        // 51% of 90% of the sol raised
    }

    pub fn check_creator_withdrawl(&self, amount: u64) -> Result<()> {
        require!(
            self.creator_withdrawn_amount() + amount <= self.creators.total_withdrawable,
            CustomError::ExceedsWithdrawLimit
        );

        Ok(())
    }

    pub fn update_creator_amount(&mut self, amount: u64) -> Result<()> {
        self.creators.creators.push(CreatorData::new(amount)?);

        Ok(())
    }

    pub fn check_deployer_withdrawl(&self, amount: u64) -> Result<()> {
        require!(
            self.deployers_withdrawn_amount() + amount <= self.deployers.total_withdrawable,
            CustomError::ExceedsWithdrawLimit
        );

        Ok(())
    }

    pub fn is_new_deployer(&self, address: &Pubkey) -> bool {
        !self
            .deployers
            .deployers
            .iter()
            .any(|dep| dep.address.eq(address))
    }

    pub fn update_deployer_amount(&mut self, address: Pubkey, amount: u64) -> Result<()> {
        let deployer_data = DeployerData::new(address, amount)?;
        if let Some(deployer) = self
            .deployers
            .deployers
            .iter_mut()
            .find(|dep| dep.address == address)
        {
            deployer.add(deployer_data);
        } else {
            self.deployers.deployers.push(deployer_data);
        }

        Ok(())
    }

    /// Updates the status of the fundraising campaign.
    ///
    /// # Arguments
    /// * `status` - The new status to be set.
    pub fn update_status(&mut self, status: Status) -> Result<()> {
        self.status = status;

        // Get the current timestamp and handle any potential errors.
        let now = Clock::get()
            .map_err(|_| CustomError::TimestampError)?
            .unix_timestamp;

        use Status::*;
        match self.status {
            Created => self.created_at = now,
            FundraisingVip => self.start_date = now,
            FundraisingSuccess | FundraisingFail | Trade | Expired | Closed => self.end_date = now,
            _ => (),
        }

        Ok(())
    }

    /// Calculate the liquidity pair value.
    ///
    /// # Arguments
    /// * `supply` - Token supply.
    pub fn calc_lp_pairs(&self, supply: u128) -> (u64, u64) {
        let tokens = 10 * supply / 100;
        let sols = tokens / self.tokens_per_sol as u128;
        (tokens as u64, sols as u64)
    }

    pub fn creator_withdrawn_amount(&self) -> u64 {
        self.creators.creators.iter().map(|cr| cr.amount).sum()
    }

    pub fn deployers_withdrawn_amount(&self) -> u64 {
        self.deployers.deployers.iter().map(|dep| dep.amount).sum()
    }

    pub fn realloc_for_deployer(&self) -> usize {
        32 + size_of::<FundDataStore>()
            + (self.creators.creators.len() * size_of::<CreatorData>())
            + size_of::<Pubkey>()
            + size_of::<u64>()
            + ((self.deployers.deployers.len() + 1) * size_of::<DeployerData>())
            + size_of::<u64>()
    }

    pub fn realloc_for_creator(&self) -> usize {
        32 + size_of::<FundDataStore>()
            + ((self.creators.creators.len() + 1) * size_of::<CreatorData>())
            + size_of::<Pubkey>()
            + size_of::<u64>()
            + (self.deployers.deployers.len() * size_of::<DeployerData>())
            + size_of::<u64>()
    }
}

/// Struct that defines the vesting schedule percentages.
#[account]
#[derive(InitSpace, Copy)]
pub struct VestingPercent {
    /// Percentage of tokens that can be claimed on the first claim.
    pub first_claim: u32,

    /// Daily percentage of tokens that can be claimed after the first claim.
    pub daily_claim: u32,
}

/// Struct that defines the vesting schedule percentages.
#[account]
pub struct DeployerShare {
    pub deployers: Vec<DeployerData>,
    pub total_withdrawable: u64,
}

/// Struct that defines the vesting schedule percentages.
#[account]
#[derive(InitSpace, Copy)]
pub struct DeployerData {
    pub address: Pubkey,
    pub amount: u64,
    pub claimed_at: i64,
}

impl DeployerData {
    fn new(address: Pubkey, amount: u64) -> Result<Self> {
        Ok(Self {
            address,
            amount,
            claimed_at: Clock::get()?.unix_timestamp,
        })
    }

    fn add(&mut self, other: DeployerData) {
        self.amount += other.amount;
        self.claimed_at = other.claimed_at;
    }
}

/// Struct that defines the vesting schedule percentages.
#[account]
pub struct CreatorShare {
    pub address: Pubkey,
    pub total_withdrawable: u64,
    pub creators: Vec<CreatorData>,
}

/// Struct that defines the vesting schedule percentages.
#[account]
#[derive(InitSpace, Copy)]
pub struct CreatorData {
    pub amount: u64,
    pub claimed_at: i64,
}

impl CreatorData {
    fn new(amount: u64) -> Result<Self> {
        Ok(Self {
            amount,
            claimed_at: Clock::get()?.unix_timestamp,
        })
    }
}
