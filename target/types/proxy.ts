/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/proxy.json`.
 */
export type Proxy = {
  "address": "3AYcjz6AuRXuj3VeS8h3sNiX84KKE3wE5wWYQDfBrhqg",
  "metadata": {
    "name": "proxy",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addLiquidity",
      "discriminator": [
        181,
        157,
        89,
        67,
        143,
        182,
        52,
        72
      ],
      "accounts": [
        {
          "name": "fundGlobalConfig"
        },
        {
          "name": "bondingCurveGlobalConfig"
        },
        {
          "name": "escrowSolAccount",
          "writable": true
        },
        {
          "name": "mintAccount",
          "writable": true
        },
        {
          "name": "trade",
          "writable": true
        },
        {
          "name": "fundDataStore",
          "writable": true
        },
        {
          "name": "solReserve",
          "writable": true
        },
        {
          "name": "tokenReserve",
          "writable": true
        },
        {
          "name": "escrowMintAccount",
          "writable": true
        },
        {
          "name": "escrowMintAta",
          "writable": true
        },
        {
          "name": "creators"
        },
        {
          "name": "proposalsList",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "fund",
          "address": "8i6Qs3NA3jRFWFgz4cx765ck6uNkUtCmt5PkNeFPbg99"
        },
        {
          "name": "bondingCurveProgram",
          "address": "ADgy4JNoyTP8X78cC9nV3sw8Wk9Yz6mNX49Y7YCzzkJX"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "proposalId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "create",
      "discriminator": [
        24,
        30,
        200,
        40,
        5,
        28,
        7,
        119
      ],
      "accounts": [
        {
          "name": "creators",
          "writable": true
        },
        {
          "name": "creatorInfo",
          "writable": true
        },
        {
          "name": "mintAccount",
          "writable": true
        },
        {
          "name": "metadata",
          "writable": true
        },
        {
          "name": "fundDataStore",
          "writable": true
        },
        {
          "name": "daoList",
          "writable": true
        },
        {
          "name": "escrowMintAccount",
          "writable": true
        },
        {
          "name": "escrowMintAta",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "feesCollectionAccount",
          "writable": true
        },
        {
          "name": "fund",
          "address": "8i6Qs3NA3jRFWFgz4cx765ck6uNkUtCmt5PkNeFPbg99"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "params"
            }
          }
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "amountCantBeZero",
      "msg": "Error: Amount can't be zero!"
    },
    {
      "code": 6001,
      "name": "inEligible",
      "msg": "Error: User ineligible to commit!"
    },
    {
      "code": 6002,
      "name": "unauthorized",
      "msg": "Error: Unauthorized User!"
    },
    {
      "code": 6003,
      "name": "unknownReceiver",
      "msg": "Error: Unknown Receiver!"
    },
    {
      "code": 6004,
      "name": "usersStackFull",
      "msg": "Error: Users stack is full!"
    },
    {
      "code": 6005,
      "name": "notFound",
      "msg": "Error: Not Found!"
    },
    {
      "code": 6006,
      "name": "permissionDenied",
      "msg": "Error: Permission Denied!"
    }
  ],
  "types": [
    {
      "name": "params",
      "docs": [
        "The struct containing instructions for creating tokens"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "symbol",
            "docs": [
              "Symbol"
            ],
            "type": "string"
          },
          {
            "name": "decimals",
            "docs": [
              "Decimals"
            ],
            "type": "u8"
          },
          {
            "name": "uri",
            "docs": [
              "URI"
            ],
            "type": "string"
          },
          {
            "name": "amount",
            "docs": [
              "Amount"
            ],
            "type": "u64"
          },
          {
            "name": "fundraisingGoal",
            "docs": [
              "Fundraising Goal in USD"
            ],
            "type": "u64"
          },
          {
            "name": "vestingPercent",
            "docs": [
              "Vesting Percent"
            ],
            "type": {
              "defined": {
                "name": "vestingPercent"
              }
            }
          }
        ]
      }
    },
    {
      "name": "vestingPercent",
      "docs": [
        "Struct that defines the vesting schedule percentages."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "firstClaim",
            "docs": [
              "Percentage of tokens that can be claimed on the first claim."
            ],
            "type": "u32"
          },
          {
            "name": "dailyClaim",
            "docs": [
              "Daily percentage of tokens that can be claimed after the first claim."
            ],
            "type": "u32"
          }
        ]
      }
    }
  ]
};
