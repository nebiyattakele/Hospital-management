require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/domain/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if an admin already exists
    const adminExists = await User.findOne({ role: 'Admin' });
    
    if (adminExists) {
      console.log('✅ Admin already exists!');
      console.log('Email:', adminExists.email);
      console.log('(Password is encrypted in the database)');
    } else {
      // Create a new admin
      await User.create({
        name: 'System Admin',
        email: 'admin@medcare.com',
        password: 'adminpassword123',
        role: 'Admin'
      });
      console.log('🎉 Admin successfully created!');
      console.log('Email: admin@medcare.com');
      console.log('Password: adminpassword123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

seedAdmin();
