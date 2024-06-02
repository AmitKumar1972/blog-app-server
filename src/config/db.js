const mongoose = require('mongoose');
const logger = require('./logger');

// MongoDB connection URL
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/mydatabase';

// Establish the connection
const connectDB = async () => {
  try {
    logger.info('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB')
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);

    // Handle specific error conditions
    if (error.name === 'MongoNetworkError') {
      logger.error('Network error occurred. Check your MongoDB server.');
    } else if (error.name === 'MongooseServerSelectionError') {
      logger.error('Server selection error. Ensure MongoDB is running and accessible.');
    } else {
      // Handle other types of errors
      logger.error('An unexpected error occurred:', error);
    }
    process.exit(1); // Exit process with failure
  }
};

// Handling connection events
const db = mongoose.connection;

db.on('error', (error) => {
  logger.error('MongoDB connection error:', error);
});

db.once('open', () => {
  logger.info('Connected to MongoDB');
});

db.on('disconnected', () => {
  logger.warn('Disconnected from MongoDB');
});

// Gracefully close the connection when the application exits
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Mongoose connection is disconnected due to application termination');
  process.exit(0);
});

module.exports = connectDB;
