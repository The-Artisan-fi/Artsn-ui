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
          "name": "watch",
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
          "type": "u64"
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
        },
        {
          "name": "uri",
          "type": "string"
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
          "name": "mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
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
          "name": "name",
          "type": "string"
        },
        {
          "name": "img",
          "type": "string"
        },
        {
          "name": "set",
          "type": "u8"
        },
        {
          "name": "condition",
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
          "name": "startingTime",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Protocol",
      "type": {
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
      "name": "watch",
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
            "type": "u64"
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
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "listing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "img",
            "type": "string"
          },
          {
            "name": "watch",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "set",
            "type": {
              "defined": "WatchSet"
            }
          },
          {
            "name": "condition",
            "type": {
              "defined": "WatchCondition"
            }
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
    }
  ],
  "types": [
    {
      "name": "WatchError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "InvalidSet"
          },
          {
            "name": "InvalidCondition"
          }
        ]
      }
    },
    {
      "name": "ListingError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "SoldOut"
          },
          {
            "name": "InvalidProgram"
          },
          {
            "name": "InvalidInstruction"
          },
          {
            "name": "InvalidAccount"
          },
          {
            "name": "InvalidUri"
          },
          {
            "name": "InvalidName"
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
      "name": "WatchSet",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "FullSet"
          },
          {
            "name": "PaperOnly"
          },
          {
            "name": "BoxOnly"
          },
          {
            "name": "WatchOnly"
          }
        ]
      }
    },
    {
      "name": "WatchCondition",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Stickered"
          },
          {
            "name": "New"
          },
          {
            "name": "PreOwned"
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
          "name": "watch",
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
          "type": "u64"
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
        },
        {
          "name": "uri",
          "type": "string"
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
          "name": "mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
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
          "name": "name",
          "type": "string"
        },
        {
          "name": "img",
          "type": "string"
        },
        {
          "name": "set",
          "type": "u8"
        },
        {
          "name": "condition",
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
          "name": "startingTime",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Protocol",
      "type": {
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
      "name": "watch",
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
            "type": "u64"
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
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "listing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "img",
            "type": "string"
          },
          {
            "name": "watch",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "set",
            "type": {
              "defined": "WatchSet"
            }
          },
          {
            "name": "condition",
            "type": {
              "defined": "WatchCondition"
            }
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
    }
  ],
  "types": [
    {
      "name": "WatchError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "InvalidSet"
          },
          {
            "name": "InvalidCondition"
          }
        ]
      }
    },
    {
      "name": "ListingError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "SoldOut"
          },
          {
            "name": "InvalidProgram"
          },
          {
            "name": "InvalidInstruction"
          },
          {
            "name": "InvalidAccount"
          },
          {
            "name": "InvalidUri"
          },
          {
            "name": "InvalidName"
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
      "name": "WatchSet",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "FullSet"
          },
          {
            "name": "PaperOnly"
          },
          {
            "name": "BoxOnly"
          },
          {
            "name": "WatchOnly"
          }
        ]
      }
    },
    {
      "name": "WatchCondition",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Stickered"
          },
          {
            "name": "New"
          },
          {
            "name": "PreOwned"
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


export const PROGRAM_ID = "5yRcNyhKR7BpAx8DUrqfuhjcpMEVKxdQT1KAS8o72ZAW" as Address