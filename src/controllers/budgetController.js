const { prisma } = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

const createBudget = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { budgetName, totalAmount, startDate, endDate, category } = req.body;

  const budget = await prisma.budget.create({
    data: {
      userId,
      budgetName,
      totalAmount,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      category: category || null,
    },
  });

  res.status(201).json({ message: 'Budget created successfully.', budget });
});

const getMyBudgets = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { category, page = 1, limit = 20 } = req.query;

  const where = { userId };
  if (category) where.category = category;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [budgets, total] = await Promise.all([
    prisma.budget.findMany({
      where,
      skip,
      take,
      orderBy: { startDate: 'desc' },
    }),
    prisma.budget.count({ where }),
  ]);

  res.json({
    budgets,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)),
  });
});

const getBudgetById = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const budget = await prisma.budget.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!budget) {
    return res.status(404).json({ error: 'Budget not found.' });
  }

  res.json({ budget });
});

const updateBudget = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { budgetName, totalAmount, startDate, endDate, category } = req.body;

  const existing = await prisma.budget.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Budget not found.' });
  }

  const budget = await prisma.budget.update({
    where: { id: parseInt(id) },
    data: {
      ...(budgetName && { budgetName }),
      ...(totalAmount !== undefined && { totalAmount }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(category !== undefined && { category: category || null }),
    },
  });

  res.json({ message: 'Budget updated successfully.', budget });
});

const deleteBudget = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const existing = await prisma.budget.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Budget not found.' });
  }

  await prisma.budget.delete({ where: { id: parseInt(id) } });

  res.json({ message: 'Budget deleted successfully.' });
});

const getBudgetSummary = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const budget = await prisma.budget.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!budget) {
    return res.status(404).json({ error: 'Budget not found.' });
  }

  const expenseWhere = {
    userId,
    expenseDate: {
      gte: budget.startDate,
      lte: budget.endDate,
    },
  };
  if (budget.category) expenseWhere.category = budget.category;

  const result = await prisma.expense.aggregate({
    where: expenseWhere,
    _sum: { amount: true },
    _count: true,
  });

  const spent = result._sum.amount || 0;
  const remaining = budget.totalAmount - spent;

  res.json({
    budget: {
      id: budget.id,
      budgetName: budget.budgetName,
      totalAmount: budget.totalAmount,
      startDate: budget.startDate,
      endDate: budget.endDate,
      category: budget.category,
    },
    spent,
    remaining,
    expenseCount: result._count,
    percentageUsed: budget.totalAmount > 0
      ? Number(((spent / budget.totalAmount) * 100).toFixed(2))
      : 0,
  });
});

module.exports = { createBudget, getMyBudgets, getBudgetById, updateBudget, deleteBudget, getBudgetSummary };
