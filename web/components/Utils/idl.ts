import { Address } from "@coral-xyz/anchor";


export type Fragment = {
  "version": "0.1.0",
  "name": "the_artisan",
  "instructions": [
    {
      "name": "intializeProtocolAccount",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "protocol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "lockProtocol",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "protocol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeAdminAccount",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminState",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "newAdmin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newAdminState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "initializeProfileAccount",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "profile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "verifyProfile",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "profile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gatekeeperNetwork",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyMembership",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "membershipWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "profile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "membershipType",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createWatch",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name":"watch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
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
          "name": "diamater",
          "type": "u8"
        },
        {
          "name": "movement",
          "type": "string"
        },
        {
          "name": "dialColor",
          "type": "string"
        },
        {
          "name": "caseMaterial",
          "type": "string"
        },
        {
          "name": "braceletMaterial",
          "type": "string"
        },
        {
          "name": "yearOfProduction",
          "type": "u16"
        }
      ]
    },
    {
      "name": "createListing",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "watch",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fraction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auth",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token2022Program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
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
          "name": "startingTime",
          "type": "i64"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "buyListing",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerCurrencyAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerFractionAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "listingCurrencyAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fraction",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "currency",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "auth",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token2022Program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Protocol",
      "type":  {
        "kind": "struct",
        "fields": [
          {
            "name": "locked",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Admin",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "publickey",
            "type": "publicKey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "initialized",
            "type": "i64"
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
            "name": "membership",
            "type": {
              "defined": "Membership"
            }
          },
          {
            "name": "isVerified",
            "type": "bool"
          },
          {
            "name": "spending",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Watch",
      "type": {
        "kind": "struct",
        "fields": [
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
            "name": "diamater",
            "type": "u8"
          },
          {
            "name": "movement",
            "type": "string"
          },
          {
            "name": "dialColor",
            "type": "string"
          },
          {
            "name": "caseMaterial",
            "type": "string"
          },
          {
            "name": "braceletMaterial",
            "type": "string"
          },
          {
            "name": "yearOfProduction",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "Listing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "watch",
            "type": "publicKey"
          },
          {
            "name": "reference",
            "type": "string"
          },
          {
            "name": "share",
            "type": "u16"
          },
          {
            "name": "shareSold",
            "type": "u16"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "startingTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "CompletedListing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "watch",
            "type": "publicKey"
          },
          {
            "name": "reference",
            "type": "string"
          },
          {
            "name": "share",
            "type": "u16"
          },
          {
            "name": "price",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BuyingError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotVerified"
          },
          {
            "name": "NotTimeYet"
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action"
    },
    {
      "code": 6001,
      "name": "ProfileAlreadyVerified",
      "msg": "You are already verified!"
    },
    {
      "code": 6002,
      "name": "InvalidMembershipType",
      "msg": "You passed in the wrong Membership Type!"
    },
    {
      "code": 6003,
      "name": "InvalidCondition",
      "msg": "You used an invalid condition"
    }
  ]
}
  
export const IDL: Fragment = {
  "version": "0.1.0",
  "name": "the_artisan",
  "instructions": [
    {
      "name": "intializeProtocolAccount",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "protocol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "lockProtocol",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "protocol",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeAdminAccount",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminState",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "newAdmin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newAdminState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "initializeProfileAccount",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "profile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "verifyProfile",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "profile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gatekeeperNetwork",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyMembership",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "membershipWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "profile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "membershipType",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createWatch",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name":"watch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
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
          "name": "diamater",
          "type": "u8"
        },
        {
          "name": "movement",
          "type": "string"
        },
        {
          "name": "dialColor",
          "type": "string"
        },
        {
          "name": "caseMaterial",
          "type": "string"
        },
        {
          "name": "braceletMaterial",
          "type": "string"
        },
        {
          "name": "yearOfProduction",
          "type": "u16"
        }
      ]
    },
    {
      "name": "createListing",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "watch",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fraction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auth",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token2022Program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
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
          "name": "startingTime",
          "type": "i64"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "buyListing",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerCurrencyAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerFractionAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "listingCurrencyAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fraction",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "currency",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "auth",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token2022Program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Protocol",
      "type":  {
        "kind": "struct",
        "fields": [
          {
            "name": "locked",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Admin",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "publickey",
            "type": "publicKey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "initialized",
            "type": "i64"
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
            "name": "membership",
            "type": {
              "defined": "Membership"
            }
          },
          {
            "name": "isVerified",
            "type": "bool"
          },
          {
            "name": "spending",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Watch",
      "type": {
        "kind": "struct",
        "fields": [
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
            "name": "diamater",
            "type": "u8"
          },
          {
            "name": "movement",
            "type": "string"
          },
          {
            "name": "dialColor",
            "type": "string"
          },
          {
            "name": "caseMaterial",
            "type": "string"
          },
          {
            "name": "braceletMaterial",
            "type": "string"
          },
          {
            "name": "yearOfProduction",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "Listing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "watch",
            "type": "publicKey"
          },
          {
            "name": "reference",
            "type": "string"
          },
          {
            "name": "share",
            "type": "u16"
          },
          {
            "name": "shareSold",
            "type": "u16"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "startingTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "CompletedListing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "watch",
            "type": "publicKey"
          },
          {
            "name": "reference",
            "type": "string"
          },
          {
            "name": "share",
            "type": "u16"
          },
          {
            "name": "price",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BuyingError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotVerified"
          },
          {
            "name": "NotTimeYet"
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action"
    },
    {
      "code": 6001,
      "name": "ProfileAlreadyVerified",
      "msg": "You are already verified!"
    },
    {
      "code": 6002,
      "name": "InvalidMembershipType",
      "msg": "You passed in the wrong Membership Type!"
    },
    {
      "code": 6003,
      "name": "InvalidCondition",
      "msg": "You used an invalid condition"
    }
  ]
}


export const PROGRAM_ID = "2wj57nXtBwFAJS7mezos1mWirfVJWqxiqYAVtSt7W6F6" as Address