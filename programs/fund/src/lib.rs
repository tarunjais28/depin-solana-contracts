#![allow(unexpected_cfgs)]
/// Fund Program - A Solana program for managing token funds, creator accounts, and user commitments
/// This program provides functionality for token creation, minting, burning, and transfer operations,
/// as well as managing creator and user accounts with their respective permissions and commitments.
use crate::{constants::*, enums::*, errors::*, helper::*, instructions::*, states::*, utils::*};
use anchor_lang::{
    prelude::*,
    solana_program::{account_info::AccountInfo, entrypoint::ProgramResult, rent::Rent},
    system_program,
};
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3,
        mpl_token_metadata::{self, types::DataV2},
        CreateMetadataAccountsV3, Metadata, MetadataAccount,
    },
    token::{self, set_authority, Burn, MintTo, SetAuthority, Token, Transfer},
    token_interface::{Mint, TokenAccount},
};
pub use enums::{AmountType, ProposalType};
use spl_token::solana_program::entrypoint::MAX_PERMITTED_DATA_INCREASE;
pub use states::{ProposalData, VestingPercent};
use std::{collections::HashSet, mem::size_of};
pub use structs::{create::Params as CreateParams, mint::Params as MintParams};

mod constants; // Program constants and configuration values
mod enums; // Enum definitions for program states
pub mod errors; // Custom error definitions
mod events; // Event definitions for logging
mod helper; // Helper functions
mod instructions; // Instruction handlers
mod states; // Program state definitions
mod structs; // Data structure definitions
mod utils; // Util Libraries

#[cfg(test)]
mod tests;

declare_id!("8i6Qs3NA3jRFWFgz4cx765ck6uNkUtCmt5PkNeFPbg99");

#[program]
pub mod fund {
    use super::*;

    /// Initialize the fund program with a fees collection account
    pub fn init(ctx: Context<Initialize>, fees_collection_account: Pubkey) -> Result<()> {
        initialize::handler(ctx, fees_collection_account)
    }

    /// Initialize the creators account for managing token creators
    pub fn init_creators(ctx: Context<InitCreators>) -> Result<()> {
        init_creators::handler(ctx)
    }

    /// Initialize commitment tracking for a specific token
    pub fn init_commitment(ctx: Context<InitCommitment>, token: String) -> Result<()> {
        init_commitment::handler(ctx, token)
    }

    /// Initialize user accounts with maximum allowable commit amount
    pub fn init_users(ctx: Context<InitUsers>, token: String) -> Result<()> {
        init_users::handler(ctx, token)
    }

    /// Initialize the fund program with a fees collection account
    pub fn init_multisig(ctx: Context<InitMultisig>) -> Result<()> {
        init_multisig::handler(ctx)
    }

    /// Update the owner address for the program
    pub fn update_owner(ctx: Context<UpdateGlobalConfig>, proposal_id: u32) -> Result<()> {
        maintainers::update_owner(ctx, proposal_id)
    }

    /// Add multiple sub-admin accounts to the program
    pub fn add_sub_admin_accounts(
        ctx: Context<UpdateSubAdmins>,
        addresses: Vec<Pubkey>,
    ) -> Result<()> {
        maintainers::add_sub_admins(ctx, addresses)
    }

    /// Remove multiple sub-admin accounts from the program
    pub fn remove_sub_admin_accounts(
        ctx: Context<UpdateSubAdmins>,
        addresses: Vec<Pubkey>,
    ) -> Result<()> {
        maintainers::remove_sub_admins(ctx, addresses)
    }

    /// Update fee parameters for the program
    pub fn update_fees(
        ctx: Context<UpdateFees>,
        params: structs::update_fee::Params,
    ) -> Result<()> {
        update_fees::handler(ctx, params)
    }

    /// Update the fee collection account address
    pub fn update_fee_account(ctx: Context<UpdateFeeAccount>, fee_account: Pubkey) -> Result<()> {
        update_fee_account::handler(ctx, fee_account)
    }

    /// Manage creator accounts and their permissions
    pub fn add_creator(
        ctx: Context<AddCreators>,
        params: structs::add_creator::Params,
    ) -> Result<()> {
        add_creator::handler(ctx, params)
    }

    /// Manage user accounts and their permissions
    pub fn manage_users(
        ctx: Context<ManageUsers>,
        params: structs::manage_users::Params,
    ) -> Result<()> {
        manage_users::handler(ctx, params)
    }

    /// Create a new token with specified parameters
    pub fn create(ctx: Context<CreateToken>, params: structs::create::Params) -> Result<()> {
        create::handler(ctx, params)
    }

