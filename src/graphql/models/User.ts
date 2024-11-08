import mongoose from 'mongoose';

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
  baseProfile: {
    displayName: String,
    displayRole: String,
    photoUrl: String,
    bio: String,
    createdAt: Date,
    updatedAt: Date
  },
  kycInfo: {
    kycStatus: String,
    kycCompletionDate: Date,
    kycDocuments: [{
      documentType: String,
      documentUrl: String,
      verificationStatus: String
    }]
  }
});

export const UserModel = mongoose.model('User', User);