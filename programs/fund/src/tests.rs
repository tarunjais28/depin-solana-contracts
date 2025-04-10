use super::*;

#[test]
fn test_calc_token_per_sol() {
    let fundraise_goal = 5 * 10u128.pow(9);
    let supply = 10u128.pow(9) * 10u128.pow(6);
    let result = calc_token_per_sol(fundraise_goal, supply);
    assert_eq!(result, 180000);
}

#[test]
fn test_calc_days_same_day() {
    // If both timestamps are the same, the difference should be 0 days
    assert_eq!(calc_days(1_700_000_000, 1_700_000_000), 0);
}

#[test]
fn test_calc_days_one_day_apart() {
    // 1-day difference (86400 seconds in a day)
    assert_eq!(calc_days(1_700_086_400, 1_700_000_000), 1);
}

#[test]
fn test_calc_days_multiple_days_apart() {
    // 5-day difference (5 * 86400 seconds)
    assert_eq!(calc_days(1_700_432_000, 1_700_000_000), 5);
}

#[test]
fn test_calc_days_large_gap() {
    // 1000-day difference
    assert_eq!(calc_days(1_786_400_000, 1_700_000_000), 1000);
}
