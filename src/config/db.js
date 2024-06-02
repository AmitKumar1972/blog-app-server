const mongoose = require('mongoose');

// MongoDB connection URL
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/mydatabase';

// Establish the connection
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log('Error connecting to MongoDB:', error.message);

    // Handle specific error conditions
    if (error.name === 'MongoNetworkError') {
      console.log('Network error occurred. Check your MongoDB server.');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.log('Server selection error. Ensure MongoDB is running and accessible.');
    } else {
      // Handle other types of errors
      console.log('An unexpected error occurred:', error);
    }
    process.exit(1); // Exit process with failure
  }
};

// Handling connection events
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Gracefully close the connection when the application exits
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection is disconnected due to application termination');
  process.exit(0);
});

module.exports = connectDB;
