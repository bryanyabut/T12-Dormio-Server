const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent, updateEvent } = require('../controllers/calendarController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken); 

// Routes for /api/v1/calendar
router
    .route('/')
    .get(getEvents)
    .post(createEvent);

// Routes for /api/v1/calendar/:id
router
    .route('/:id')
    .put(updateEvent)    
    .delete(deleteEvent);

module.exports = router;