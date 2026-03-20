const express = require('express');
const router = express.Router();
const { getStudents, createStudent } = require('../controllers/studentsExample');

// Example route
router.get('/', getStudents);
router.post('/', createStudent);



module.exports = router;