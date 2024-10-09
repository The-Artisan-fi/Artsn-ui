const dummyUser = {
    _id: "60d5ecb74f79285b8d358f0b",
    uuid: "60d5ecb74f79285b8d358f0b-60d5ecb74f79285b8d358f0b-60d5ecb74f79285b8d358f0b",
    email: "john@gmail.com",
    password: "hashedPassword123",
    username: "john12",
    firstName: "John",
    lastName: "Doe",
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2024-09-20T14:45:00Z",
    lastLogin: "2024-09-23T09:15:00Z",
    isActive: true,
    role: "creator",
    verificationToken: "vt_123456789",
    isVerified: true,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    coverImageUrl: "/sample/test-bg.jpeg",
    profilePictureUrl: "/sample/test-pfp.jpg",
    publicKey: "BW2G2xHE6bXkPJ6f27YrDhMkwA5iQTbkP5HF7vic3ksK",
    solanaTransactionId: "5UBnRcRcz9cVvecNzLCLXiEpL2UQu4noiKx62Js5x5EXNYMtekZQhCUehPfA",
    phoneNumber: "+1234567890",
    baseProfile: {
      id: "bp_987654321",
      displayName: "Jane the Creator",
      displayRole: "Digital Artist & Designer",
      photoUrl: "https://example.com/profiles/janedoe_large.jpg",
      bio: "Passionate digital artist with a flair for blending traditional and modern techniques.",
      createdAt: "2023-01-15T08:35:00Z",
      updatedAt: "2024-08-01T11:20:00Z"
    },
    creatorInfo: {
      id: "ci_246810121",
      createdAt: "2023-01-15T09:00:00Z",
      updatedAt: "2024-09-01T16:30:00Z",
      detailedBio: {
        profession: "Digital Artist and UI/UX Designer",
        education: {
          schools: [
            {
              name: "Rhode Island School of Design",
              degree: "BFA",
              fieldOfStudy: "Digital Media",
              graduationYear: "2019"
            },
            {
              name: "Parsons School of Design",
              degree: "MFA",
              fieldOfStudy: "Design and Technology",
              graduationYear: "2021"
            }
          ],
          relevantCourses: ["Advanced Digital Illustration", "UI/UX Design Principles", "3D Modeling"],
          specializedTraining: ["Adobe Creative Suite Masterclass", "Blockchain for Creatives Workshop"]
        },
        professionalAchievements: {
          awards: ["2022 Digital Art Innovation Award", "2023 Best New UI/UX Designer"],
          exhibitions: ["NextGen Digital Art Expo 2023", "Annual Tech & Design Showcase 2024"],
          portfolioLinks: ["https://janedoe.artstation.com", "https://www.behance.net/janedoecreates"]
        },
        collaborators: ["Alex Johnson", "Maria Garcia", "Tech Innovations Inc."],
        employmentContracts: [
          {
            employer: "CreativeTech Solutions",
            startDate: "2021-09-01",
            endDate: "2023-08-31",
            ipRightsInfo: "All IP created during employment is jointly owned"
          },
          {
            employer: "Freelance",
            startDate: "2023-09-01",
            endDate: "present",
            ipRightsInfo: "All IP fully owned by Jane Doe unless otherwise specified in client contracts"
          }
        ]
      },
      ipAssets: []
    },
    investorInfo: {
      id: "ii_135792468",
      createdAt: "2023-06-01T10:00:00Z",
      updatedAt: "2024-09-15T13:45:00Z",
      investmentPreferences: ["Digital Art", "Emerging Artists", "NFTs"],
      investmentHistory: [
        {
          id: "ih_111213141",
          type: "NFT Purchase",
          investmentDate: "2024-03-15T14:30:00Z",
          amount: 1500,
          terms: "Full ownership of NFT #12345",
          transactionId: "0xabcdef1234567890",
          creatorId: "60d5ecb74f79285b8d358f0c",
          ipId: "ip_987654321",
        }
      ],
      portfolioSize: 25000,
      riskTolerance: "Moderate",
      preferredInvestmentDuration: "1-3 years"
    },
    kycInfo: {
      kycStatus: "Approved",
      kycCompletionDate: "2023-01-20T11:00:00Z",
      kycDocuments: [
        {
          documentType: "Government ID",
          documentUrl: "https://secure.example.com/kyc/janedoe_id.jpg",
          verificationStatus: "Verified"
        },
        {
          documentType: "Proof of Address",
          documentUrl: "https://secure.example.com/kyc/janedoe_address.pdf",
          verificationStatus: "Verified"
        }
      ]
    }
};

export default dummyUser;