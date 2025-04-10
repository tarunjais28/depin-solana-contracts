/// Calculates the output amount in a token swap, based on the constant product formula.
///
/// # Arguments
/// * `amount_in` - The input amount of tokens being swapped
/// * `reserve_in` - The current reserve of the input token in the liquidity pool
/// * `reserve_out` - The current reserve of the output token in the liquidity pool
/// * `precision` - The precision multiplier to adjust for token decimal places
///
/// # Returns
/// * `u64` - The output amount after applying the swap formula, adjusted for precision
pub fn get_amount_out(amount_in: u128, reserve_in: u128, reserve_out: u128) -> u64 {
    (amount_in * reserve_out / (amount_in + reserve_in)) as u64
}

/// Calculates the fee amount for a given transaction.
///
/// # Arguments
/// * `amount` - The transaction amount on which fees are applied
/// * `fee_percent` - The percentage of the transaction amount to be taken as a fee
///
/// # Returns
/// * `u64` - The calculated fee amount
pub fn calc_amount(amount: u128, fee_percent: u128) -> u64 {
    (amount * fee_percent / 100000000) as u64
}
