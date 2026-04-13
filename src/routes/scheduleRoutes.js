const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createScheduleRules, updateScheduleRules } = require('../validators/scheduleValidator');
const {
  createSchedule,
  getMySchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/scheduleController');

router.post('/', authenticateToken, createScheduleRules, validate, createSchedule);
router.get('/', authenticateToken, getMySchedules);
router.get('/:id', authenticateToken, getScheduleById);
router.put('/:id', authenticateToken, updateScheduleRules, validate, updateSchedule);
router.delete('/:id', authenticateToken, deleteSchedule);

module.exports = router;
