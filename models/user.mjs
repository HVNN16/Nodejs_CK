import mongoose from 'mongoose';
import dbConnection from '../config/connectDB.mjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, minLength: 6 },
  workExperience: { type: [Object], default: [] },
  age: { type: Number },
  role: { type: String, default: 'User', enum: ['Admin', 'User'] },
});

export default dbConnection.model('User', userSchema);