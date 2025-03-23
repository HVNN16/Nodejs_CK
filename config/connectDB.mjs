import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const dbConnection = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

dbConnection.once('open', () => {
  console.log('Connected to MongoDB database!');
});

dbConnection.on('error', (err) => {
  console.error('Error connecting to MongoDB database:', err);
});

export default dbConnection;