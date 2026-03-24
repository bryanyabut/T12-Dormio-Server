const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware'); 
const validate = require('../middleware/validate'); 
const { profileValidation } = require('../validators/profileValidation'); 
const upload = require('../middleware/uploadMiddleware');

/**
 * GET /api/v1/profile
 * Get current student profile data
 */
router.get('/', authenticateToken, profileCtrl.getProfile);

/**
 * PUT /api/v1/profile
 * Update User & Profile details (Names + 9-digit Student ID)
 */
router.put(
  '/', 
  authenticateToken, 
  profileValidation, 
  validate, 
  profileCtrl.updateProfile
);

/**
 * POST /api/v1/profile/avatar
 * Upload profile picture to Cloudinary
 */
router.post(
  '/avatar', 
  authenticateToken, 
  upload.single('profileImage'), 
  profileCtrl.updateAvatar
);

module.exports = router;