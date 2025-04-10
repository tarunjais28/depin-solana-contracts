use super::*;

#[account]
#[derive(InitSpace, Eq)]
pub struct ProposalData {
    pub id: u32,
    pub created_at: i64,
    pub created_by: Pubkey,
    pub proposal_type: ProposalType,
    #[max_len(10)]
    pub address: Option<Pubkey>,
    pub approver_threshold: u8,
    #[max_len(50)]
    pub dao_name: Option<String>,
    pub transfer_amount: Option<u64>,
    pub approve_type: ApproverType,
    pub executor_type: ExecutorType,
    pub status: ProposalStatus,
    pub executed_at: Option<i64>,
    #[max_len(10)]
    pub approvers: Vec<Pubkey>,
}

impl PartialEq for ProposalData {
    fn eq(&self, other: &Self) -> bool {
        self.proposal_type == other.proposal_type
            && self.address == other.address
            && self.approver_threshold == other.approver_threshold
            && self.dao_name == other.dao_name
            && self.transfer_amount == other.transfer_amount
            && self.approve_type == other.approve_type
            && self.executor_type == other.executor_type
            && self.status == other.status
            && self.executed_at == other.executed_at
            && self.approvers == other.approvers
    }
}

#[account]
pub struct ProposalsList {
    pub proposals: Vec<ProposalData>,
}

impl ProposalData {
    pub fn execution_completed(&mut self) -> Result<()> {
        self.executed_at = Some(Clock::get()?.unix_timestamp);

        Ok(())
    }

    pub fn approved(&mut self) -> Result<()> {
        if self.approvers.len() as u8 >= self.approver_threshold {
            self.status = ProposalStatus::Approved {
                timestamp: Clock::get()?.unix_timestamp,
            };
        }

        Ok(())
    }

    pub fn rejected(&mut self) -> Result<()> {
        self.status = ProposalStatus::Rejected {
            timestamp: Clock::get()?.unix_timestamp,
        };

        Ok(())
    }

    pub fn is_approved(&self) -> bool {
        matches!(self.status, ProposalStatus::Approved { .. })
    }

    pub fn is_rejected(&self) -> bool {
        matches!(self.status, ProposalStatus::Rejected { .. })
    }

    pub fn is_executed(&self) -> bool {
        self.executed_at.is_some()
    }
}

impl ProposalsList {
    pub fn add_proposal(&mut self, proposal: ProposalData) -> Result<()> {
        msg!("same proposal: {}", self.proposals.contains(&proposal));
        require!(
            !self.proposals.contains(&proposal),
            CustomError::DuplicateProposal
        );

        self.proposals.push(proposal);

        Ok(())
    }

    pub fn perform_execution(
        &mut self,
        proposal_id: u32,
        proposal_type: &ProposalType,
    ) -> Result<ProposalData> {
        let proposal = self
            .proposals
            .iter_mut()
            .find(|p| p.id == proposal_id)
            .ok_or(CustomError::NotFound)?;

        require!(
            proposal.proposal_type.eq(proposal_type),
            CustomError::InvalidProposalType
        );
        require!(proposal.is_approved(), CustomError::NotApproved);
        require!(!proposal.is_executed(), CustomError::AlreadyExecuted);

        proposal.execution_completed()?;

        Ok(proposal.clone())
    }

    pub fn get_dao_name(&self, proposal_id: u32) -> Result<String> {
        let proposal = self
            .proposals
            .iter()
            .find(|p| p.id == proposal_id)
            .ok_or(CustomError::NotFound)?;

        let dao_name = proposal.dao_name.as_ref().ok_or(CustomError::NotFound)?;
        Ok(dao_name.to_string())
    }
}
