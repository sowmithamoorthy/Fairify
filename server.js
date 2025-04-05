/*import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Seller Schema and Model
const documentSchema = new mongoose.Schema({
  filename: String,
  path: String,
  originalName: String
});

const sellerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  documents: [documentSchema],
  status: { type: String, default: 'pending' }
});

const Seller = mongoose.model('Seller', sellerSchema);

// Dummy Email Sender
const sendVerificationEmail = async (name, email) => {
  console.log(`📨 Verification email to ${email} for ${name}`);
};

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const upload = multer({ 
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Signup Route
app.post('/api/seller/signup', upload.array('documents'), async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'At least one document is required' });
  }

  try {
    const { name, email, password } = req.body;

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      req.files.forEach(file => fs.unlinkSync(file.path));
      return res.status(400).json({ message: 'Seller already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const documents = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      originalName: file.originalname
    }));

    const newSeller = new Seller({ 
      name, 
      email, 
      password: hashedPassword, 
      documents,
      status: 'pending'
    });

    await newSeller.save();

    sendVerificationEmail(name, email).catch(console.error);

    res.status(201).json({ 
      success: true,
      message: 'Signup successful. Await admin approval.',
      sellerId: newSeller._id
    });

  } catch (err) {
    console.error('❌ Signup error:', err);
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Signup failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📮 POST /api/seller/signup`);
});
*/

import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// Mongoose Schema
const sellerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  documents: [{ filename: String, path: String, originalName: String }],
  status: { type: String, default: 'pending' },
  manufacturerId: String,
  passkey: String
});
const Seller = mongoose.model('Seller', sellerSchema);

// Multer Config
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
console.log('EMAIL:', process.env.ADMIN_EMAIL);
console.log('PASS:', process.env.ADMIN_EMAIL_PASSWORD ? '✅ Present' : '❌ Missing');

// Email Service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD
  }
});

const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Verification System" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html
    });
    console.log(`📨 Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email send error:', error);
  }
};

// Seller Signup
app.post('/api/seller/signup', upload.array('documents'), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || !req.files?.length)
      return res.status(400).json({ message: 'All fields and documents required' });

    const existing = await Seller.findOne({ email });
    if (existing) {
      req.files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: 'Seller already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const documents = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      originalName: file.originalname
    }));

    const newSeller = new Seller({
      name,
      email,
      password: hashedPassword,
      documents
    });

    await newSeller.save();

    // Send Email to Admin
    const adminLink = `http://localhost:${PORT}/admin/verify?sellerId=${newSeller._id}`;
    await sendMail(process.env.ADMIN_RECEIVER_EMAIL, 'New Seller Signup - Verify Required',
      `<p>A new seller <b>${name}</b> has signed up. Click below to verify:</p>
       <a href="${adminLink}">Verify Seller</a>`);

    res.status(201).json({
      success: true,
      message: 'Signup successful. Await admin approval.'
    });

  } catch (err) {
    console.error(err);
    req.files?.forEach(f => fs.unlinkSync(f.path));
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Admin Verification Form Page (HTML)
app.get('/admin/verify', async (req, res) => {
  const { sellerId } = req.query;
  if (!sellerId) return res.status(400).send('Missing sellerId');
  res.send(`
    <h2>Verify Manufacturer</h2>
    <form method="POST" action="/admin/verify">
      <input type="hidden" name="sellerId" value="${sellerId}" />
      <label>Manufacturer ID:</label><br/>
      <input type="text" name="manufacturerId" required /><br/><br/>
      <label>Private Key (Passkey):</label><br/>
      <input type="text" name="passkey" required /><br/><br/>
      <button type="submit">Verify Manufacturer</button>
    </form>
  `);
});

// Admin Verification Handler
app.post('/admin/verify', async (req, res) => {
  const { sellerId, manufacturerId, passkey } = req.body;

  if (!sellerId || !manufacturerId || !passkey)
    return res.status(400).send('Missing fields');

  const seller = await Seller.findById(sellerId);
  if (!seller) return res.status(404).send('Seller not found');

  seller.status = 'verified';
  seller.manufacturerId = manufacturerId;
  seller.passkey = passkey;
  await seller.save();

  await sendMail(seller.email, 'Your Account Has Been Verified',
    `<p>Hi ${seller.name},</p>
     <p>Your account has been verified.</p>
     <p><strong>Manufacturer ID:</strong> ${manufacturerId}</p>
     <p><strong>Passkey:</strong> ${passkey}</p>`);

  res.send(`<p>✅ Manufacturer ${seller.name} has been verified and notified.</p>`);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
