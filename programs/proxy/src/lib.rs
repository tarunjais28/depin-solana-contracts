#![allow(unexpected_cfgs)]
use crate::instructions::*;
use anchor_lang::{
    prelude::*,
    solana_program::{account_info::AccountInfo, rent::Rent},
};
use anchor_spl::{associated_token::AssociatedToken, metadata::Metadata, token::Token};

mod enums;
mod errors;
mod instructions;
mod structs;

declare_id!("3AYcjz6AuRXuj3VeS8h3sNiX84KKE3wE5wWYQDfBrhqg");

#[program]
pub mod proxy {
    use super::*;

    pub fn create(ctx: Context<CreateDao>, params: structs::create::Params) -> Result<()> {
        create::handler(ctx, params)
    }

    pub fn add_liquidity(ctx: Context<AddLiquidity>, proposal_id: u32) -> Result<()> {
        add_liquidity::handler(ctx, proposal_id)
    }
}
