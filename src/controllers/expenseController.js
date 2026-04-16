const { prisma } = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

const createExpense = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { description, amount, category, expenseDate } = req.body;

  const expense = await prisma.expense.create({
    data: {
      userId,
      description,
      amount,
      category: category || null,
      expenseDate: new Date(expenseDate),
    },
  });

  res.status(201).json({ message: 'Expense created successfully.', expense });
});

const getMyExpenses = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { category, startDate, endDate } = req.query;

  const where = { userId };
  if (category) where.category = category;
  if (startDate || endDate) {
    where.expenseDate = {};
    if (startDate) where.expenseDate.gte = new Date(startDate);
    if (endDate) where.expenseDate.lte = new Date(endDate);
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { expenseDate: 'desc' },
  });

  res.json({ expenses });
});

const getExpenseById = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const expense = await prisma.expense.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!expense) {
    return res.status(404).json({ error: 'Expense not found.' });
  }

  res.json({ expense });
});

const updateExpense = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { description, amount, category, expenseDate } = req.body;

  const existing = await prisma.expense.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Expense not found.' });
  }

  const expense = await prisma.expense.update({
    where: { id: parseInt(id) },
    data: {
      ...(description && { description }),
      ...(amount !== undefined && { amount }),
      ...(category !== undefined && { category: category || null }),
      ...(expenseDate && { expenseDate: new Date(expenseDate) }),
    },
  });

  res.json({ message: 'Expense updated successfully.', expense });
});

const deleteExpense = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const existing = await prisma.expense.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Expense not found.' });
  }

  await prisma.expense.delete({ where: { id: parseInt(id) } });

  res.json({ message: 'Expense deleted successfully.' });
});

module.exports = { createExpense, getMyExpenses, getExpenseById, updateExpense, deleteExpense };
