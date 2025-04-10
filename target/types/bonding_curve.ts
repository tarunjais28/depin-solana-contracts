/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/bonding_curve.json`.
 */
export type BondingCurve = {
  "address": "ADgy4JNoyTP8X78cC9nV3sw8Wk9Yz6mNX49Y7YCzzkJX",
  "metadata": {
    "name": "bondingCurve",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addLiquidity",
      "docs": [
        "Add liquidity to the bonding curve pool"
      ],
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
          "name": "fundGlobalConfig",
          "docs": [
            "Global configuration account that holds sub-admin and fee collection details."
          ]
        },
        {
          "name": "escrowSolAccount",
          "docs": [
            "The escrow account storing SOL before it is transferred"
          ],
          "writable": true
        },
        {
          "name": "fundDataStore",
          "docs": [
            "The fund data store tracking fundraising status"
          ],
          "writable": true
        },
        {
          "name": "escrowMintAccount",
          "docs": [
            "The escrow account that holds the minted tokens"
          ],
          "writable": true
        },
        {
          "name": "escrowMintAta",
          "docs": [
            "The escrow associated token account (ATA) for storing tokens before transfer"
          ],
          "writable": true
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
          "name": "trade",
          "docs": [
            "Trade account that stores liquidity pool details."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  100,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "solReserve",
          "docs": [
            "SOL reserve account, which stores SOL liquidity."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "tokenReserve",
          "docs": [
            "Token reserve account, which stores token liquidity."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "docs": [
            "The mint account associated with the token being added to the liquidity pool."
          ],
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
          "docs": [
            "Payer account responsible for signing and funding the transaction."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program required for token-related operations."
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "Associated Token Program used for managing ATA accounts."
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program required for system-level operations, such as transferring SOL."
          ],
          "address": "11111111111111111111111111111111"
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
      "name": "buyTokens",
      "docs": [
        "Buy tokens from the bonding curve pool using SOL"
      ],
      "discriminator": [
        189,
        21,
        230,
        133,
        247,
        2,
        110,
        42
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Global configuration account that holds fee and admin-related details."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "trade",
          "docs": [
            "Trade account that holds liquidity pool details."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  100,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "solReserve",
          "docs": [
            "SOL reserve account that holds liquidity pool SOL funds."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "tokenReserve",
          "docs": [
            "Token reserve account that holds liquidity pool token funds."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "docs": [
            "The mint account associated with the token being purchased."
          ],
          "writable": true
        },
        {
          "name": "toAta",
          "docs": [
            "Associated Token Account (ATA) of the recipient, where tokens will be transferred.",
            "If not initialized, it will be created."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "payer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "feesCollectionAccount",
          "docs": [
            "Account where collected trading fees are stored.",
            "Ensures it matches the global configuration's fee collection account."
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "The payer account, which funds the transaction and where the purchased tokens will be credited."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "blacklist"
        },
        {
          "name": "fund",
          "address": "8i6Qs3NA3jRFWFgz4cx765ck6uNkUtCmt5PkNeFPbg99"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program used for token transfers."
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "Associated Token Program used for managing ATAs."
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program used for SOL transfers and account initialization."
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "getEstimatedAmount",
      "docs": [
        "Get Estimated Amount"
      ],
      "discriminator": [
        86,
        36,
        37,
        243,
        155,
        198,
        60,
        199
      ],
      "accounts": [
        {
          "name": "trade",
          "docs": [
            "Trade account that holds liquidity pool details."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  100,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "docs": [
            "The mint account associated with the token being purchased."
          ]
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "amountType",
          "type": {
            "defined": {
              "name": "amountType"
            }
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "init",
      "docs": [
        "Initialize the bonding curve program with a fees collection account"
      ],
      "discriminator": [
        220,
        59,
        207,
        236,
        108,
        250,
        47,
        100
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "The global configuration account that holds contract settings."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "docs": [
            "The account that is initializing the contract (also the initial admin)."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System Program used for account creation and rent exemption."
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "feesCollectionAccount",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "initTrade",
      "docs": [
        "Initialize the trade"
      ],
      "discriminator": [
        170,
        131,
        16,
        173,
        118,
        111,
        67,
        122
      ],
      "accounts": [
        {
          "name": "fundGlobalConfig"
        },
        {
          "name": "fund",
          "address": "8i6Qs3NA3jRFWFgz4cx765ck6uNkUtCmt5PkNeFPbg99"
        },
        {
          "name": "solReserve",
          "docs": [
            "SOL reserve account, which stores SOL liquidity required for trading."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "tokenReserve",
          "docs": [
            "Token reserve account, which stores token liquidity for the trade.",
            "This is initialized if needed, ensuring there is a token reserve available."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "docs": [
            "The mint account associated with the token being added to the liquidity pool.",
            "This represents the token that will be traded in the liquidity pool."
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "The payer account, which is responsible for signing and funding the transaction.",
            "This account must be a valid signer and provide the required SOL for rent."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Token program required for token-related operations such as minting and transfers."
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program required for system-level operations, including transferring SOL.",
            "This is needed for funding the SOL reserve account."
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "removeLiquidity",
      "docs": [
        "Remove liquidity from the bonding curve pool"
      ],
      "discriminator": [
        80,
        85,
        209,
        72,
        24,
        206,
        177,
        108
      ],
      "accounts": [
        {
          "name": "fundGlobalConfig"
        },
        {
          "name": "fund",
          "address": "8i6Qs3NA3jRFWFgz4cx765ck6uNkUtCmt5PkNeFPbg99"
        },
        {
          "name": "trade",
          "docs": [
            "Trade account that stores liquidity pool details."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  100,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "solReserve",
          "docs": [
            "Reserve SOL account that holds liquidity in SOL."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "tokenReserve",
          "docs": [
            "Reserve token account that holds liquidity in tokens."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "proposalsList",
          "writable": true
        },
        {
          "name": "mintAccount",
          "docs": [
            "The mint account associated with the token being withdrawn."
          ],
          "writable": true
        },
        {
          "name": "toAta",
          "docs": [
            "The recipient's associated token account where withdrawn tokens will be transferred."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "toAccount"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "toAccount",
          "docs": [
            "The recipient account where withdrawn SOL will be transferred."
          ],
          "writable": true
        },
        {
          "name": "authority",
          "docs": [
            "The authority executing the transaction, who must have sub-admin privileges."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "The Solana token program, used for token transfers."
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "The associated token program required for managing token accounts."
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana system program, used for SOL transfers."
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "percent",
          "type": "u32"
        }
      ]
    },
    {
      "name": "sellTokens",
      "docs": [
        "Sell tokens back to the bonding curve pool for SOL"
      ],
      "discriminator": [
        114,
        242,
        25,
        12,
        62,
        126,
        92,
        2
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "The global configuration account that holds contract settings."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "trade",
          "docs": [
            "The trade account storing trade-related data."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  100,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "solReserve",
          "docs": [
            "Reserve SOL account where SOL is held for trade settlements.",
            "This is a manually checked account (not a structured type)."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "tokenReserve",
          "docs": [
            "Reserve token account where tokens are stored for trades."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "docs": [
            "The mint account associated with the token being traded."
          ],
          "writable": true
        },
        {
          "name": "fromAta",
          "docs": [
            "The account holding the tokens being sold (user's associated token account)."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "payer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "feesCollectionAccount",
          "docs": [
            "The fees collection account where trading fees are sent."
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "The user executing the sell transaction."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "blacklist"
        },
        {
          "name": "fund",
          "address": "8i6Qs3NA3jRFWFgz4cx765ck6uNkUtCmt5PkNeFPbg99"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "The Solana token program for managing token transfers."
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "The associated token program required for managing token accounts."
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana system program, used for SOL transfers."
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateFeeAccount",
      "docs": [
        "Update the fee collection account address"
      ],
      "discriminator": [
        217,
        138,
        47,
        96,
        184,
        90,
        227,
        19
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Global configuration account that holds fee and admin-related details."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "fundGlobalConfig"
        },
        {
          "name": "fund",
          "address": "8i6Qs3NA3jRFWFgz4cx765ck6uNkUtCmt5PkNeFPbg99"
        },
        {
          "name": "authority",
          "docs": [
            "The account that is making the update request (must be the current admin)."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System Program used for account updates."
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "feeAccount",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateFees",
      "docs": [
        "Update the fee percentage charged on trades"
      ],
      "discriminator": [
        225,
        27,
        13,
        6,
        69,
        84,
        172,
        191
      ],
      "accounts": [
        {
          "name": "fundGlobalConfig"
        },
        {
          "name": "fund",
          "address": "8i6Qs3NA3jRFWFgz4cx765ck6uNkUtCmt5PkNeFPbg99"
        },
        {
          "name": "trade",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  100,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "feePercent",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalConfig",
      "discriminator": [
        149,
        8,
        156,
        202,
        160,
        252,
        176,
        217
      ]
    },
    {
      "name": "trade",
      "discriminator": [
        132,
        139,
        123,
        31,
        157,
        196,
        244,
        190
      ]
    }
  ],
  "events": [
    {
      "name": "feeAccountUpdated",
      "discriminator": [
        229,
        205,
        84,
        149,
        89,
        243,
        195,
        131
      ]
    },
    {
      "name": "feeUpdated",
      "discriminator": [
        228,
        75,
        43,
        103,
        9,
        196,
        182,
        4
      ]
    },
    {
      "name": "initiated",
      "discriminator": [
        6,
        108,
        212,
        91,
        67,
        60,
        207,
        221
      ]
    },
    {
      "name": "liquidityAdded",
      "discriminator": [
        154,
        26,
        221,
        108,
        238,
        64,
        217,
        161
      ]
    },
    {
      "name": "liquidityRemoved",
      "discriminator": [
        225,
        105,
        216,
        39,
        124,
        116,
        169,
        189
      ]
    },
    {
      "name": "tokensBought",
      "discriminator": [
        151,
        148,
        173,
        226,
        128,
        30,
        249,
        190
      ]
    },
    {
      "name": "tokensSold",
      "discriminator": [
        217,
        83,
        68,
        137,
        134,
        225,
        94,
        45
      ]
    },
    {
      "name": "tradeInitaited",
      "discriminator": [
        106,
        215,
        116,
        156,
        174,
        252,
        155,
        5
      ]
    },
    {
      "name": "updateAdmin",
      "discriminator": [
        231,
        1,
        36,
        72,
        175,
        188,
        177,
        162
      ]
    },
    {
      "name": "updateSubAdmins",
      "discriminator": [
        107,
        179,
        252,
        180,
        226,
        32,
        194,
        197
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
      "name": "unauthorized",
      "msg": "Error: Unauthorized User!"
    },
    {
      "code": 6002,
      "name": "unknownFeeAccount",
      "msg": "Error: Unknown Fee Account!"
    }
  ],
  "types": [
    {
      "name": "amountType",
      "docs": [
        "Amount Type"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "sol"
          },
          {
            "name": "token"
          }
        ]
      }
    },
    {
      "name": "feeAccountUpdated",
      "docs": [
        "Event emitted when the fee collection account is updated.",
        "Captures the previous and new fee collection account addresses."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "from",
            "docs": [
              "Previous fee collection account address"
            ],
            "type": "pubkey"
          },
          {
            "name": "to",
            "docs": [
              "New fee collection account address"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "feeUpdated",
      "docs": [
        "Event emitted when trading fees are updated.",
        "Captures the token, previous fee, and new fee."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Address of the token for which the fee is updated"
            ],
            "type": "pubkey"
          },
          {
            "name": "from",
            "docs": [
              "Previous fee percentage"
            ],
            "type": "u32"
          },
          {
            "name": "to",
            "docs": [
              "New fee percentage"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "globalConfig",
      "docs": [
        "Global configuration struct to manage admin roles and fee collection settings"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feesCollectionAccount",
            "docs": [
              "Account where fees are collected"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "initiated",
      "docs": [
        "Event emitted when the contract is initialized.",
        "Contains information about the admin and the initial sub-admin."
      ],
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "liquidityAdded",
      "docs": [
        "Event emitted when liquidity is added to the pool.",
        "Captures the token address and updated reserve amounts."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Address of the token whose liquidity is added"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenReserve",
            "docs": [
              "Updated token reserve amount in the liquidity pool"
            ],
            "type": "u64"
          },
          {
            "name": "solReserve",
            "docs": [
              "Updated SOL reserve amount in the liquidity pool"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "liquidityRemoved",
      "docs": [
        "Event emitted when liquidity is removed from the pool.",
        "Captures the token address and amounts of tokens and SOL removed."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Address of the token whose liquidity is removed"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenAmount",
            "docs": [
              "Amount of tokens withdrawn from the liquidity pool"
            ],
            "type": "u64"
          },
          {
            "name": "solAmount",
            "docs": [
              "Amount of SOL withdrawn from the liquidity pool"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tokensBought",
      "docs": [
        "Event emitted when tokens are bought in a trade.",
        "Captures the token details, buyer, and amount purchased."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Address of the token being bought"
            ],
            "type": "pubkey"
          },
          {
            "name": "by",
            "docs": [
              "Address of the buyer"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens purchased"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tokensSold",
      "docs": [
        "Event emitted when tokens are sold in a trade.",
        "Captures the token details, seller, and amount sold."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Address of the token being sold"
            ],
            "type": "pubkey"
          },
          {
            "name": "by",
            "docs": [
              "Address of the seller"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens sold"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "trade",
      "docs": [
        "Structure representing a trade, including liquidity reserves, market cap, and fees"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "solReserve",
            "docs": [
              "Amount of SOL in the liquidity pool"
            ],
            "type": "u64"
          },
          {
            "name": "tokenReserve",
            "docs": [
              "Amount of tokens in the liquidity pool"
            ],
            "type": "u64"
          },
          {
            "name": "feePercent",
            "docs": [
              "Trading fee percentage"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "tradeInitaited",
      "docs": [
        "Event emitted when trade is initiated."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Address of the token which is going to trade"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "updateAdmin",
      "docs": [
        "Event emitted when the admin is updated.",
        "Captures the old and new admin addresses."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "from",
            "docs": [
              "Address of the previous admin"
            ],
            "type": "pubkey"
          },
          {
            "name": "to",
            "docs": [
              "Address of the new admin"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "updateSubAdmins",
      "docs": [
        "Event emitted when sub-admins are updated.",
        "Captures the type of update and affected addresses."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "updateType",
            "docs": [
              "Type of update (e.g., added or removed sub-admins)"
            ],
            "type": {
              "defined": {
                "name": "updateType"
              }
            }
          },
          {
            "name": "addresses",
            "docs": [
              "List of sub-admin addresses affected by the update"
            ],
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "updateType",
      "docs": [
        "Update Type"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "add"
          },
          {
            "name": "remove"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "globalConfigTag",
      "docs": [
        "Tag for global configuration accounts"
      ],
      "type": "bytes",
      "value": "[103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103]"
    },
    {
      "name": "mintTag",
      "docs": [
        "Tag for mint accounts"
      ],
      "type": "bytes",
      "value": "[109, 105, 110, 116]"
    },
    {
      "name": "reserveTag",
      "docs": [
        "Tag for reserve accounts that hold liquidity"
      ],
      "type": "bytes",
      "value": "[114, 101, 115, 101, 114, 118, 101]"
    },
    {
      "name": "solTag",
      "docs": [
        "Tag for SOL-related operations and accounts"
      ],
      "type": "bytes",
      "value": "[115, 111, 108]"
    },
    {
      "name": "tradeTag",
      "docs": [
        "Tag for trade-related accounts and operations"
      ],
      "type": "bytes",
      "value": "[116, 114, 97, 100, 101]"
    }
  ]
};
