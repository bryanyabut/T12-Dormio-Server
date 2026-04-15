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
  body('splitWithRoommates')
    .optional()
    .isBoolean().withMessage('splitWithRoommates must be a boolean'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date'),
  body('shares')
    .optional()
    .isArray({ min: 1 }).withMessage('Shares must be a non-empty array when splitWithRoommates is true'),
  body('shares.*.userId')
    .optional()
    .isInt().withMessage('Each share userId must be an integer'),
  body('shares.*.shareAmount')
    .optional()
    .isDecimal().withMessage('Each shareAmount must be a valid decimal'),
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
