/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fund.json`.
 */
export type Fund = {
  "address": "8i6Qs3NA3jRFWFgz4cx765ck6uNkUtCmt5PkNeFPbg99",
  "metadata": {
    "name": "fund",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addAdmin",
      "discriminator": [
        177,
        236,
        33,
        205,
        124,
        152,
        55,
        186
      ],
      "accounts": [
        {
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creators",
          "docs": [
            "The account storing the list of creators"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "globalConfig",
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
          "name": "executor",
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
          "name": "proposalId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "addCreator",
      "docs": [
        "Manage creator accounts and their permissions"
      ],
      "discriminator": [
        120,
        140,
        147,
        174,
        149,
        203,
        237,
        81
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Reference to the global configuration account"
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
          "name": "creators",
          "docs": [
            "The account storing the list of creators"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "creatorInfo",
          "docs": [
            "Account containing additional creator information (fee percentage, etc.)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              },
              {
                "kind": "arg",
                "path": "params.address"
              }
            ]
          }
        },
        {
          "name": "payer",
          "docs": [
            "The payer who is executing the transaction (must have sub-admin rights)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The system program required for account initialization"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "fund::structs::add_creator::Params"
            }
          }
        }
      ]
    },
    {
      "name": "addDeployer",
      "discriminator": [
        255,
        224,
        113,
        1,
        119,
        74,
        221,
        27
      ],
      "accounts": [
        {
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creators",
          "docs": [
            "The account storing the list of creators"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "globalConfig",
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
          "name": "executor",
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
          "name": "proposalId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "addSubAdminAccounts",
      "docs": [
        "Add multiple sub-admin accounts to the program"
      ],
      "discriminator": [
        130,
        141,
        64,
        137,
        151,
        104,
        59,
        232
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "addresses",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "approveProposal",
      "discriminator": [
        136,
        108,
        102,
        85,
        98,
        114,
        7,
        147
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "approver",
          "writable": true,
          "signer": true
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
      "name": "blacklistCreator",
      "discriminator": [
        152,
        148,
        217,
        136,
        84,
        33,
        229,
        164
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Reference to the global configuration account"
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creators",
          "docs": [
            "The account storing the list of creators"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "fundDataStore",
          "docs": [
            "Fund data store account.",
            "Stores details about the fundraising process, including the current status."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
            "Mint account associated with the DPIT token.",
            "This is used for identifying the token related to the DAO."
          ],
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "executer",
          "docs": [
            "The executer responsible for the transaction"
          ],
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        },
        {
          "name": "proposalId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "blacklistUser",
      "discriminator": [
        227,
        146,
        190,
        19,
        134,
        238,
        79,
        253
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Reference to the global configuration account"
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "blacklist",
          "docs": [
            "Account storing blacklist users"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  108,
                  97,
                  99,
                  107,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "executer",
          "docs": [
            "The executer responsible for the transaction"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program required for allocation and execution of instructions"
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
      "name": "blockDao",
      "discriminator": [
        81,
        100,
        175,
        4,
        100,
        223,
        179,
        211
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Reference to the global configuration account"
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "fundDataStore",
          "docs": [
            "Fund data store account.",
            "Stores details about the fundraising process, including the current status."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
            "Mint account associated with the DPIT token.",
            "This is used for identifying the token related to the DAO."
          ],
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "payer",
          "docs": [
            "The payer (signer) initiating the DAO start.",
            "Must be an authorized creator to perform this action."
          ],
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        },
        {
          "name": "proposalId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "burn",
      "docs": [
        "Burn tokens from a specified account"
      ],
      "discriminator": [
        116,
        110,
        29,
        56,
        107,
        219,
        42,
        93
      ],
      "accounts": [
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "fromAta",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "fund::structs::burn::Params"
            }
          }
        }
      ]
    },
    {
      "name": "claim",
      "docs": [
        "Claim tokens based on recorded commitments"
      ],
      "discriminator": [
        62,
        198,
        214,
        193,
        213,
        159,
        108,
        210
      ],
      "accounts": [
        {
          "name": "feeAccount",
          "docs": [
            "Account storing fee information"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "escrowSolAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "commitments",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  105,
                  116,
                  109,
                  101,
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
          "name": "fundDataStore",
          "docs": [
            "Account that stores fund-related data"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "name": "escrowMintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "escrowMintAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "escrowMintAccount"
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
          "name": "mintAccount",
          "docs": [
            "Mint account for the token being claimed"
          ],
          "writable": true,
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "toAccount",
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
          "name": "payer",
          "docs": [
            "User making the claim"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "feesCollectionAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Solana Token Program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "Solana Associated Token Program"
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "docs": [
            "Solana System Program"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        }
      ]
    },
    {
      "name": "claimTest",
      "docs": [
        "Claim tokens based on recorded commitments",
        "TODO: day field is added for testing purpose, will be removed in future"
      ],
      "discriminator": [
        105,
        216,
        181,
        248,
        74,
        254,
        73,
        153
      ],
      "accounts": [
        {
          "name": "feeAccount",
          "docs": [
            "Account storing fee information"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "escrowSolAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "commitments",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  105,
                  116,
                  109,
                  101,
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
          "name": "fundDataStore",
          "docs": [
            "Account that stores fund-related data"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "name": "escrowMintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "escrowMintAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "escrowMintAccount"
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
          "name": "mintAccount",
          "docs": [
            "Mint account for the token being claimed"
          ],
          "writable": true,
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "toAccount",
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
          "name": "payer",
          "docs": [
            "User making the claim"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "feesCollectionAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Solana Token Program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "Solana Associated Token Program"
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "docs": [
            "Solana System Program"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        },
        {
          "name": "day",
          "type": "i64"
        }
      ]
    },
    {
      "name": "commitment",
      "docs": [
        "Record a commitment for a specific token"
      ],
      "discriminator": [
        71,
        30,
        122,
        145,
        83,
        152,
        188,
        123
      ],
      "accounts": [
        {
          "name": "feeAccount",
          "docs": [
            "Account storing fee information"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "users",
          "docs": [
            "User account managing commitment eligibility"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  115
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
          "name": "blacklist",
          "docs": [
            "Account storing blacklist users"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  108,
                  97,
                  99,
                  107,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "escrowSolAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "commitments",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  105,
                  116,
                  109,
                  101,
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
          "name": "fundDataStore",
          "docs": [
            "Stores fundraising data"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "payer",
          "docs": [
            "User committing the funds"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "feesCollectionAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "Solana System Program"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        },
        {
          "name": "solAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "create",
      "docs": [
        "Create a new token with specified parameters"
      ],
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
          "docs": [
            "Account storing creator information"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "creatorInfo",
          "docs": [
            "Account holding specific creator data"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "docs": [
            "Mint account for the newly created token"
          ],
          "writable": true,
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "params.name"
              }
            ]
          }
        },
        {
          "name": "metadata",
          "writable": true
        },
        {
          "name": "fundDataStore",
          "docs": [
            "Fund data store account to track token information"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "name": "daoList",
          "docs": [
            "Token counter account to track the number of tokens created"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  97,
                  111,
                  95,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "docs": [
            "Account paying for the transaction fees"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "Solana System Program"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "Solana Token Program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "Program for handling associated token accounts"
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenMetadataProgram",
          "docs": [
            "Metaplex Token Metadata Program"
          ],
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "rent",
          "docs": [
            "Rent system variable"
          ],
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "fund::structs::create::Params"
            }
          }
        }
      ]
    },
    {
      "name": "createAddAdminProposal",
      "discriminator": [
        151,
        120,
        12,
        187,
        1,
        184,
        71,
        201
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createAddDeployerProposal",
      "discriminator": [
        61,
        239,
        41,
        185,
        204,
        4,
        135,
        77
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "deployerAddress",
          "type": "pubkey"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createBlockCreatorProposal",
      "discriminator": [
        17,
        72,
        40,
        151,
        8,
        234,
        226,
        17
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createBlockDaoProposal",
      "discriminator": [
        28,
        62,
        91,
        107,
        197,
        209,
        40,
        85
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "fundDataStore",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createBlockUserProposal",
      "discriminator": [
        220,
        177,
        51,
        150,
        112,
        69,
        150,
        139
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createPublishToAmmProposal",
      "discriminator": [
        39,
        148,
        17,
        187,
        70,
        203,
        88,
        103
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "fundDataStore",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        },
        {
          "name": "feePercent",
          "type": "u32"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createRemoveAdminProposal",
      "discriminator": [
        77,
        76,
        62,
        87,
        213,
        227,
        200,
        16
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createRemoveDeployerProposal",
      "discriminator": [
        199,
        243,
        67,
        231,
        217,
        195,
        48,
        229
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "deployerAddress",
          "type": "pubkey"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createRemoveLiquidityProposal",
      "discriminator": [
        201,
        182,
        164,
        117,
        155,
        58,
        7,
        171
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "fundDataStore",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        },
        {
          "name": "percent",
          "type": "u32"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createTransferSolToCreatorProposal",
      "discriminator": [
        231,
        235,
        6,
        111,
        103,
        209,
        14,
        194
      ],
      "accounts": [
        {
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creators",
          "docs": [
            "Account storing creator information"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "metadata"
        },
        {
          "name": "fundDataStore",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "writable": true,
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "signer",
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
          "name": "token",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createTransferSolToDeployerProposal",
      "discriminator": [
        65,
        22,
        27,
        131,
        32,
        232,
        63,
        8
      ],
      "accounts": [
        {
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creators",
          "docs": [
            "Account storing creator information"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "metadata"
        },
        {
          "name": "fundDataStore",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "writable": true,
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "signer",
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
          "name": "token",
          "type": "string"
        },
        {
          "name": "transferAmount",
          "type": "u64"
        },
        {
          "name": "deployerAddress",
          "type": "pubkey"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createUnblockCreatorProposal",
      "discriminator": [
        15,
        249,
        196,
        101,
        249,
        169,
        215,
        232
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createUnblockUserProposal",
      "discriminator": [
        199,
        157,
        170,
        165,
        133,
        71,
        75,
        151
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "createUpdateOwnerProposal",
      "discriminator": [
        221,
        147,
        13,
        132,
        148,
        140,
        36,
        76
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ],
      "returns": "u32"
    },
    {
      "name": "endDao",
      "discriminator": [
        204,
        26,
        1,
        207,
        99,
        183,
        6,
        138
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Reference to the global configuration account"
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
          "name": "fundDataStore",
          "docs": [
            "Fund data store account.",
            "Stores details about the fundraising process, including the current status."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "name": "escrowSolAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "mintAccount",
          "docs": [
            "Mint account associated with the DPIT token.",
            "This is used for identifying the token related to the DAO."
          ],
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "payer",
          "docs": [
            "The payer (signer) initiating the DAO start.",
            "Must be an authorized creator to perform this action."
          ],
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        }
      ]
    },
    {
      "name": "getProposalData",
      "discriminator": [
        103,
        57,
        117,
        173,
        25,
        163,
        246,
        122
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Reference to the global configuration account"
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "executer",
          "docs": [
            "The executer responsible for the transaction"
          ],
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "proposalId",
          "type": "u32"
        },
        {
          "name": "proposalType",
          "type": {
            "defined": {
              "name": "proposalType"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "proposalData"
        }
      }
    },
    {
      "name": "init",
      "docs": [
        "Initialize the fund program with a fees collection account"
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
            "Global configuration account, initialized during contract setup"
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
          "name": "feeAccount",
          "docs": [
            "Fee account, used to store fee collection settings"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "daoList",
          "docs": [
            "Token counter account, used to track token-related data"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  97,
                  111,
                  95,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "docs": [
            "The account that pays for the contract initialization"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program required for account initialization"
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
      "name": "initCommitment",
      "docs": [
        "Initialize commitment tracking for a specific token"
      ],
      "discriminator": [
        14,
        32,
        186,
        120,
        116,
        245,
        153,
        225
      ],
      "accounts": [
        {
          "name": "commitments",
          "docs": [
            "Commitment account that stores commitment-related data"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  105,
                  116,
                  109,
                  101,
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
          "name": "escrowSolAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "mintAccount",
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "payer",
          "docs": [
            "The payer account funding the transaction"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "Solana System Program for handling system instructions"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        }
      ]
    },
    {
      "name": "initCreators",
      "docs": [
        "Initialize the creators account for managing token creators"
      ],
      "discriminator": [
        241,
        227,
        253,
        126,
        185,
        247,
        181,
        229
      ],
      "accounts": [
        {
          "name": "creators",
          "docs": [
            "Account to store creator-related data"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "blacklist",
          "docs": [
            "Account storing blacklist users"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  108,
                  97,
                  99,
                  107,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "docs": [
            "Signer responsible for paying the account creation fee"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program required for account initialization"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initMultisig",
      "docs": [
        "Initialize the fund program with a fees collection account"
      ],
      "discriminator": [
        119,
        130,
        22,
        116,
        114,
        61,
        124,
        66
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Reference to the global configuration account"
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
          "name": "proposalsList",
          "docs": [
            "Proposal List"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "docs": [
            "The signer of the transaction who is initializing the users"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System Program, required for account initialization"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initUsers",
      "docs": [
        "Initialize user accounts with maximum allowable commit amount"
      ],
      "discriminator": [
        92,
        227,
        136,
        23,
        185,
        146,
        31,
        172
      ],
      "accounts": [
        {
          "name": "users",
          "docs": [
            "Stores user-related data, such as maximum allowable commitment amount"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  115
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
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "payer",
          "docs": [
            "The signer of the transaction who is initializing the users"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System Program, required for account initialization"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        }
      ]
    },
    {
      "name": "isAdmin",
      "docs": [
        "Check wheather the given account has admin rights or not"
      ],
      "discriminator": [
        114,
        10,
        83,
        250,
        202,
        233,
        53,
        63
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "The global configuration account that stores information about admin and sub-admin roles."
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
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ],
      "returns": "bool"
    },
    {
      "name": "isEitherAdminOrSubAdmin",
      "docs": [
        "Check wheather the given account has either admin or sub-admin rights or not"
      ],
      "discriminator": [
        103,
        190,
        106,
        106,
        26,
        139,
        121,
        176
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "The global configuration account that stores information about admin and sub-admin roles."
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
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ],
      "returns": "bool"
    },
    {
      "name": "isOwner",
      "docs": [
        "Check wheather the given account has owner rights or not"
      ],
      "discriminator": [
        81,
        83,
        130,
        45,
        19,
        119,
        220,
        252
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "The global configuration account that stores information about admin and sub-admin roles."
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
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ],
      "returns": "bool"
    },
    {
      "name": "isSubAdmin",
      "docs": [
        "Check wheather the given account has sub-admin rights or not"
      ],
      "discriminator": [
        83,
        201,
        238,
        110,
        129,
        255,
        90,
        46
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "The global configuration account that stores information about admin and sub-admin roles."
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
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ],
      "returns": "bool"
    },
    {
      "name": "isUserBlocked",
      "discriminator": [
        153,
        11,
        246,
        136,
        217,
        88,
        146,
        165
      ],
      "accounts": [
        {
          "name": "blacklist",
          "docs": [
            "Account storing blacklist users"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  108,
                  97,
                  99,
                  107,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "manageUsers",
      "docs": [
        "Manage user accounts and their permissions"
      ],
      "discriminator": [
        185,
        76,
        29,
        221,
        89,
        156,
        26,
        24
      ],
      "accounts": [
        {
          "name": "creators",
          "docs": [
            "Account storing creator information, used to verify permissions"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "users",
          "docs": [
            "Account storing user information, updated based on the action (add/remove users)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  115
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
          "name": "fundDataStore",
          "docs": [
            "Fund data store account.",
            "Stores details about the fundraising process, including the current status."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "name": "blacklist",
          "docs": [
            "Account storing blacklist users"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  108,
                  97,
                  99,
                  107,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "metadata"
        },
        {
          "name": "payer",
          "docs": [
            "The payer responsible for the transaction"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program required for allocation and execution of instructions"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "fund::structs::manage_users::Params"
            }
          }
        }
      ]
    },
    {
      "name": "mint",
      "docs": [
        "Mint additional tokens to a specified account"
      ],
      "discriminator": [
        51,
        57,
        225,
        47,
        182,
        146,
        137,
        166
      ],
      "accounts": [
        {
          "name": "mintAccount",
          "docs": [
            "The mint account for the token being minted",
            "This account must be initialized with the correct seed"
          ],
          "writable": true,
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "escrowMintAccount",
          "docs": [
            "The escrow account that will be authorized to mint tokens",
            "This is a PDA that acts as an intermediary holder"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "escrowMintAta",
          "docs": [
            "The associated token account for the escrow to hold minted tokens",
            "This account is initialized if it doesn't exist"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "escrowMintAccount"
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
          "name": "authority",
          "docs": [
            "The authority that can mint tokens",
            "Must be a signer and pays for any account initialization"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "docs": [
            "The SPL Token program account"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System program account"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "The SPL Associated Token program account"
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "fund::structs::mint::Params"
            }
          }
        }
      ]
    },
    {
      "name": "moveToLp",
      "discriminator": [
        51,
        91,
        252,
        146,
        139,
        116,
        52,
        133
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Global configuration storing administrative permissions"
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
          "name": "escrowSolAccount",
          "docs": [
            "The escrow account storing SOL before it is transferred"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "fundDataStore",
          "docs": [
            "The fund data store tracking fundraising status"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "name": "escrowMintAccount",
          "docs": [
            "The escrow account that holds the minted tokens"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "escrowMintAta",
          "docs": [
            "The escrow associated token account (ATA) for storing tokens before transfer"
          ],
          "writable": true
        },
        {
          "name": "mintAccount",
          "docs": [
            "The mint account for the token being transferred"
          ],
          "writable": true,
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "toAccount",
          "docs": [
            "The recipient's account that will receive the SOL or tokens"
          ],
          "writable": true
        },
        {
          "name": "toAta",
          "docs": [
            "The recipient's associated token account (ATA) for receiving tokens"
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "The payer who initiates the transaction"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "callerProgram"
        },
        {
          "name": "tokenProgram",
          "docs": [
            "The SPL Token program"
          ],
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "docs": [
            "The SPL Associated Token program"
          ],
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System program"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        }
      ]
    },
    {
      "name": "rejectProposal",
      "discriminator": [
        114,
        162,
        164,
        82,
        191,
        11,
        102,
        25
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "approver",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "proposalId",
          "type": "u32"
        }
      ],
      "returns": "bool"
    },
    {
      "name": "removeAdmin",
      "discriminator": [
        74,
        202,
        71,
        106,
        252,
        31,
        72,
        183
      ],
      "accounts": [
        {
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "globalConfig",
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
          "name": "executor",
          "writable": true,
          "signer": true
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
      "name": "removeDeployer",
      "discriminator": [
        130,
        155,
        63,
        171,
        224,
        137,
        63,
        106
      ],
      "accounts": [
        {
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "globalConfig",
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
          "name": "executor",
          "writable": true,
          "signer": true
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
      "name": "removeSubAdminAccounts",
      "docs": [
        "Remove multiple sub-admin accounts from the program"
      ],
      "discriminator": [
        152,
        249,
        193,
        89,
        66,
        185,
        139,
        172
      ],
      "accounts": [
        {
          "name": "globalConfig",
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
          "name": "addresses",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "reset",
      "discriminator": [
        23,
        81,
        251,
        84,
        138,
        183,
        240,
        214
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Reference to the global configuration account"
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
          "name": "account",
          "writable": true
        },
        {
          "name": "receiver",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "startDao",
      "discriminator": [
        100,
        74,
        40,
        56,
        20,
        244,
        64,
        109
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Reference to the global configuration account"
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
          "name": "fundDataStore",
          "docs": [
            "Fund data store account.",
            "Stores details about the fundraising process, including the current status."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
            "Mint account associated with the DPIT token.",
            "This is used for identifying the token related to the DAO."
          ],
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "payer",
          "docs": [
            "The payer (signer) initiating the DAO start.",
            "Must be an authorized creator to perform this action."
          ],
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        }
      ]
    },
    {
      "name": "startPartyRound",
      "discriminator": [
        31,
        22,
        203,
        9,
        168,
        80,
        254,
        35
      ],
      "accounts": [
        {
          "name": "creators",
          "docs": [
            "Creators account.",
            "Stores information about the DAO creators and their permissions."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "metadata"
        },
        {
          "name": "fundDataStore",
          "docs": [
            "Fund data store account.",
            "Stores details about the fundraising process, including the current status."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
            "Mint account associated with the DPIT token.",
            "This is used for identifying the token related to the DAO."
          ],
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "payer",
          "docs": [
            "The payer (signer) initiating the DAO start.",
            "Must be an authorized creator to perform this action."
          ],
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        }
      ]
    },
    {
      "name": "transferSolToCreator",
      "discriminator": [
        11,
        66,
        203,
        245,
        66,
        69,
        165,
        61
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Global configuration storing administrative permissions"
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "escrowSolAccount",
          "docs": [
            "The escrow account storing SOL before it is transferred"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "fundDataStore",
          "docs": [
            "The fund data store tracking fundraising status"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
            "The mint account for the token being transferred"
          ],
          "writable": true,
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "creatorAddress",
          "docs": [
            "The recipient's account that will receive the SOL"
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "The payer who initiates the transaction"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System program"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "fund::structs::transfer::Params"
            }
          }
        }
      ]
    },
    {
      "name": "transferToDeployer",
      "docs": [
        "Transfer tokens between accounts"
      ],
      "discriminator": [
        9,
        137,
        144,
        2,
        82,
        209,
        163,
        224
      ],
      "accounts": [
        {
          "name": "creators",
          "docs": [
            "Account storing creator information"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "escrowSolAccount",
          "docs": [
            "The escrow account storing SOL before it is transferred"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
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
          "name": "fundDataStore",
          "docs": [
            "The fund data store tracking fundraising status"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
            "The mint account for the token being transferred"
          ],
          "writable": true,
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "metadata"
        },
        {
          "name": "deployerAddress",
          "docs": [
            "The recipient's account that will receive the SOL or tokens"
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "The payer who initiates the transaction"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System program"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "fund::structs::transfer::Params"
            }
          }
        }
      ]
    },
    {
      "name": "unblockCreator",
      "discriminator": [
        114,
        3,
        143,
        149,
        116,
        8,
        115,
        128
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Reference to the global configuration account"
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creators",
          "docs": [
            "The account storing the list of creators"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "executer",
          "docs": [
            "The executer responsible for the transaction"
          ],
          "writable": true,
          "signer": true
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
      "name": "unblockUser",
      "discriminator": [
        216,
        208,
        128,
        98,
        74,
        210,
        18,
        114
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "docs": [
            "Reference to the global configuration account"
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
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "blacklist",
          "docs": [
            "Account storing blacklist users"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  108,
                  97,
                  99,
                  107,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "executer",
          "docs": [
            "The executer responsible for the transaction"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "System program required for allocation and execution of instructions"
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
            "The global configuration account storing system-wide settings"
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
          "name": "feeAccount",
          "docs": [
            "The fee account storing fee collection details"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "docs": [
            "The authority (must be a signer) requesting the fee account update"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System program account"
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
        "Update fee parameters for the program"
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
          "name": "globalConfig",
          "docs": [
            "Global configuration account.",
            "This holds the list of sub-admins and other global settings."
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
          "name": "creatorInfo",
          "docs": [
            "Creator information account.",
            "This stores information about the creator, including their fee percentage."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              },
              {
                "kind": "arg",
                "path": "params.address"
              }
            ]
          }
        },
        {
          "name": "fundDataStore",
          "docs": [
            "Fund data store account.",
            "This account stores fundraising details, including fee percentages."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
            "The mint account for the associated token.",
            "This account is used to identify which token the fees apply to."
          ],
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "authority",
          "docs": [
            "The signer who must be a sub-admin to authorize this action."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System Program."
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "fund::structs::update_fee::Params"
            }
          }
        }
      ]
    },
    {
      "name": "updateOwner",
      "docs": [
        "Update the owner address for the program"
      ],
      "discriminator": [
        164,
        188,
        124,
        254,
        132,
        26,
        198,
        178
      ],
      "accounts": [
        {
          "name": "proposalsList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "globalConfig",
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
          "name": "executor",
          "writable": true,
          "signer": true
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
      "name": "updateStatus",
      "docs": [
        "Update the status of a token or account"
      ],
      "discriminator": [
        147,
        215,
        74,
        174,
        55,
        191,
        42,
        0
      ],
      "accounts": [
        {
          "name": "creators",
          "docs": [
            "Creators account.",
            "This stores information about the creators, including their permissions."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "fundDataStore",
          "docs": [
            "Fund data store account.",
            "This account stores fundraising details, including the current status."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  95,
                  100,
                  97,
                  116,
                  97
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
            "The mint account associated with the DPIT token.",
            "This is only used for reference."
          ],
          "pda": {
            "seeds": [
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
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "metadata"
        },
        {
          "name": "payer",
          "docs": [
            "The signer who must be an authorized creator to update the status."
          ],
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "fund::structs::update_status::Params"
            }
          }
        }
      ]
    },
    {
      "name": "upgradeAccount",
      "docs": [
        "Upgrade account"
      ],
      "discriminator": [
        210,
        14,
        70,
        243,
        180,
        118,
        117,
        55
      ],
      "accounts": [
        {
          "name": "account",
          "writable": true
        },
        {
          "name": "payer",
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
          "name": "newSize",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "blacklist",
      "discriminator": [
        131,
        9,
        212,
        250,
        58,
        186,
        247,
        3
      ]
    },
    {
      "name": "commitments",
      "discriminator": [
        132,
        41,
        8,
        207,
        138,
        210,
        161,
        224
      ]
    },
    {
      "name": "creatorInfo",
      "discriminator": [
        86,
        132,
        42,
        176,
        155,
        145,
        82,
        178
      ]
    },
    {
      "name": "creators",
      "discriminator": [
        61,
        145,
        233,
        241,
        1,
        118,
        144,
        236
      ]
    },
    {
      "name": "daoList",
      "discriminator": [
        178,
        103,
        129,
        76,
        166,
        69,
        64,
        91
      ]
    },
    {
      "name": "feeAccount",
      "discriminator": [
        137,
        191,
        201,
        34,
        168,
        222,
        43,
        138
      ]
    },
    {
      "name": "fundDataStore",
      "discriminator": [
        225,
        239,
        252,
        237,
        113,
        94,
        207,
        10
      ]
    },
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
      "name": "proposalsList",
      "discriminator": [
        142,
        57,
        116,
        206,
        66,
        235,
        22,
        20
      ]
    },
    {
      "name": "users",
      "discriminator": [
        195,
        63,
        67,
        167,
        72,
        120,
        211,
        145
      ]
    }
  ],
  "events": [
    {
      "name": "accountReset",
      "discriminator": [
        124,
        143,
        144,
        228,
        12,
        116,
        90,
        28
      ]
    },
    {
      "name": "burn",
      "discriminator": [
        184,
        13,
        65,
        206,
        206,
        170,
        51,
        85
      ]
    },
    {
      "name": "claim",
      "discriminator": [
        133,
        98,
        9,
        238,
        133,
        207,
        191,
        113
      ]
    },
    {
      "name": "commitment",
      "discriminator": [
        197,
        196,
        50,
        147,
        66,
        252,
        92,
        14
      ]
    },
    {
      "name": "create",
      "discriminator": [
        11,
        141,
        113,
        194,
        133,
        34,
        56,
        192
      ]
    },
    {
      "name": "creatorAdded",
      "discriminator": [
        95,
        214,
        107,
        88,
        9,
        31,
        98,
        66
      ]
    },
    {
      "name": "creatorBlacklisted",
      "discriminator": [
        145,
        239,
        122,
        60,
        48,
        93,
        73,
        230
      ]
    },
    {
      "name": "creatorUnblocked",
      "discriminator": [
        190,
        94,
        31,
        170,
        65,
        145,
        23,
        129
      ]
    },
    {
      "name": "daoBlacklisted",
      "discriminator": [
        125,
        30,
        93,
        177,
        104,
        155,
        73,
        85
      ]
    },
    {
      "name": "daoEnded",
      "discriminator": [
        31,
        223,
        138,
        85,
        178,
        93,
        213,
        77
      ]
    },
    {
      "name": "daoStarted",
      "discriminator": [
        169,
        94,
        70,
        177,
        216,
        122,
        58,
        54
      ]
    },
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
      "name": "init",
      "discriminator": [
        3,
        223,
        113,
        110,
        13,
        103,
        100,
        11
      ]
    },
    {
      "name": "initCommitment",
      "discriminator": [
        139,
        107,
        129,
        100,
        7,
        173,
        49,
        189
      ]
    },
    {
      "name": "initCreators",
      "discriminator": [
        85,
        125,
        208,
        102,
        164,
        198,
        218,
        255
      ]
    },
    {
      "name": "manageUsers",
      "discriminator": [
        128,
        183,
        153,
        162,
        45,
        142,
        145,
        82
      ]
    },
    {
      "name": "mint",
      "discriminator": [
        63,
        11,
        213,
        134,
        148,
        194,
        24,
        203
      ]
    },
    {
      "name": "moveToLp",
      "discriminator": [
        249,
        119,
        133,
        191,
        126,
        60,
        206,
        25
      ]
    },
    {
      "name": "multisigInitiated",
      "discriminator": [
        138,
        23,
        86,
        185,
        235,
        2,
        211,
        71
      ]
    },
    {
      "name": "partyRoundStarted",
      "discriminator": [
        208,
        195,
        96,
        255,
        19,
        197,
        200,
        185
      ]
    },
    {
      "name": "transfer",
      "discriminator": [
        25,
        18,
        23,
        7,
        172,
        116,
        130,
        28
      ]
    },
    {
      "name": "transferredSolToCreator",
      "discriminator": [
        73,
        246,
        242,
        37,
        22,
        97,
        210,
        67
      ]
    },
    {
      "name": "transferredSolToDeployer",
      "discriminator": [
        229,
        204,
        200,
        45,
        176,
        212,
        243,
        131
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
      "name": "updateFees",
      "discriminator": [
        2,
        138,
        167,
        71,
        162,
        154,
        107,
        73
      ]
    },
    {
      "name": "updateStatus",
      "discriminator": [
        213,
        239,
        30,
        246,
        100,
        28,
        156,
        231
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
    },
    {
      "name": "userBlacklisted",
      "discriminator": [
        206,
        113,
        42,
        126,
        51,
        137,
        138,
        187
      ]
    },
    {
      "name": "userUnblocked",
      "discriminator": [
        205,
        140,
        210,
        131,
        161,
        149,
        159,
        237
      ]
    },
    {
      "name": "usersInitiated",
      "discriminator": [
        60,
        219,
        126,
        210,
        191,
        124,
        158,
        213
      ]
    },
    {
      "name": "withdrawalToContract",
      "discriminator": [
        223,
        174,
        85,
        164,
        229,
        26,
        51,
        1
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
      "name": "minimumAmountNotMet",
      "msg": "Error: Amount must be greater than or equals to 0.1 sols!"
    },
    {
      "code": 6002,
      "name": "commitAmountExceeded",
      "msg": "Error: Commit amount can't be exceeded by max allowable commit amount!"
    },
    {
      "code": 6003,
      "name": "alreadyClaimed",
      "msg": "Error: All tokens are claimed already!"
    },
    {
      "code": 6004,
      "name": "alreadyApproved",
      "msg": "Error: Proposal is already approved by same approver!"
    },
    {
      "code": 6005,
      "name": "duplicateUser",
      "msg": "Error: User is already added!"
    },
    {
      "code": 6006,
      "name": "blockedAccount",
      "msg": "Error: Address is blacklisted!"
    },
    {
      "code": 6007,
      "name": "inEligible",
      "msg": "Error: User ineligible to commit!"
    },
    {
      "code": 6008,
      "name": "unauthorized",
      "msg": "Error: Unauthorized User!"
    },
    {
      "code": 6009,
      "name": "unknownFeeAccount",
      "msg": "Error: Unknown Fee Account!"
    },
    {
      "code": 6010,
      "name": "unknownReceiver",
      "msg": "Error: Unknown Receiver!"
    },
    {
      "code": 6011,
      "name": "notFound",
      "msg": "Error: Not Found!"
    },
    {
      "code": 6012,
      "name": "addressNotFound",
      "msg": "Error: Address Not Found!"
    },
    {
      "code": 6013,
      "name": "permissionDenied",
      "msg": "Error: Permission Denied!"
    },
    {
      "code": 6014,
      "name": "timestampError",
      "msg": "Error: while getting current timestamp!"
    },
    {
      "code": 6015,
      "name": "exceedsWithdrawLimit",
      "msg": "Error: Excceding the withdraw limit!"
    },
    {
      "code": 6016,
      "name": "fundraiseFailed",
      "msg": "Error: Fundraise is not successfull!"
    },
    {
      "code": 6017,
      "name": "daoNotInTrading",
      "msg": "Error: Dao status is not Trading!"
    },
    {
      "code": 6018,
      "name": "amountCannotBeZero",
      "msg": "Error: Amount Cannot be Zero!"
    },
    {
      "code": 6019,
      "name": "parseError",
      "msg": "Error: Couldn't parse to Pubkey!"
    },
    {
      "code": 6020,
      "name": "alreadyExecuted",
      "msg": "Proposal has already been executed."
    },
    {
      "code": 6021,
      "name": "notApproved",
      "msg": "Proposal has not been approved yet."
    },
    {
      "code": 6022,
      "name": "inValidDaoStatus",
      "msg": "InValidDaoStatus."
    },
    {
      "code": 6023,
      "name": "invalidProposalType",
      "msg": "Invalid Proposal."
    },
    {
      "code": 6024,
      "name": "accountMisMatch",
      "msg": "AccountMisMatch."
    },
    {
      "code": 6025,
      "name": "duplicateProposal",
      "msg": "Same Proposal."
    },
    {
      "code": 6026,
      "name": "presentInDeployerList",
      "msg": "Address present in deployer list."
    },
    {
      "code": 6027,
      "name": "presentInCreatorList",
      "msg": "Address present in creator list."
    },
    {
      "code": 6028,
      "name": "presentInAdminList",
      "msg": "Address present in admin list."
    }
  ],
  "types": [
    {
      "name": "accountReset",
      "docs": [
        "Event emitted when account is closed"
      ],
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "approverType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "admin"
          },
          {
            "name": "deployer"
          }
        ]
      }
    },
    {
      "name": "blacklist",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "users",
            "docs": [
              "List of blacklist users."
            ],
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "burn",
      "docs": [
        "Event emitted when tokens are burned"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "The token identifier"
            ],
            "type": "string"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens burned"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "claim",
      "docs": [
        "Event emitted when tokens or SOL are claimed"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "The token identifier"
            ],
            "type": "string"
          },
          {
            "name": "amount",
            "docs": [
              "Amount claimed"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "commitment",
      "docs": [
        "Event emitted when a commitment is made"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "The token identifier"
            ],
            "type": "string"
          },
          {
            "name": "solAmount",
            "docs": [
              "Amount of SOL committed"
            ],
            "type": "u64"
          },
          {
            "name": "tokenAmount",
            "docs": [
              "Amount of tokens to receive"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "commitmentDetails",
      "docs": [
        "Struct to store details of an individual commitment."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "docs": [
              "Address of the committer."
            ],
            "type": "pubkey"
          },
          {
            "name": "solAmount",
            "docs": [
              "Amount of SOL committed."
            ],
            "type": "u64"
          },
          {
            "name": "tokenAmount",
            "docs": [
              "Amount of tokens received in exchange for SOL."
            ],
            "type": "u64"
          },
          {
            "name": "lastClaimedAt",
            "docs": [
              "Timestamp of the last claimed amount (if any)."
            ],
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "amountClaimed",
            "docs": [
              "Total amount of tokens claimed by the committer."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "commitments",
      "docs": [
        "Account struct to manage commitments made by users."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "commiters",
            "docs": [
              "List of individual commitment details."
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "commitmentDetails"
                }
              }
            }
          },
          {
            "name": "totalCommitedSols",
            "docs": [
              "Total amount of SOL committed."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "create",
      "docs": [
        "Event emitted when a new token is created"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "docs": [
              "Name of the created token"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "creator",
      "docs": [
        "Struct representing an individual creator."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "docs": [
              "The public key of the creator."
            ],
            "type": "pubkey"
          },
          {
            "name": "isBlocked",
            "docs": [
              "Boolean flag indicating whether the creator has been blocked."
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "creatorAdded",
      "docs": [
        "Event emitted when creators list is modified"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentCreatorsCount",
            "docs": [
              "Updated count of creators"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "creatorBlacklisted",
      "docs": [
        "Event emitted when creator is blocked"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "docs": [
              "Creator Address"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "creatorData",
      "docs": [
        "Struct that defines the vesting schedule percentages."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "claimedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "creatorInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token name"
            ],
            "type": "string"
          },
          {
            "name": "feePercent",
            "docs": [
              "Fee Percent"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "creatorShare",
      "docs": [
        "Struct that defines the vesting schedule percentages."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "pubkey"
          },
          {
            "name": "totalWithdrawable",
            "type": "u64"
          },
          {
            "name": "creators",
            "type": {
              "vec": {
                "defined": {
                  "name": "creatorData"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "creatorUnblocked",
      "docs": [
        "Event emitted when creator is unblocked"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "docs": [
              "Creator Address"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "creators",
      "docs": [
        "Struct that manages a list of creators."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creators",
            "docs": [
              "List of registered creators."
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "creator"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "daoBlacklisted",
      "docs": [
        "Event emitted when dao is blocked"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token name"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "daoEnded",
      "docs": [
        "Event emitted when dao is ended"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token name"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "daoList",
      "docs": [
        "Account struct to maintain a list of tokens."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokens",
            "docs": [
              "The total  tokens currently tracked."
            ],
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    },
    {
      "name": "daoStarted",
      "docs": [
        "Event emitted when dao is started"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Name of the created token"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "deployerData",
      "docs": [
        "Struct that defines the vesting schedule percentages."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "claimedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "deployerShare",
      "docs": [
        "Struct that defines the vesting schedule percentages."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "deployers",
            "type": {
              "vec": {
                "defined": {
                  "name": "deployerData"
                }
              }
            }
          },
          {
            "name": "totalWithdrawable",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "executorType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "admin"
          },
          {
            "name": "owner"
          },
          {
            "name": "creator"
          }
        ]
      }
    },
    {
      "name": "feeAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feesCollectionAccount",
            "docs": [
              "Fee collection account"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "feeAccountUpdated",
      "docs": [
        "Event emitted when fee collection account is updated"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "from",
            "docs": [
              "Previous fee collection account"
            ],
            "type": "pubkey"
          },
          {
            "name": "to",
            "docs": [
              "New fee collection account"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "feeUpdated",
      "docs": [
        "Event emitted when token fees are updated"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token mint address"
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
      "name": "fundDataStore",
      "docs": [
        "Struct that stores fundraising-related data."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "createdAt",
            "docs": [
              "Timestamp indicating when the fundraising campaign was created."
            ],
            "type": "i64"
          },
          {
            "name": "createdBy",
            "docs": [
              "created_by."
            ],
            "type": "pubkey"
          },
          {
            "name": "startDate",
            "docs": [
              "The end date of the fundraising campaign (Unix timestamp)."
            ],
            "type": "i64"
          },
          {
            "name": "endDate",
            "docs": [
              "The end date of the fundraising campaign (Unix timestamp)."
            ],
            "type": "i64"
          },
          {
            "name": "fundraisingGoal",
            "docs": [
              "The fundraising goal, represented in SOL."
            ],
            "type": "u64"
          },
          {
            "name": "status",
            "docs": [
              "The current status of the fundraising campaign."
            ],
            "type": {
              "defined": {
                "name": "status"
              }
            }
          },
          {
            "name": "tokensPerSol",
            "docs": [
              "Number of tokens allocated per SOL contributed."
            ],
            "type": "u64"
          },
          {
            "name": "feePercent",
            "docs": [
              "Fee percentage deducted from contributions."
            ],
            "type": "u32"
          },
          {
            "name": "vestingPercent",
            "docs": [
              "Vesting percentage configuration."
            ],
            "type": {
              "defined": {
                "name": "vestingPercent"
              }
            }
          },
          {
            "name": "creators",
            "type": {
              "defined": {
                "name": "creatorShare"
              }
            }
          },
          {
            "name": "deployers",
            "type": {
              "defined": {
                "name": "deployerShare"
              }
            }
          }
        ]
      }
    },
    {
      "name": "globalConfig",
      "docs": [
        "Struct that represents the global configuration of the system."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "deployers",
            "docs": [
              "List of sub-admins who have limited administrative privileges."
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "subAdmins",
            "docs": [
              "List of sub-admins who have limited administrative privileges."
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "admins",
            "docs": [
              "List of admins who have administrative privileges."
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "owner",
            "docs": [
              "The owner."
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "init",
      "docs": [
        "Event emitted when the program is initialized",
        "Contains the initial admin and sub-admin addresses"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "The primary administrator's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "subAdmin",
            "docs": [
              "The initial sub-administrator's public key"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "initCommitment",
      "docs": [
        "Event emitted when a new commitment is initialized for a token"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "The token identifier for which commitment is initialized"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "initCreators",
      "docs": [
        "Event emitted when creator accounts are initialized"
      ],
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "manageUsers",
      "docs": [
        "Event emitted when user lists are modified"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "The token identifier"
            ],
            "type": "string"
          },
          {
            "name": "userType",
            "docs": [
              "Type of user (VIP/Party)"
            ],
            "type": {
              "defined": {
                "name": "userType"
              }
            }
          },
          {
            "name": "manageType",
            "docs": [
              "Type of update (Add/Remove)"
            ],
            "type": {
              "defined": {
                "name": "updateType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "mint",
      "docs": [
        "Event emitted when tokens are minted"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "The token identifier"
            ],
            "type": "string"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens minted"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "moveToLp",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "The token identifier"
            ],
            "type": "string"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "solAmount",
            "docs": [
              "Amount transferred"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "multisigInitiated",
      "docs": [
        "Event emitted when multisig is initiated"
      ],
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "partyRoundStarted",
      "docs": [
        "Event emitted when party round is started"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token name"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "proposalData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "createdBy",
            "type": "pubkey"
          },
          {
            "name": "proposalType",
            "type": {
              "defined": {
                "name": "proposalType"
              }
            }
          },
          {
            "name": "address",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "approverThreshold",
            "type": "u8"
          },
          {
            "name": "daoName",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "transferAmount",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "approveType",
            "type": {
              "defined": {
                "name": "approverType"
              }
            }
          },
          {
            "name": "executorType",
            "type": {
              "defined": {
                "name": "executorType"
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "proposalStatus"
              }
            }
          },
          {
            "name": "executedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "approvers",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "proposalStatus",
      "docs": [
        "Proposal Status"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "rejected",
            "fields": [
              {
                "name": "timestamp",
                "type": "i64"
              }
            ]
          },
          {
            "name": "approved",
            "fields": [
              {
                "name": "timestamp",
                "type": "i64"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "proposalType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "updateOwner"
          },
          {
            "name": "addAdmin"
          },
          {
            "name": "removeAdmin"
          },
          {
            "name": "addDeployer"
          },
          {
            "name": "removeDeployer"
          },
          {
            "name": "transferSolToDeployer"
          },
          {
            "name": "transferSolToCreator"
          },
          {
            "name": "publishToAmm"
          },
          {
            "name": "removeLiquidity"
          },
          {
            "name": "blockListDao"
          },
          {
            "name": "blockListCreator"
          },
          {
            "name": "unblockCreator"
          },
          {
            "name": "blocklistUser"
          },
          {
            "name": "unblockUser"
          }
        ]
      }
    },
    {
      "name": "proposalsList",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proposals",
            "type": {
              "vec": {
                "defined": {
                  "name": "proposalData"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "status",
      "docs": [
        "Enum representing the different statuses a fundraising or trading project can have."
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "created"
          },
          {
            "name": "fundraisingVip"
          },
          {
            "name": "fundraisingParty"
          },
          {
            "name": "fundraisingSuccess"
          },
          {
            "name": "fundraisingFail"
          },
          {
            "name": "trade"
          },
          {
            "name": "expired"
          },
          {
            "name": "closed"
          }
        ]
      }
    },
    {
      "name": "transfer",
      "docs": [
        "Event emitted when tokens are transferred"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "The token identifier"
            ],
            "type": "string"
          },
          {
            "name": "to",
            "docs": [
              "Recipient's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount transferred"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "transferredSolToCreator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "docs": [
              "The token identifier"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "transferredSolToDeployer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "deployer",
            "docs": [
              "The token identifier"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateAdmin",
      "docs": [
        "Event emitted when admin is updated"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "from",
            "docs": [
              "Previous admin's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "to",
            "docs": [
              "New admin's public key"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "updateFees",
      "docs": [
        "Event emitted when fee structure is updated"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "from",
            "docs": [
              "Previous fee amount"
            ],
            "type": "u32"
          },
          {
            "name": "to",
            "docs": [
              "New fee amount"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "updateStatus",
      "docs": [
        "Event emitted when token status changes"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "The token identifier"
            ],
            "type": "string"
          },
          {
            "name": "status",
            "docs": [
              "New status value"
            ],
            "type": {
              "defined": {
                "name": "status"
              }
            }
          }
        ]
      }
    },
    {
      "name": "updateSubAdmins",
      "docs": [
        "Event emitted when sub-admin list is modified"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "updateType",
            "docs": [
              "Type of update (Add/Remove)"
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
              "List of affected sub-admin addresses"
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
          },
          {
            "name": "block"
          }
        ]
      }
    },
    {
      "name": "userBlacklisted",
      "docs": [
        "Event emitted when user is blocked"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "User Address"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "userDetails",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "docs": [
              "List of VIP users (addresses with special privileges)."
            ],
            "type": "pubkey"
          },
          {
            "name": "maxAllowableAmount",
            "docs": [
              "Maximum allowable contribution amount for users."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userType",
      "docs": [
        "Enum representing different types of users in the system."
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "vip"
          },
          {
            "name": "party"
          }
        ]
      }
    },
    {
      "name": "userUnblocked",
      "docs": [
        "Event emitted when user is unblocked"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "User Address"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "users",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vip",
            "docs": [
              "List of VIP users (addresses with special privileges)."
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "userDetails"
                }
              }
            }
          },
          {
            "name": "party",
            "docs": [
              "List of party users (regular users participating in fundraising)."
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "userDetails"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "usersInitiated",
      "docs": [
        "Event emitted when user groups are initialized for a token"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "The token identifier"
            ],
            "type": "string"
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
    },
    {
      "name": "withdrawalToContract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "The token identifier"
            ],
            "type": "string"
          },
          {
            "name": "tokenAmount",
            "docs": [
              "Token Amount"
            ],
            "type": "u64"
          },
          {
            "name": "solAmount",
            "docs": [
              "Amount transferred"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "fund::structs::add_creator::Params",
      "docs": [
        "The struct containing instructions for manage creators params"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "docs": [
              "Creator Address"
            ],
            "type": "pubkey"
          },
          {
            "name": "feePercent",
            "docs": [
              "Fee Percent"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "fund::structs::burn::Params",
      "docs": [
        "The struct containing instructions for claim params"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "amount",
            "docs": [
              "Amount"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "fund::structs::create::Params",
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
          },
          {
            "name": "amount",
            "docs": [
              "Token Amount"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "fund::structs::manage_users::Params",
      "docs": [
        "The struct containing instructions for manage users params"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "userType",
            "docs": [
              "User Type"
            ],
            "type": {
              "defined": {
                "name": "userType"
              }
            }
          },
          {
            "name": "manageType",
            "docs": [
              "Manage Type"
            ],
            "type": {
              "defined": {
                "name": "updateType"
              }
            }
          },
          {
            "name": "users",
            "docs": [
              "users"
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "userDetails"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "fund::structs::mint::Params",
      "docs": [
        "The struct containing instructions for claim params"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "amount",
            "docs": [
              "Amount"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "fund::structs::transfer::Params",
      "docs": [
        "The struct containing instructions for transfer params"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "proposalId",
            "docs": [
              "Proposal Id"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "fund::structs::update_fee::Params",
      "docs": [
        "The struct containing instructions for update fee params"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "docs": [
              "Creator Address"
            ],
            "type": "pubkey"
          },
          {
            "name": "token",
            "docs": [
              "Creator Address"
            ],
            "type": "string"
          },
          {
            "name": "feePercent",
            "docs": [
              "Fee Percent"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "fund::structs::update_status::Params",
      "docs": [
        "The struct containing instructions for update status params"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "status",
            "docs": [
              "status"
            ],
            "type": {
              "defined": {
                "name": "status"
              }
            }
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "blacklistTag",
      "docs": [
        "Tag for block user"
      ],
      "type": "bytes",
      "value": "[98, 108, 97, 99, 107, 108, 105, 115, 116]"
    },
    {
      "name": "commitmentTag",
      "docs": [
        "Tag for commitment tracking accounts"
      ],
      "type": "bytes",
      "value": "[99, 111, 109, 109, 105, 116, 109, 101, 110, 116]"
    },
    {
      "name": "creatorTag",
      "docs": [
        "Tag for creator accounts and their permissions"
      ],
      "type": "bytes",
      "value": "[99, 114, 101, 97, 116, 111, 114, 115]"
    },
    {
      "name": "daoTag",
      "docs": [
        "Tag for counter accounts used in various operations"
      ],
      "type": "bytes",
      "value": "[100, 97, 111, 95, 108, 105, 115, 116]"
    },
    {
      "name": "escrowTag",
      "docs": [
        "Tag for escrow accounts that hold funds temporarily"
      ],
      "type": "bytes",
      "value": "[101, 115, 99, 114, 111, 119]"
    },
    {
      "name": "feeTag",
      "docs": [
        "Tag for fee-related accounts and operations"
      ],
      "type": "bytes",
      "value": "[102, 101, 101]"
    },
    {
      "name": "fundDataTag",
      "docs": [
        "Tag for fund-specific data accounts"
      ],
      "type": "bytes",
      "value": "[102, 117, 110, 100, 95, 100, 97, 116, 97]"
    },
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
        "Tag for mint accounts that create and manage tokens"
      ],
      "type": "bytes",
      "value": "[109, 105, 110, 116]"
    },
    {
      "name": "proposalTag",
      "docs": [
        "Tag for proposal data accounts"
      ],
      "type": "bytes",
      "value": "[112, 114, 111, 112, 111, 115, 97, 108]"
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
      "name": "userTag",
      "docs": [
        "Tag for user accounts and related data"
      ],
      "type": "bytes",
      "value": "[117, 115, 101, 114, 115]"
    }
  ]
};
