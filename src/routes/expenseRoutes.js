const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createExpenseRules, updateExpenseRules } = require('../validators/expenseValidator');
const {
  createExpense,
  getMyExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

router.post('/', authenticateToken, createExpenseRules, validate, createExpense);
router.get('/', authenticateToken, getMyExpenses);
router.get('/:id', authenticateToken, getExpenseById);
router.put('/:id', authenticateToken, updateExpenseRules, validate, updateExpense);
router.delete('/:id', authenticateToken, deleteExpense);

module.exports = router;
