import { Db, Collection } from 'mongodb'
import { User } from '@/types/resolver-types'

export class UserService {
  private collection: Collection<User>

  constructor(db: Db) {
    this.collection = db.collection('users')
  }

  async findByPublicKey(publicKey: string): Promise<User | null> {
    return this.collection.findOne({ publicKey })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.collection.findOne({ email })
  }

  async create(user: User): Promise<User> {
    const result = await this.collection.insertOne(user)
    const savedUser = await this.collection.findOne({ _id: result.insertedId })
    if (!savedUser) throw new Error('Failed to create user')
    return savedUser
  }
}
