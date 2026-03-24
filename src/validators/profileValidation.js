const { body } = require('express-validator');

const profileValidation = [
  body('studentId')
    .notEmpty().withMessage('Student ID is required')
    .isLength({ min: 9, max: 9 }).withMessage('Student ID must be exactly 9 digits')
    .isNumeric().withMessage('Student ID must contain only numbers'),

  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string'),

  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('roomNumber')
    .optional()
    .trim()
    .isAlphanumeric().withMessage('Room number must be alphanumeric')
];

module.exports = {
  profileValidation
};