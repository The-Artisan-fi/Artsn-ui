import mongoose from 'mongoose'

const User = new mongoose.Schema({
  uuid: String,
  email: String,
  publicKey: { type: String, unique: true },
  password: String,
  username: String,
  firstName: String,
  lastName: String,
  role: String,
  isActive: Boolean,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date,
  paraSession: String,
  kycInfo: {
    idvId: String,
    kycStatus: String,
    kycCompletionDate: Date,
    kycDocuments: [
      {
        documentType: String,
        documentUrl: String,
        verificationStatus: String,
      },
    ],
  },
})

// Prevent model recompilation in development mode
const UserModel = mongoose.models.User || mongoose.model('User', User)

export { UserModel }