    /// Mint additional tokens to a specified account
    pub fn mint(ctx: Context<MintToken>, params: structs::mint::Params) -> Result<()> {
        mint::handler(ctx, params)
    }

    pub fn start_dao(ctx: Context<StartDao>, token: String) -> Result<()> {
        start_dao::handler(ctx, token)
    }

    pub fn start_party_round(ctx: Context<StartPartRound>, token: String) -> Result<()> {
        start_party_round::handler(ctx, token)
    }

    pub fn end_dao(ctx: Context<EndDao>, token: String) -> Result<()> {
        end_dao::handler(ctx, token)
    }

    pub fn block_dao(ctx: Context<BlockDao>, token: String, proposal_id: u32) -> Result<()> {
        block_dao::handler(ctx, token, proposal_id)
    }

    /// Burn tokens from a specified account
    pub fn burn(ctx: Context<BurnTokens>, params: structs::burn::Params) -> Result<()> {
        burn::handler(ctx, params)
    }

    /// Transfer tokens between accounts
    pub fn transfer_to_deployer(
        ctx: Context<TransferSolToDeployer>,
        params: structs::transfer::Params,
    ) -> Result<()> {
        transfer_sol_to_deployer::handler(ctx, params)
    }

    pub fn transfer_sol_to_creator(
        ctx: Context<TransferSolToCreator>,
        params: structs::transfer::Params,
    ) -> Result<()> {
        transfer_sol_to_creator::handler(ctx, params)
    }

    pub fn move_to_lp(ctx: Context<MoveToLP>, token: String) -> Result<()> {
        move_to_lp::handler(ctx, token)
    }

    /// Record a commitment for a specific token
    pub fn commitment(ctx: Context<Commitment>, token: String, sol_amount: u64) -> Result<()> {
        commitment::handler(ctx, token, sol_amount)
    }

    /// Claim tokens based on recorded commitments
    pub fn claim(ctx: Context<Claim>, token: String) -> Result<()> {
        claim::handler(ctx, token)
    }

    /// Claim tokens based on recorded commitments
    /// TODO: day field is added for testing purpose, will be removed in future
    pub fn claim_test(ctx: Context<Claim>, token: String, day: i64) -> Result<()> {
        claim::test(ctx, token, day)
    }

    /// Update the status of a token or account
    pub fn update_status(
        ctx: Context<UpdateStatus>,
        params: structs::update_status::Params,
    ) -> Result<()> {
        update_status::handler(ctx, params)
    }

    /// Check wheather the given account has owner rights or not
    pub fn is_owner(ctx: Context<HasRole>, address: Pubkey) -> Result<bool> {
        has_role::is_owner(ctx, &address)
    }

    /// Check wheather the given account has admin rights or not
    pub fn is_admin(ctx: Context<HasRole>, address: Pubkey) -> Result<bool> {
        has_role::is_admin(ctx, &address)
    }

    /// Check wheather the given account has sub-admin rights or not
    pub fn is_sub_admin(ctx: Context<HasRole>, address: Pubkey) -> Result<bool> {
        has_role::is_sub_admin(ctx, &address)
    }

    /// Check wheather the given account has either admin or sub-admin rights or not
    pub fn is_either_admin_or_sub_admin(ctx: Context<HasRole>, address: Pubkey) -> Result<bool> {
        has_role::is_either_admin_or_sub_admin(ctx, &address)
    }

    /// Upgrade account
    pub fn upgrade_account(ctx: Context<UpgradeAccount>, new_size: u16) -> Result<()> {
        upgrade::upgrade_account_size(ctx, new_size as usize)
    }

    pub fn create_add_admin_proposal(ctx: Context<CreateProposal>, address: Pubkey) -> Result<u32> {
        proposals::create::add_admin::handler(ctx, address)
    }

    pub fn add_admin(ctx: Context<UpdateMaintainers>, proposal_id: u32) -> Result<()> {
        maintainers::add_admin(ctx, proposal_id)
    }

    pub fn create_remove_admin_proposal(
        ctx: Context<CreateProposal>,
        address: Pubkey,
    ) -> Result<u32> {
        proposals::create::remove_admin::handler(ctx, address)
    }

    pub fn remove_admin(ctx: Context<UpdateGlobalConfig>, proposal_id: u32) -> Result<()> {
        maintainers::remove_admin(ctx, proposal_id)
    }

    pub fn reset(ctx: Context<ResetAccount>) -> Result<()> {
        reset::handler(ctx)
    }

    pub fn create_transfer_sol_to_creator_proposal(
        ctx: Context<CreateCreatorProposal>,
        token: String,
        amount: u64,
    ) -> Result<u32> {
        proposals::create::transfer_sol_to_creator::handler(ctx, token, amount)
    }

