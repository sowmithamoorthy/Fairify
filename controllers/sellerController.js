import Seller from '../models/Seller.js';
import { sendVerificationEmail } from '../utils/emailService.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

export const signupSeller = async (req, res) => {
  // Validate required fields
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  // Validate files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'At least one document is required' });
  }

  try {
    const { name, email, password } = req.body;

    // Check for existing seller
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      // Clean up uploaded files if seller exists
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
      return res.status(400).json({ message: 'Seller already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Process document paths
    const documents = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      originalName: file.originalname
    }));

    // Create new seller
    const newSeller = new Seller({ 
      name, 
      email, 
      password: hashedPassword, 
      documents,
      status: 'pending'
    });

    await newSeller.save();

    // Send verification email (non-blocking)
    sendVerificationEmail(name, email)
      .catch(error => console.error('Email sending failed:', error));

    res.status(201).json({ 
      success: true,
      message: 'Signup successful. Await admin approval.',
      sellerId: newSeller._id
    });

  } catch (err) {
    console.error('Signup error:', err);

    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Signup failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};