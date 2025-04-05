import express from 'express';
import multer from 'multer';
import { signupSeller } from '../controllers/sellerController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Seller signup route with file handling
router.post('/signup', 
  upload.array('documents', 5), // Max 5 files
  signupSeller
);

export default router;