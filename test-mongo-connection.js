const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const uri = 'mongodb://next_user:uPhplj5ZLsMIsNmT@artisan-shard-00-00.8hcha.mongodb.net:27017/?ssl=true&authSource=admin&directConnection=true&retryWrites=true&w=majority&appName=Artisan';

const options = {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
  ssl: true,
  directConnection: true,
  tls: true,
};

async function testNativeDriver() {
  console.log('\nTesting MongoDB Native Driver Connection:');
  const client = new MongoClient(uri, options);

  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('Successfully connected to MongoDB');
    
    const db = client.db('Artisan');
    console.log('Got database instance');
    
    console.log('Attempting ping...');
    await db.command({ ping: 1 });
    console.log('Database ping successful');
    
    // Try to list collections
    console.log('Attempting to list collections...');
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    
  } catch (err) {
    console.error('Native driver error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

async function testMongoose() {
  console.log('\nTesting Mongoose Connection:');
  try {
    console.log('Attempting to connect...');
    await mongoose.connect(uri, {
      ...options,
      tlsInsecure: true, // Only for testing, remove in production
    });
    console.log('Successfully connected to MongoDB via Mongoose');
    
    // Test connection by getting model names
    console.log('Attempting to get model names...');
    const modelNames = mongoose.modelNames();
    console.log('Model names:', modelNames);
    
  } catch (err) {
    console.error('Mongoose error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
  } finally {
    await mongoose.disconnect();
    console.log('Connection closed');
  }
}

async function runTests() {
  try {
    await testNativeDriver();
    await testMongoose();
  } catch (err) {
    console.error('Test suite error:', err);
  }
}

console.log('Starting connection tests...');
console.log('Using URI:', uri);
runTests(); 