    pub fn create_transfer_sol_to_deployer_proposal(
        ctx: Context<CreateCreatorProposal>,
        token: String,
        transfer_amount: u64,
        deployer_address: Pubkey,
    ) -> Result<u32> {
        proposals::create::trasnfer_sol_to_deployer::handler(
            ctx,
            token,
            transfer_amount,
            deployer_address,
        )
    }

    pub fn create_add_deployer_proposal(
        ctx: Context<CreateProposal>,
        deployer_address: Pubkey,
    ) -> Result<u32> {
        proposals::create::add_deployer::handler(ctx, deployer_address)
    }

    pub fn add_deployer(ctx: Context<UpdateMaintainers>, proposal_id: u32) -> Result<()> {
        maintainers::add_deployer(ctx, proposal_id)
    }

    pub fn create_remove_deployer_proposal(
        ctx: Context<CreateProposal>,
        deployer_address: Pubkey,
    ) -> Result<u32> {
        proposals::create::remove_deployer::handler(ctx, deployer_address)
    }

    pub fn remove_deployer(ctx: Context<UpdateGlobalConfig>, proposal_id: u32) -> Result<()> {
        maintainers::remove_deployer(ctx, proposal_id)
    }

    pub fn create_update_owner_proposal(
        ctx: Context<CreateProposal>,
        address: Pubkey,
    ) -> Result<u32> {
        proposals::create::update_owner::handler(ctx, address)
    }

    pub fn create_block_dao_proposal(
        ctx: Context<CreateDaoProposal>,
        token: String,
    ) -> Result<u32> {
        proposals::create::block_dao::handler(ctx, token)
    }

    pub fn create_block_creator_proposal(
        ctx: Context<CreateProposal>,
        address: Pubkey,
    ) -> Result<u32> {
        proposals::create::block_creator::handler(ctx, address)
    }

    pub fn blacklist_creator(
        ctx: Context<BlacklistCreator>,
        token: String,
        proposal_id: u32,
    ) -> Result<()> {
        block_creator::handler(ctx, token, proposal_id)
    }

    pub fn create_unblock_creator_proposal(
        ctx: Context<CreateProposal>,
        address: Pubkey,
    ) -> Result<u32> {
        proposals::create::unblock_creator::handler(ctx, address)
    }

    pub fn unblock_creator(ctx: Context<UnblockCreator>, proposal_id: u32) -> Result<()> {
        unblock_creator::handler(ctx, proposal_id)
    }

    pub fn create_block_user_proposal(
        ctx: Context<CreateProposal>,
        address: Pubkey,
    ) -> Result<u32> {
        proposals::create::block_user::handler(ctx, address)
    }

    pub fn blacklist_user(ctx: Context<BlacklistUser>, proposal_id: u32) -> Result<()> {
        block_user::handler(ctx, proposal_id)
    }

    pub fn create_unblock_user_proposal(
        ctx: Context<CreateProposal>,
        address: Pubkey,
    ) -> Result<u32> {
        proposals::create::unblock_user::handler(ctx, address)
    }

    pub fn unblock_user(ctx: Context<BlacklistUser>, proposal_id: u32) -> Result<()> {
        unblock_user::handler(ctx, proposal_id)
    }

    pub fn create_publish_to_amm_proposal(
        ctx: Context<CreateDaoProposal>,
        token: String,
        fee_percent: u32,
    ) -> Result<u32> {
        proposals::create::publish_to_amm::handler(ctx, token, fee_percent)
    }

    pub fn create_remove_liquidity_proposal(
        ctx: Context<CreateDaoProposal>,
        token: String,
        percent: u32,
    ) -> Result<u32> {
        proposals::create::remove_liquidity::handler(ctx, token, percent)
    }

    pub fn get_proposal_data(
        ctx: Context<GetProposalData>,
        proposal_id: u32,
        proposal_type: ProposalType,
    ) -> Result<ProposalData> {
        proposals::get_proposal_data::handler(ctx, proposal_id, proposal_type)
    }

    pub fn is_user_blocked(ctx: Context<IsUserBlocked>, address: Pubkey) -> Result<()> {
        is_user_blocked::handler(ctx, address)
    }

    pub fn approve_proposal(ctx: Context<ApproveProposal>, proposal_id: u32) -> Result<(bool, u8)> {
        proposals::approve::handler(ctx, proposal_id)
    }

    pub fn reject_proposal(ctx: Context<ApproveProposal>, proposal_id: u32) -> Result<bool> {
        proposals::reject::handler(ctx, proposal_id)
    }
}
