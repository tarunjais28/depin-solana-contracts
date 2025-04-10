/// Calculates amount based on amount and fee percentage
///
/// # Arguments
/// * `amount` - The base amount to calculate proportionate amount on
/// * `percent` - The percentage to apply, 6 decimals
///
/// # Returns
/// * The calculated fee amount as a u64
pub fn calc_amount(amount: u128, percent: u128) -> u64 {
    // Multiply the amount by the percentage, divide by 100 to get the fee
    // Convert the result to u64 as fees are usually whole numbers
    (amount * percent / 100000000) as u64
}

/// Calculates the number of days between two timestamps
///
/// # Arguments
/// * `from` - The start timestamp (in seconds)
/// * `to` - The end timestamp (in seconds)
///
/// # Returns
/// * The number of days as a u16
pub fn calc_days(from: i64, to: i64) -> u16 {
    // Compute the difference between timestamps in seconds
    // Convert seconds to days by dividing by (60 * 60 * 24)
    ((to - from) / (60 * 60 * 24)) as u16
}

/// Calculates the number of tokens per SOL based on the fundraising goal and total token supply.
///
/// # Parameters
/// - `fundraise_goal` (`u128`): The total amount of SOL targeted for fundraising.
/// - `supply` (`u128`): The total supply of tokens available.
///
/// # Returns
/// - `u64`: The number of tokens that can be obtained per SOL.
///
/// # Formula
/// - Only 90% of the total token supply is considered for distribution.
/// - The per-SOL token value is calculated as:
///   [ tokens per SOL = (90% of supply) / fundraise_goal ]
pub fn calc_token_per_sol(fundraise_goal: u128, supply: u128) -> u64 {
    // Compute 90% of the total token supply
    let supply_90 = supply * 90 / 100;

    // Calculate how many tokens can be allocated per SOL, based on the fundraising goal.
    // Converting the result to `u64` ensures compatibility with downstream calculations.
    (supply_90 / fundraise_goal) as u64
}
