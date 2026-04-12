const { body } = require('express-validator');

const profileValidation = [
  body('studentId')
    .notEmpty().withMessage('Student ID is required')
    .isLength({ min: 5, max: 20 }).withMessage('Student ID must be between 5 and 20 characters')
    .matches(/^(?:\d{6,10}|ADMIN-\d{3})$/) 
    .withMessage('Student ID must be a valid numeric ID or in ADMIN-XXX format')
    .trim(),


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
    .optional({ checkFalsy: true } )
    .trim()
    .isAlphanumeric().withMessage('Room number must be alphanumeric')
];

module.exports = {
  profileValidation
};