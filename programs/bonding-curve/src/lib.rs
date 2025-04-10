#![allow(unexpected_cfgs)]
/// Bonding Curve Program - A Solana program implementing an automated market maker with a bonding curve pricing mechanism
/// This program allows users to buy and sell tokens according to a predefined price curve, where the price increases
/// with the supply of tokens. It also supports liquidity provision and fee collection.
use crate::{constants::*, enums::*, errors::*, helper::*, instructions::*, states::*, utils::*};
use anchor_lang::{
    prelude::*,
    solana_program::{account_info::AccountInfo, rent::Rent},
    system_program,
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Token, Transfer},
    token_interface::{Mint, TokenAccount},
};
use std::mem::size_of;

mod constants; // Constants used throughout the program
mod enums; // Enum definitions for program states
mod errors; // Custom error definitions
mod events; // Event definitions for logging
mod helper; // Helper functions
mod instructions; // Instruction handlers
mod states; // Program state definitions
mod utils; // Utility functions

declare_id!("ADgy4JNoyTP8X78cC9nV3sw8Wk9Yz6mNX49Y7YCzzkJX");

#[program]
pub mod bonding_curve {
    use super::*;

    /// Initialize the bonding curve program with a fees collection account
    pub fn init(ctx: Context<Initialize>, fees_collection_account: Pubkey) -> Result<()> {
        initialize::handler(ctx, fees_collection_account)
    }

    /// Initialize the trade
    pub fn init_trade(ctx: Context<InitTrade>) -> Result<()> {
        init_trade::handler(ctx)
    }

    /// Update the fee collection account address
    pub fn update_fee_account(ctx: Context<UpdateGlobalConfig>, fee_account: Pubkey) -> Result<()> {
        update_fee_account::handler(ctx, fee_account)
    }

    /// Update the fee percentage charged on trades
    pub fn update_fees(ctx: Context<UpdateFees>, fee_percent: u32) -> Result<()> {
        update_fees::handler(ctx, fee_percent)
    }

    /// Add liquidity to the bonding curve pool
    pub fn add_liquidity(ctx: Context<AddLiquidity>, proposal_id: u32) -> Result<()> {
        add_liquidity::handler(ctx, proposal_id)
    }

    /// Remove liquidity from the bonding curve pool
    pub fn remove_liquidity(ctx: Context<RemoveLiquidity>, percent: u32) -> Result<()> {
        remove_liquidity::handler(ctx, percent)
    }

    /// Buy tokens from the bonding curve pool using SOL
    pub fn buy_tokens(ctx: Context<Buy>, sol_amount: u64) -> Result<()> {
        buy::handler(ctx, sol_amount)
    }

    /// Sell tokens back to the bonding curve pool for SOL
    pub fn sell_tokens(ctx: Context<Sell>, token_amount: u64) -> Result<()> {
        sell::handler(ctx, token_amount)
    }

    /// Get Estimated Amount
    pub fn get_estimated_amount(
        ctx: Context<GetEstimatedAmount>,
        amount_in: u64,
        amount_type: fund::AmountType,
    ) -> Result<u64> {
        get_amount::handler(ctx, amount_in, amount_type)
    }
}
