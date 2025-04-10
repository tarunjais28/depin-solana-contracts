use super::*;

pub fn handler(
    ctx: Context<GetEstimatedAmount>,
    amount_in: u64,
    amount_type: fund::AmountType,
) -> Result<u64> {
    let trade = &ctx.accounts.trade;

    use fund::AmountType::*;
    let amount_out = match amount_type {
        Sol => {
            let fees = calc_amount(amount_in as u128, trade.fee_percent as u128);
            get_amount_out(
                (amount_in - fees) as u128,
                trade.sol_reserve as u128,
                trade.token_reserve as u128,
            )
        }
        Token => {
            let sol_amount = get_amount_out(
                amount_in as u128,
                trade.token_reserve as u128,
                trade.sol_reserve as u128,
            );
            let fees = calc_amount(sol_amount as u128, trade.fee_percent as u128);
            sol_amount - fees
        }
    };

    Ok(amount_out)
}

/// Accounts required for the `GetEstimatedAmount` instruction.
/// This struct defines the necessary accounts used in the transaction.
#[derive(Accounts)]
#[instruction()]
pub struct GetEstimatedAmount<'info> {
    /// Trade account that holds liquidity pool details.
    #[account(
        seeds = [TRADE_TAG, mint_account.key().as_ref()],
        bump,
    )]
    pub trade: Box<Account<'info, Trade>>,

    /// The mint account associated with the token being purchased.
    #[account()]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,
}
