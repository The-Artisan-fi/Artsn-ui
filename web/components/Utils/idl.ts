import { Address } from "@coral-xyz/anchor";


export type ArtsnCore = {
  "address": "4zRpccBb5ozQ7u8CLKkNQp7NGySUZpc9Bp16Tn4udTos",
  "metadata": {
    "name": "artsn_core",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buy_fractionalized_listing",
      "discriminator": [
        101,
        217,
        165,
        147,
        244,
        220,
        82,
        9
      ],
      "accounts": [
        {
          "name": "buyer",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "buyer_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "listing_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "listing"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "buyer_profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "listing.id",
                "account": "FractionalizedListing"
              }
            ]
          }
        },
        {
          "name": "object",
          "writable": true
        },
        {
          "name": "fraction",
          "writable": true,
          "signer": true
        },
        {
          "name": "instructions",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "mpl_core_program",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "buy_marketplace_listing",
      "discriminator": [
        67,
        203,
        113,
        132,
        38,
        72,
        175,
        157
      ],
      "accounts": [
        {
          "name": "buyer",
          "signer": true
        },
        {
          "name": "owner"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "address": "5yRcNyhKR7BpAx8DUrqfuhjcpMEVKxdQT1KAS8o72ZAW"
        },
        {
          "name": "buyer_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "owner_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "manager_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "manager"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "fraction"
              }
            ]
          }
        },
        {
          "name": "object",
          "writable": true
        },
        {
          "name": "fraction",
          "writable": true
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "mpl_core_program",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        }
      ],
      "args": []
    },
    {
      "name": "create_fractionalized_listing",
      "discriminator": [
        201,
        186,
        63,
        41,
        251,
        68,
        179,
        139
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin_profile",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "object"
        },
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "CreateFractionalizedListingArgs"
            }
          }
        }
      ]
    },
    {
      "name": "create_marketplace_listing",
      "discriminator": [
        107,
        166,
        106,
        238,
        18,
        166,
        166,
        203
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "fraction"
              }
            ]
          }
        },
        {
          "name": "object",
          "writable": true
        },
        {
          "name": "fraction",
          "writable": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "mpl_core_program",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "create_watch",
      "discriminator": [
        43,
        228,
        230,
        104,
        104,
        205,
        118,
        208
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin_profile",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "protocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "watch",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  116,
                  99,
                  104
                ]
              },
              {
                "kind": "arg",
                "path": "args.reference"
              }
            ]
          }
        },
        {
          "name": "mpl_core_program",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "CreateWatchArgs"
            }
          }
        }
      ]
    },
    {
      "name": "delete_marketplace_listing",
      "discriminator": [
        171,
        252,
        245,
        43,
        141,
        133,
        242,
        38
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "fraction"
              }
            ]
          }
        },
        {
          "name": "object",
          "writable": true
        },
        {
          "name": "fraction",
          "writable": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "mpl_core_program",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        }
      ],
      "args": []
    },
    {
      "name": "initialize_admin",
      "discriminator": [
        35,
        176,
        8,
        143,
        42,
        160,
        61,
        158
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "new_admin"
        },
        {
          "name": "admin_profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "new_admin"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "initialize_profile",
      "discriminator": [
        32,
        145,
        77,
        213,
        58,
        39,
        251,
        234
      ],
      "accounts": [
        {
          "name": "user"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "initialize_protocol",
      "discriminator": [
        188,
        233,
        252,
        106,
        134,
        146,
        202,
        91
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "manager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "update_protocol",
      "discriminator": [
        206,
        25,
        218,
        114,
        109,
        41,
        74,
        173
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "upgrade_membership",
      "discriminator": [
        221,
        207,
        31,
        43,
        229,
        158,
        89,
        247
      ],
      "accounts": [
        {
          "name": "user",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "user_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "membership_wallet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "protocol"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "protocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "verify_profile",
      "discriminator": [
        101,
        137,
        36,
        242,
        139,
        119,
        156,
        251
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "AdminProfile",
      "discriminator": [
        193,
        215,
        185,
        255,
        212,
        215,
        3,
        27
      ]
    },
    {
      "name": "BaseAssetV1",
      "discriminator": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "name": "BaseCollectionV1",
      "discriminator": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "name": "FractionalizedListing",
      "discriminator": [
        37,
        195,
        55,
        240,
        140,
        26,
        95,
        19
      ]
    },
    {
      "name": "Manager",
      "discriminator": [
        221,
        78,
        171,
        233,
        213,
        142,
        113,
        56
      ]
    },
    {
      "name": "MarketplaceListing",
      "discriminator": [
        211,
        106,
        229,
        109,
        73,
        75,
        97,
        122
      ]
    },
    {
      "name": "Profile",
      "discriminator": [
        184,
        101,
        165,
        188,
        95,
        63,
        127,
        188
      ]
    },
    {
      "name": "Protocol",
      "discriminator": [
        45,
        39,
        101,
        43,
        115,
        72,
        131,
        40
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotVerified",
      "msg": "You already bought more than 500$ worth of fraction, to buy more you need to do KYC"
    },
    {
      "code": 6001,
      "name": "NotTimeYet",
      "msg": "Listing is not Live yet, come back later!"
    },
    {
      "code": 6002,
      "name": "Overflow",
      "msg": "Overflow"
    },
    {
      "code": 6003,
      "name": "Underflow",
      "msg": "Underflow"
    },
    {
      "code": 6004,
      "name": "PriceMismatch",
      "msg": "The amount offered does not match the initial token price"
    },
    {
      "code": 6005,
      "name": "SignatureAuthorityMismatch",
      "msg": "Signature authority mismatch"
    }
  ],
  "types": [
    {
      "name": "AdminProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "creation_time",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "BaseAssetV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": {
              "defined": {
                "name": "Key"
              }
            }
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "update_authority",
            "type": {
              "defined": {
                "name": "UpdateAuthority"
              }
            }
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "seq",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "BaseCollectionV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": {
              "defined": {
                "name": "Key"
              }
            }
          },
          {
            "name": "update_authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "num_minted",
            "type": "u32"
          },
          {
            "name": "current_size",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "CreateFractionalizedListingArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "object_type",
            "type": "u8"
          },
          {
            "name": "share",
            "type": "u16"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "starting_time",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "CreateWatchArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "brand",
            "type": "string"
          },
          {
            "name": "model",
            "type": "string"
          },
          {
            "name": "reference",
            "type": "string"
          },
          {
            "name": "diameter",
            "type": "u8"
          },
          {
            "name": "movement",
            "type": "string"
          },
          {
            "name": "dial_color",
            "type": "string"
          },
          {
            "name": "case_material",
            "type": "string"
          },
          {
            "name": "bracelet_material",
            "type": "string"
          },
          {
            "name": "year_of_production",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "ExternalValidationResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Approved"
          },
          {
            "name": "Rejected"
          },
          {
            "name": "Pass"
          }
        ]
      }
    },
    {
      "name": "FractionalizedListing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "object_type",
            "type": {
              "defined": {
                "name": "ObjectType"
              }
            }
          },
          {
            "name": "object",
            "type": "pubkey"
          },
          {
            "name": "share",
            "type": "u16"
          },
          {
            "name": "share_sold",
            "type": "u16"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "starting_time",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Key",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "AssetV1"
          },
          {
            "name": "HashedAssetV1"
          },
          {
            "name": "PluginHeaderV1"
          },
          {
            "name": "PluginRegistryV1"
          },
          {
            "name": "CollectionV1"
          }
        ]
      }
    },
    {
      "name": "Manager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "MarketplaceListing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "asset",
            "type": "pubkey"
          },
          {
            "name": "collection",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Membership",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Platinum"
          },
          {
            "name": "Gold"
          },
          {
            "name": "Basic"
          }
        ]
      }
    },
    {
      "name": "ObjectType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Watch"
          },
          {
            "name": "Diamonds"
          }
        ]
      }
    },
    {
      "name": "OracleValidation",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "V1",
            "fields": [
              {
                "name": "create",
                "type": {
                  "defined": {
                    "name": "ExternalValidationResult"
                  }
                }
              },
              {
                "name": "transfer",
                "type": {
                  "defined": {
                    "name": "ExternalValidationResult"
                  }
                }
              },
              {
                "name": "burn",
                "type": {
                  "defined": {
                    "name": "ExternalValidationResult"
                  }
                }
              },
              {
                "name": "update",
                "type": {
                  "defined": {
                    "name": "ExternalValidationResult"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "name": "Profile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "spending",
            "type": "u64"
          },
          {
            "name": "membership",
            "type": {
              "defined": {
                "name": "Membership"
              }
            }
          },
          {
            "name": "is_verified",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Protocol",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validation",
            "type": {
              "defined": {
                "name": "OracleValidation"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "UpdateAuthority",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Address",
            "fields": [
              "pubkey"
            ]
          },
          {
            "name": "Collection",
            "fields": [
              "pubkey"
            ]
          }
        ]
      }
    }
  ]
}

  
export const IDL: ArtsnCore = {
  "address": "4zRpccBb5ozQ7u8CLKkNQp7NGySUZpc9Bp16Tn4udTos",
  "metadata": {
    "name": "artsn_core",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buy_fractionalized_listing",
      "discriminator": [
        101,
        217,
        165,
        147,
        244,
        220,
        82,
        9
      ],
      "accounts": [
        {
          "name": "buyer",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "buyer_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "listing_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "listing"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "buyer_profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "listing.id",
                "account": "FractionalizedListing"
              }
            ]
          }
        },
        {
          "name": "object",
          "writable": true
        },
        {
          "name": "fraction",
          "writable": true,
          "signer": true
        },
        {
          "name": "instructions",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "mpl_core_program",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "buy_marketplace_listing",
      "discriminator": [
        67,
        203,
        113,
        132,
        38,
        72,
        175,
        157
      ],
      "accounts": [
        {
          "name": "buyer",
          "signer": true
        },
        {
          "name": "owner"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "address": "5yRcNyhKR7BpAx8DUrqfuhjcpMEVKxdQT1KAS8o72ZAW"
        },
        {
          "name": "buyer_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "owner_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "manager_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "manager"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "fraction"
              }
            ]
          }
        },
        {
          "name": "object",
          "writable": true
        },
        {
          "name": "fraction",
          "writable": true
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "mpl_core_program",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        }
      ],
      "args": []
    },
    {
      "name": "create_fractionalized_listing",
      "discriminator": [
        201,
        186,
        63,
        41,
        251,
        68,
        179,
        139
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin_profile",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "object"
        },
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "CreateFractionalizedListingArgs"
            }
          }
        }
      ]
    },
    {
      "name": "create_marketplace_listing",
      "discriminator": [
        107,
        166,
        106,
        238,
        18,
        166,
        166,
        203
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "fraction"
              }
            ]
          }
        },
        {
          "name": "object",
          "writable": true
        },
        {
          "name": "fraction",
          "writable": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "mpl_core_program",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "create_watch",
      "discriminator": [
        43,
        228,
        230,
        104,
        104,
        205,
        118,
        208
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin_profile",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "protocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "watch",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  116,
                  99,
                  104
                ]
              },
              {
                "kind": "arg",
                "path": "args.reference"
              }
            ]
          }
        },
        {
          "name": "mpl_core_program",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "CreateWatchArgs"
            }
          }
        }
      ]
    },
    {
      "name": "delete_marketplace_listing",
      "discriminator": [
        171,
        252,
        245,
        43,
        141,
        133,
        242,
        38
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "manager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "fraction"
              }
            ]
          }
        },
        {
          "name": "object",
          "writable": true
        },
        {
          "name": "fraction",
          "writable": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "mpl_core_program",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        }
      ],
      "args": []
    },
    {
      "name": "initialize_admin",
      "discriminator": [
        35,
        176,
        8,
        143,
        42,
        160,
        61,
        158
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "new_admin"
        },
        {
          "name": "admin_profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "new_admin"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "initialize_profile",
      "discriminator": [
        32,
        145,
        77,
        213,
        58,
        39,
        251,
        234
      ],
      "accounts": [
        {
          "name": "user"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "initialize_protocol",
      "discriminator": [
        188,
        233,
        252,
        106,
        134,
        146,
        202,
        91
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "manager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "update_protocol",
      "discriminator": [
        206,
        25,
        218,
        114,
        109,
        41,
        74,
        173
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "upgrade_membership",
      "discriminator": [
        221,
        207,
        31,
        43,
        229,
        158,
        89,
        247
      ],
      "accounts": [
        {
          "name": "user",
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "user_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "membership_wallet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "protocol"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
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
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "protocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "verify_profile",
      "discriminator": [
        101,
        137,
        36,
        242,
        139,
        119,
        156,
        251
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "AdminProfile",
      "discriminator": [
        193,
        215,
        185,
        255,
        212,
        215,
        3,
        27
      ]
    },
    {
      "name": "BaseAssetV1",
      "discriminator": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "name": "BaseCollectionV1",
      "discriminator": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "name": "FractionalizedListing",
      "discriminator": [
        37,
        195,
        55,
        240,
        140,
        26,
        95,
        19
      ]
    },
    {
      "name": "Manager",
      "discriminator": [
        221,
        78,
        171,
        233,
        213,
        142,
        113,
        56
      ]
    },
    {
      "name": "MarketplaceListing",
      "discriminator": [
        211,
        106,
        229,
        109,
        73,
        75,
        97,
        122
      ]
    },
    {
      "name": "Profile",
      "discriminator": [
        184,
        101,
        165,
        188,
        95,
        63,
        127,
        188
      ]
    },
    {
      "name": "Protocol",
      "discriminator": [
        45,
        39,
        101,
        43,
        115,
        72,
        131,
        40
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotVerified",
      "msg": "You already bought more than 500$ worth of fraction, to buy more you need to do KYC"
    },
    {
      "code": 6001,
      "name": "NotTimeYet",
      "msg": "Listing is not Live yet, come back later!"
    },
    {
      "code": 6002,
      "name": "Overflow",
      "msg": "Overflow"
    },
    {
      "code": 6003,
      "name": "Underflow",
      "msg": "Underflow"
    },
    {
      "code": 6004,
      "name": "PriceMismatch",
      "msg": "The amount offered does not match the initial token price"
    },
    {
      "code": 6005,
      "name": "SignatureAuthorityMismatch",
      "msg": "Signature authority mismatch"
    }
  ],
  "types": [
    {
      "name": "AdminProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "creation_time",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "BaseAssetV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": {
              "defined": {
                "name": "Key"
              }
            }
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "update_authority",
            "type": {
              "defined": {
                "name": "UpdateAuthority"
              }
            }
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "seq",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "BaseCollectionV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": {
              "defined": {
                "name": "Key"
              }
            }
          },
          {
            "name": "update_authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "num_minted",
            "type": "u32"
          },
          {
            "name": "current_size",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "CreateFractionalizedListingArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "object_type",
            "type": "u8"
          },
          {
            "name": "share",
            "type": "u16"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "starting_time",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "CreateWatchArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "brand",
            "type": "string"
          },
          {
            "name": "model",
            "type": "string"
          },
          {
            "name": "reference",
            "type": "string"
          },
          {
            "name": "diameter",
            "type": "u8"
          },
          {
            "name": "movement",
            "type": "string"
          },
          {
            "name": "dial_color",
            "type": "string"
          },
          {
            "name": "case_material",
            "type": "string"
          },
          {
            "name": "bracelet_material",
            "type": "string"
          },
          {
            "name": "year_of_production",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "ExternalValidationResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Approved"
          },
          {
            "name": "Rejected"
          },
          {
            "name": "Pass"
          }
        ]
      }
    },
    {
      "name": "FractionalizedListing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "object_type",
            "type": {
              "defined": {
                "name": "ObjectType"
              }
            }
          },
          {
            "name": "object",
            "type": "pubkey"
          },
          {
            "name": "share",
            "type": "u16"
          },
          {
            "name": "share_sold",
            "type": "u16"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "starting_time",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Key",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "AssetV1"
          },
          {
            "name": "HashedAssetV1"
          },
          {
            "name": "PluginHeaderV1"
          },
          {
            "name": "PluginRegistryV1"
          },
          {
            "name": "CollectionV1"
          }
        ]
      }
    },
    {
      "name": "Manager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "MarketplaceListing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "asset",
            "type": "pubkey"
          },
          {
            "name": "collection",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Membership",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Platinum"
          },
          {
            "name": "Gold"
          },
          {
            "name": "Basic"
          }
        ]
      }
    },
    {
      "name": "ObjectType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Watch"
          },
          {
            "name": "Diamonds"
          }
        ]
      }
    },
    {
      "name": "OracleValidation",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "V1",
            "fields": [
              {
                "name": "create",
                "type": {
                  "defined": {
                    "name": "ExternalValidationResult"
                  }
                }
              },
              {
                "name": "transfer",
                "type": {
                  "defined": {
                    "name": "ExternalValidationResult"
                  }
                }
              },
              {
                "name": "burn",
                "type": {
                  "defined": {
                    "name": "ExternalValidationResult"
                  }
                }
              },
              {
                "name": "update",
                "type": {
                  "defined": {
                    "name": "ExternalValidationResult"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "name": "Profile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "spending",
            "type": "u64"
          },
          {
            "name": "membership",
            "type": {
              "defined": {
                "name": "Membership"
              }
            }
          },
          {
            "name": "is_verified",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Protocol",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validation",
            "type": {
              "defined": {
                "name": "OracleValidation"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "UpdateAuthority",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Address",
            "fields": [
              "pubkey"
            ]
          },
          {
            "name": "Collection",
            "fields": [
              "pubkey"
            ]
          }
        ]
      }
    }
  ]
}



export const PROGRAM_ID = "4zRpccBb5ozQ7u8CLKkNQp7NGySUZpc9Bp16Tn4udTos" as Address

export const LISTING_GROUP = 'LSTBuqygb7CMQryt45BC1fh5PPjuJKtoffDyASchWi2' as string;

export const WATCH_GROUP = 'WaTL5TmFvfKeuFESWL1yp7tCg1feH55jxxhfcMHYR8g' as string;

export const USDC_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU' as string; // USDC - DEVNET https://faucet.circle.com/