# README

## Overview
This project implements a decentralized fundraising and token management system with various functionalities for users, creators, and administrators.

## Functions

### 1. **burn**
   - **Description:** Burns (permanently removes) a specified amount of tokens from circulation.
   - **Function Definition:**
     ```rust
     pub fn burn(ctx: Context<Burn>, amount: u64) -> Result<()>;
     ```
   - **Usage:** Typically used to reduce total supply and increase scarcity of tokens.

### 2. **claim**
   - **Description:** Allows users to claim their allocated tokens based on vesting schedules.
   - **Function Definition:**
     ```rust
     pub fn claim(ctx: Context<Claim>, params: structs::claim::Params) -> Result<()>;
     ```
   - **Usage:** Users who participated in fundraising can claim their vested tokens periodically.

### 3. **commitments**
   - **Description:** Manages user commitments to fundraising campaigns.
   - **Function Definition:**
     ```rust
     pub fn commitments(ctx: Context<Commitments>, params: structs::commit::Params) -> Result<()>;
     ```
   - **Usage:** Tracks committed SOL and corresponding token allocations.

### 4. **create**
   - **Description:** Initializes a new fundraising campaign.
   - **Function Definition:**
     ```rust
     pub fn create(ctx: Context<Create>, params: structs::create::Params) -> Result<()>;
     ```
   - **Usage:** Used by creators to set up a token fundraising initiative with specific parameters.

### 5. **init_commitments**
   - **Description:** Initializes the commitments structure for a fundraising campaign.
   - **Function Definition:**
     ```rust
     pub fn init_commitments(ctx: Context<InitCommitments>) -> Result<()>;
     ```
   - **Usage:** Ensures that user contributions and vesting schedules are properly recorded.

### 6. **init_creators**
   - **Description:** Initializes the list of creators eligible to start fundraising campaigns.
   - **Function Definition:**
     ```rust
     pub fn init_creators(ctx: Context<InitCreators>) -> Result<()>;
     ```
   - **Usage:** Allows the registration of new creators who can launch token sales.

### 7. **init_users**
   - **Description:** Initializes user roles and contribution limits.
   - **Function Definition:**
     ```rust
     pub fn init_users(ctx: Context<InitUsers>) -> Result<()>;
     ```
   - **Usage:** Used to categorize users as VIP or Party participants with different privileges.

### 8. **initialize**
   - **Description:** Sets up the global configuration, including admin and sub-admin roles.
   - **Function Definition:**
     ```rust
     pub fn initialize(ctx: Context<Initialize>, params: structs::initialize::Params) -> Result<()>;
     ```
   - **Usage:** Required during the deployment of the program to define key governance structures.

### 9. **maintainers**
   - **Description:** Manages the maintainers responsible for overseeing fundraising activities.
   - **Function Definition:**
     ```rust
     pub fn maintainers(ctx: Context<Maintainers>) -> Result<()>;
     ```
   - **Usage:** Ensures there is a structured team maintaining the fundraising and token ecosystem.

### 10. **manage_creators**
   - **Description:** Adds or removes creators from the platform.
   - **Function Definition:**
     ```rust
     pub fn manage_creators(ctx: Context<AddCreators>, params: structs::manage_creators::Params) -> Result<()>;
     ```
   - **Usage:** Allows authorized admins to manage who can initiate fundraising campaigns.

### 11. **manage_users**
   - **Description:** Adds or removes users from different fundraising categories (VIP or Party).
   - **Function Definition:**
     ```rust
     pub fn manage_users(ctx: Context<ManageUsers>, params: structs::manage_users::Params) -> Result<()>;
     ```
   - **Usage:** Helps admins control who can participate in exclusive fundraising phases.

### 12. **mint**
   - **Description:** Mints new tokens and assigns them to a specified address.
   - **Function Definition:**
     ```rust
     pub fn mint(ctx: Context<Mint>, params: structs::mint::Params) -> Result<()>;
     ```
   - **Usage:** Used for distributing tokens as per the fundraising campaign or project needs.

### 13. **transfer**
   - **Description:** Transfers tokens from one user to another.
   - **Function Definition:**
     ```rust
     pub fn transfer(ctx: Context<Transfer>, params: structs::transfer::Params) -> Result<()>;
     ```
   - **Usage:** Enables token holders to send tokens to other addresses.

### 14. **update_fee_account**
   - **Description:** Updates the account that collects fees from transactions.
   - **Function Definition:**
     ```rust
     pub fn update_fee_account(ctx: Context<UpdateFeeAccount>, params: structs::update_fee_account::Params) -> Result<()>;
     ```
   - **Usage:** Ensures that fees are directed to the correct administrative account.

### 15. **update_fees**
   - **Description:** Updates the percentage fee applied to transactions.
   - **Function Definition:**
     ```rust
     pub fn update_fees(ctx: Context<UpdateFees>, params: structs::update_fee::Params) -> Result<()>;
     ```
   - **Usage:** Used to modify platform fees based on governance decisions.

## Installation & Deployment
1. Clone the repository.
2. Install dependencies.
3. Deploy the smart contract using Anchor.

## License
This project is licensed under the MIT License.

