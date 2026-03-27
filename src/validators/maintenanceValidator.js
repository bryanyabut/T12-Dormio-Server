const { body } = require('express-validator');

const maintenanceRules = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('urgency')
    .notEmpty().withMessage('Urgency is required')
    .isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Urgency must be LOW, MEDIUM, or HIGH'),
  body('description')
    .notEmpty().withMessage('Description is required')
];

module.exports = { maintenanceRules };