const { body } = require('express-validator');
const { EXPENSE_CATEGORIES } = require('../constants/categories');

exports.createBudgetRules = [
  body('budgetName').notEmpty().withMessage('Budget name is required'),
  body('totalAmount')
    .notEmpty().withMessage('Total amount is required')
    .isDecimal().withMessage('Total amount must be a valid decimal'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid date'),
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('End date must be a valid date'),
  body('category')
    .optional()
    .isIn(EXPENSE_CATEGORIES).withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`),
];

exports.updateBudgetRules = [
  body('budgetName').optional().notEmpty().withMessage('Budget name cannot be empty'),
  body('totalAmount')
    .optional()
    .isDecimal().withMessage('Total amount must be a valid decimal'),
  body('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid date'),
  body('category')
    .optional()
    .isIn(EXPENSE_CATEGORIES).withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`),
];
