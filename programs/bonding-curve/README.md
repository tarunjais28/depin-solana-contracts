# Bonding Curve Smart Contract

## Overview
This smart contract provides functionalities for liquidity management, including adding and removing liquidity, buying and selling tokens, and managing administrative roles.

## Functions

### 1. Initialize
**Function:** `handler(ctx: Context<Initialize>, fees_collection_account: Pubkey) -> Result<()>`

**Description:**
- Initializes the contract.
- Stores the admin and fee collection account.
- Emits an initialization event.

**Accounts:**
- `global_config`: Stores global configuration.
- `authority`: The admin initializing the contract.
- `system_program`: Solana system program.

---

### 2. Add Liquidity
**Function:** `handler(ctx: Context<AddLiquidity>, sol_amount: u64, token_amount: u64) -> Result<()>`

**Description:**
- Adds liquidity to the reserve.
- Updates the reserves for SOL and tokens.
- Emits an event indicating liquidity addition.

**Accounts:**
- `global_config`: Global configuration.
- `sol_reserve`: Solana reserve account.
- `token_reserve`: Token reserve account.
- `mint_account`: Mint account.
- `from_ata`: User's token ATA.
- `authority`: Liquidity provider.
- `token_program`: Solana Token program.
- `system_program`: Solana system program.

---

### 3. Remove Liquidity
**Function:** `handler(ctx: Context<RemoveLiquidity>) -> Result<()>`

**Description:**
- Allows sub-admin to remove liquidity.
- Transfers SOL and tokens back to the user's account.
- Emits an event indicating liquidity removal.

**Accounts:**
- `global_config`: Global configuration.
- `sol_reserve`: Solana reserve account.
- `token_reserve`: Token reserve account.
- `mint_account`: Mint account.
- `to_ata`: User's token ATA.
- `to_account`: User's account.
- `authority`: Sub-admin executing the removal.
- `token_program`: Solana Token program.
- `system_program`: Solana system program.

---

### 4. Buy
**Function:** `handler(ctx: Context<Buy>, sol_amount: u64) -> Result<()>`

**Description:**
- Allows users to buy tokens by providing SOL.
- Deducts fees from the transaction.
- Updates the reserves accordingly.
- Emits an event indicating token purchase.

**Accounts:**
- `global_config`: Global configuration.
- `trade`: Trade account.
- `sol_reserve`: Solana reserve account.
- `token_reserve`: Token reserve account.
- `mint_account`: Mint account.
- `to_ata`: User's token ATA.
- `fees_collection_account`: Account where fees are collected.
- `payer`: User buying tokens.
- `token_program`: Solana Token program.
- `system_program`: Solana system program.

---

### 5. Sell
**Function:** `handler(ctx: Context<Sell>, token_amount: u64) -> Result<()>`

**Description:**
- Allows users to sell tokens for SOL.
- Deducts fees from the transaction.
- Updates the reserves accordingly.
- Emits an event indicating token sale.

**Accounts:**
- `global_config`: Global configuration.
- `trade`: Trade account.
- `sol_reserve`: Solana reserve account.
- `token_reserve`: Token reserve account.
- `mint_account`: Mint account.
- `from_ata`: User's token ATA.
- `fees_collection_account`: Account where fees are collected.
- `payer`: User selling tokens.
- `token_program`: Solana Token program.
- `system_program`: Solana system program.

---

### 6. Add Sub-Admin
**Function:** `add_sub_admins(ctx: Context<UpdateSubAdmins>, addresses: Vec<Pubkey>) -> Result<()>`

**Description:**
- Adds new sub-admins to the contract.
- Only the admin can execute this function.
- Emits an event upon successful addition.

**Accounts:**
- `global_config`: Global configuration.
- `authority`: Admin executing the operation.
- `system_program`: Solana system program.

---

### 7. Remove Sub-Admin
**Function:** `remove_sub_admins(ctx: Context<UpdateSubAdmins>, addresses: Vec<Pubkey>) -> Result<()>`

**Description:**
- Removes sub-admins from the contract.
- Only the admin can execute this function.
- Emits an event upon successful removal.

**Accounts:**
- `global_config`: Global configuration.
- `authority`: Admin executing the operation.
- `system_program`: Solana system program.

---

### 8. Update Admin
**Function:** `update_admin(ctx: Context<UpdateGlobalConfig>, address: Pubkey) -> Result<()>`

**Description:**
- Updates the admin of the contract.
- Only the current admin can execute this function.
- Emits an event upon successful admin update.

**Accounts:**
- `global_config`: Global configuration.
- `authority`: Admin executing the operation.
- `system_program`: Solana system program.

---

### 9. Update Fee Account
**Function:** `update_fee_account(ctx: Context<UpdateFeeAccount>, address: Pubkey) -> Result<()>`

**Description:**
- Updates the fee collection account.
- Only the admin can execute this function.
- Emits an event upon successful update.

**Accounts:**
- `global_config`: Global configuration.
- `authority`: Admin executing the operation.
- `system_program`: Solana system program.

---

### 10. Update Fee Percentage
**Function:** `update_fee(ctx: Context<UpdateFee>, fee_percent: u8) -> Result<()>`

**Description:**
- Updates the fee percentage for trades.
- Only the admin can execute this function.
- Emits an event upon successful update.

**Accounts:**
- `global_config`: Global configuration.
- `authority`: Admin executing the operation.
- `system_program`: Solana system program.

---

## Events
The contract emits events for various operations, such as:
- `Init` - Emitted when the contract is initialized.
- `LiquidityAdded` - Emitted when liquidity is added.
- `LiquidityRemoved` - Emitted when liquidity is removed.
- `TokensBought` - Emitted when tokens are purchased.
- `TokensSold` - Emitted when tokens are sold.
- `UpdateAdmin` - Emitted when admin is updated.
- `UpdateSubAdmins` - Emitted when sub-admins are added or removed.
- `UpdateFeeAccount` - Emitted when the fee account is updated.
- `UpdateFee` - Emitted when the fee percentage is updated.

---

## Installation and Deployment
1. Compile the contract using Anchor:
   ```sh
   anchor build
   ```
2. Deploy to Solana network:
   ```sh
   anchor deploy
   ```
3. Interact with the contract via Anchor CLI or a frontend interface.

---

## Security Considerations
- Ensure only authorized users can modify configurations.
- Proper fee deductions are implemented.
- Prevent overflow/underflow issues in calculations.

---

## License
MIT License

