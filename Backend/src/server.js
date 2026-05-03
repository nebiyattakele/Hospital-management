console.log('Starting server...');
require('dotenv').config();

const app = require('./app');
const connectDB = require('./repository/database/mongoConnection');

console.log('Loading MONGODB_URI:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'undefined');


const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

