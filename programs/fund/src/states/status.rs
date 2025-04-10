use super::*;

/// Enum representing the different statuses a fundraising or trading project can have.
#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum Status {
    /// Initial status when a project is created.
    Created,

    /// The fundraising phase for VIP investors.
    FundraisingVip,

    /// The general fundraising phase open to all investors.
    FundraisingParty,

    /// The fundraising goal has been successfully met.
    FundraisingSuccess,

    /// The fundraising phase has ended, but the goal was not met.
    FundraisingFail,

    /// The project has entered the trading phase.
    Trade,

    /// The project or fundraising has expired.
    Expired,

    /// The project has been closed and is no longer active.
    Closed,
}
