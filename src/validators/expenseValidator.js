const { body } = require('express-validator');
const { EXPENSE_CATEGORIES } = require('../constants/categories');

exports.createExpenseRules = [
  body('description').notEmpty().withMessage('Description is required'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isDecimal().withMessage('Amount must be a valid decimal'),
  body('expenseDate')
    .notEmpty().withMessage('Expense date is required')
    .isISO8601().withMessage('Expense date must be a valid date'),
  body('category')
    .optional()
    .isIn(EXPENSE_CATEGORIES).withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`),
];

exports.updateExpenseRules = [
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('amount')
    .optional()
    .isDecimal().withMessage('Amount must be a valid decimal'),
  body('expenseDate')
    .optional()
    .isISO8601().withMessage('Expense date must be a valid date'),
  body('category')
    .optional()
    .isIn(EXPENSE_CATEGORIES).withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`),
];
