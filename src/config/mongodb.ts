import { MongoClient, Db, MongoClientOptions } from 'mongodb'
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI
const dbName = 'Artisan'

const options: MongoClientOptions = {
  // Connection pool settings
  maxPoolSize: 10,  // Maximum number of connections in the pool
  minPoolSize: 3,   // Minimum number of connections in the pool
  connectTimeoutMS: 10000, // Connection timeout
  socketTimeoutMS: 45000,  // Socket timeout
}

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

// Global type declaration for development mode
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
  var _mongoDbConnection: Db | undefined
  var _mongoosePromise: Promise<typeof mongoose> | undefined
}

// Create a cached connection promise
let clientPromise: Promise<MongoClient>
let cachedDb: Db | null = null
let mongoosePromise: Promise<typeof mongoose>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve connection across hot reloads
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
      .then(client => {
        console.log('Connected to MongoDB in development mode')
        return client
      })
      .catch(err => {
        console.error('Failed to connect to MongoDB in development mode:', err)
        throw err
      })
  }
  clientPromise = global._mongoClientPromise

  if (!global._mongoosePromise) {
    global._mongoosePromise = mongoose
      .connect(uri)
      .then(() => {
        console.log('Connected to MongoDB via Mongoose in development mode')
        return mongoose
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB via Mongoose in development mode:', err)
        throw err
      })
  }
  mongoosePromise = global._mongoosePromise
} else {
  // In production, create a new connection promise
  const client = new MongoClient(uri, options)
  clientPromise = client.connect()
    .then(client => {
      console.log('Connected to MongoDB in production mode')
      return client
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB in production mode:', err)
      throw err
    })
}

// Function to get database connection with caching
export async function connectToDatabase(): Promise<{
  client: MongoClient
  db: Db
  mongoose: typeof mongoose
}> {
  // Use cached connection if available
  if (process.env.NODE_ENV === 'development' && global._mongoDbConnection) {
    return { 
      client: await clientPromise, 
      db: global._mongoDbConnection,
      mongoose
    }
  }
  
  if (cachedDb) {
    return { 
      client: await clientPromise, 
      db: cachedDb,
      mongoose
    }
  }

  try {
    const client = await clientPromise
    const db = client.db(dbName)
    
    // Cache the database connection
    if (process.env.NODE_ENV === 'development') {
      global._mongoDbConnection = db
    } else {
      cachedDb = db
    }

    return { client, db, mongoose }
  } catch (error) {
    console.error('Error connecting to the database:', error)
    throw error
  }
}

// Helper function to get just the database object
// Use this for most database operations to simplify code
export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase()
  return db
}

// Export the client promise for advanced use cases
export default clientPromise
