const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate'); 
const { profileValidation } = require('../validators/profileValidation'); 

/**
 *  GET /api/v1/profile
 *  Get current student profile data
 */
router.get('/', authenticateToken, profileCtrl.getProfile);

/**
 *   PUT /api/v1/profile/sync
 *   Sync User & Profile details (Names + 9-digit Student ID)
 */
router.put(
  '/sync', 
  authenticateToken, 
  profileValidation, 
  validate, 
  profileCtrl.syncStudentProfile
);

module.exports = router;