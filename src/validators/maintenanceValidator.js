const { body } = require('express-validator');

const maintenanceRules = [
  body('roomNumber')
    .notEmpty().withMessage('Room number is required')
    .isAlphanumeric().withMessage('Room number must contain letters and numbers only'),
  body('description')
    .notEmpty().withMessage('Description is required')
];

module.exports = { maintenanceRules };