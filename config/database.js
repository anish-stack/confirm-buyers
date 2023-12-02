const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const mongoDbUri = process.env.MONGOURL;

const connectDb = async (mongoDbUri) => {
  try {
    // Check if the MongoDB connection URL is provided
    if (!mongoDbUri) {
      throw new Error('MongoDB connection URL is missing');
    }

    // Connect to MongoDB
    const mongo = await mongoose.connect(mongoDbUri);

    console.log('Connected to MongoDB');

    // If you need to do additional setup after connecting, you can place it here.

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Terminate the Node.js process on connection error
    process.exit(1);
  }
};

module.exports = connectDb;


