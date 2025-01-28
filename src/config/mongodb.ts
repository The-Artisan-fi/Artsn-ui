import { MongoClient, Db, MongoClientOptions } from 'mongodb'

const uri = process.env.MONGODB_URI
const options: MongoClientOptions = {
  // Add any specific options you need here
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client
      .connect()
      .then((client) => {
        console.log('Connected to MongoDB in development mode')
        return client
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB in development mode:', err)
        throw err
      })
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client
    .connect()
    .then((client) => {
      console.log('Connected to MongoDB in production mode')
      return client
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB in production mode:', err)
      throw err
    })
}

export async function connectToDatabase(): Promise<{
  client: MongoClient
  db: Db
}> {
  try {
    const client = await clientPromise
    const db = client.db('Artisan')

    // Ping the database to ensure the connection is alive
    await db.command({ ping: 1 })
    console.log('Successfully connected to MongoDB')

    return { client, db }
  } catch (error) {
    console.error('Error connecting to the database:', error)
    throw error
  }
}

// This is useful for debugging MongoDB connection issues
export default clientPromise
