import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

const userDBConnection = mongoose.createConnection(`${mongoURI}/users`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productDBConnection = mongoose.createConnection(`${mongoURI}/productDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const blogDBConnection = mongoose.createConnection(`${mongoURI}/blogDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkoutDBConnection = mongoose.createConnection(`${mongoURI}/productDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const contactDBConnection = mongoose.createConnection(`${mongoURI}/contactDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Log khi kết nối thành công
userDBConnection.once('open', () => {
  console.log('Connected to users database!');
});
productDBConnection.once('open', () => {
  console.log('Connected to productDB database!');
});
blogDBConnection.once('open', () => {
  console.log('Connected to blogDB database!');
});
checkoutDBConnection.once('open', () => {
  console.log('Connected to checkoutDB database!');
});
contactDBConnection.once('open', () => {
  console.log('Connected to contactDB database!');
});

// Log khi có lỗi kết nối
userDBConnection.on('error', (err) => {
  console.error('Error connecting to users database:', err);
});
productDBConnection.on('error', (err) => {
  console.error('Error connecting to productDB database:', err);
});
blogDBConnection.on('error', (err) => {
  console.error('Error connecting to blogDB database:', err);
});
checkoutDBConnection.on('error', (err) => {
  console.error('Error connecting to checkoutDB database:', err);
});
contactDBConnection.on('error', (err) => {
  console.error('Error connecting to contactDB database:', err);
});

export { userDBConnection, productDBConnection, blogDBConnection, checkoutDBConnection, contactDBConnection };
