const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  createBillRules,
  updateBillRules,
  splitBillRules,
} = require('../validators/billValidator');
const {
  createBill,
  getMyBills,
  getBillById,
  updateBill,
  deleteBill,
  splitBill,
  getSharesForBill,
  getMyShares,
  markShareAsPaid,
  getBalanceSummary,
} = require('../controllers/billController');

router.post('/', authenticateToken, createBillRules, validate, createBill);
router.get('/', authenticateToken, getMyBills);
router.get('/my-shares', authenticateToken, getMyShares);
router.get('/summary/balance', authenticateToken, getBalanceSummary);
router.get('/:id', authenticateToken, getBillById);
router.put('/:id', authenticateToken, updateBillRules, validate, updateBill);
router.delete('/:id', authenticateToken, deleteBill);

router.post('/:id/split', authenticateToken, splitBillRules, validate, splitBill);
router.get('/:id/shares', authenticateToken, getSharesForBill);
router.patch('/:id/shares/:shareId/pay', authenticateToken, markShareAsPaid);

module.exports = router;
