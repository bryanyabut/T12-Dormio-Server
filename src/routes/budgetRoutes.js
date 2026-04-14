const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createBudgetRules, updateBudgetRules } = require('../validators/budgetValidator');
const {
  createBudget,
  getMyBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
} = require('../controllers/budgetController');

router.post('/', authenticateToken, createBudgetRules, validate, createBudget);
router.get('/', authenticateToken, getMyBudgets);
router.get('/:id', authenticateToken, getBudgetById);
router.get('/:id/summary', authenticateToken, getBudgetSummary);
router.put('/:id', authenticateToken, updateBudgetRules, validate, updateBudget);
router.delete('/:id', authenticateToken, deleteBudget);

module.exports = router;
