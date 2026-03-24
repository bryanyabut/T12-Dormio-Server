const { body } = require('express-validator');

const profileValidation = [
  body('studentId')
    .notEmpty().withMessage('Student ID is required')
    .isLength({ min: 9, max: 9 }).withMessage('Student ID must be exactly 9 digits')
    .isNumeric().withMessage('Student ID must contain only numbers'),

  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isString().withMessage('Full name must be a valid string'),

  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('roomNumber')
    .optional()
    .trim()
    .isAlphanumeric().withMessage('Room number must be alphanumeric'),

];

module.exports = {
  profileValidation
};