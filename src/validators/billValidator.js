const { body } = require('express-validator');
const { EXPENSE_CATEGORIES } = require('../constants/categories');

const BILL_STATUSES = ['UNPAID', 'PARTIALLY_PAID', 'PAID'];

exports.createBillRules = [
  body('billName').notEmpty().withMessage('Bill name is required'),
  body('totalAmount')
    .notEmpty().withMessage('Total amount is required')
    .isDecimal().withMessage('Total amount must be a valid decimal'),
  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Due date must be a valid date'),
  body('category')
    .optional()
    .isIn(EXPENSE_CATEGORIES).withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`),
];

exports.updateBillRules = [
  body('billName').optional().notEmpty().withMessage('Bill name cannot be empty'),
  body('totalAmount')
    .optional()
    .isDecimal().withMessage('Total amount must be a valid decimal'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date'),
  body('category')
    .optional()
    .isIn(EXPENSE_CATEGORIES).withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`),
  body('status')
    .optional()
    .isIn(BILL_STATUSES).withMessage(`Status must be one of: ${BILL_STATUSES.join(', ')}`),
];

exports.splitBillRules = [
  body('shares')
    .isArray({ min: 1 }).withMessage('Shares must be a non-empty array'),
  body('shares.*.userId')
    .notEmpty().withMessage('Each share must have a userId')
    .isInt().withMessage('userId must be an integer'),
  body('shares.*.shareAmount')
    .notEmpty().withMessage('Each share must have a shareAmount')
    .isDecimal().withMessage('shareAmount must be a valid decimal'),
];
