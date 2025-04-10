use super::*;

/// Account struct to maintain a list of tokens.
#[account]
pub struct DaoList {
    /// The total  tokens currently tracked.
    pub tokens: Vec<String>,
}

impl DaoList {
    /// Adding token to token list.
    pub fn add(&mut self, token: String) {
        self.tokens.push(token);
    }
}
