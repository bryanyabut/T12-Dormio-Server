const { prisma } = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

const createBill = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { billName, totalAmount, dueDate, category } = req.body;

  const bill = await prisma.bill.create({
    data: {
      userId,
      billName,
      totalAmount,
      dueDate: new Date(dueDate),
      category: category || null,
    },
  });

  res.status(201).json({ message: 'Bill created successfully.', bill });
});

const getMyBills = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { status, page = 1, limit = 20 } = req.query;

  const where = { userId };
  if (status) where.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [bills, total] = await Promise.all([
    prisma.bill.findMany({
      where,
      skip,
      take,
      include: {
        billSharing: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
      },
      orderBy: { dueDate: 'asc' },
    }),
    prisma.bill.count({ where }),
  ]);

  res.json({
    bills,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)),
  });
});

const getBillById = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const bill = await prisma.bill.findFirst({
    where: { id: parseInt(id), userId },
    include: {
      billSharing: {
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      },
    },
  });

  if (!bill) {
    return res.status(404).json({ error: 'Bill not found.' });
  }

  res.json({ bill });
});

const updateBill = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { billName, totalAmount, dueDate, category, status } = req.body;

  const existing = await prisma.bill.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Bill not found.' });
  }

  const bill = await prisma.bill.update({
    where: { id: parseInt(id) },
    data: {
      ...(billName && { billName }),
      ...(totalAmount !== undefined && { totalAmount }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
      ...(category !== undefined && { category: category || null }),
      ...(status && { status }),
    },
  });

  res.json({ message: 'Bill updated successfully.', bill });
});

const deleteBill = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const existing = await prisma.bill.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Bill not found.' });
  }

  await prisma.bill.delete({ where: { id: parseInt(id) } });

  res.json({ message: 'Bill deleted successfully.' });
});

const splitBill = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { shares } = req.body;

  const bill = await prisma.bill.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!bill) {
    return res.status(404).json({ error: 'Bill not found.' });
  }

  const billShares = await prisma.$transaction(
    shares.map((share) =>
      prisma.billSharing.upsert({
        where: {
          billId_userId: { billId: parseInt(id), userId: share.userId },
        },
        update: { shareAmount: share.shareAmount },
        create: {
          billId: parseInt(id),
          userId: share.userId,
          shareAmount: share.shareAmount,
        },
      })
    )
  );

  const allPaid = shares.every((s) => s.hasPaid === true);
  const newStatus = allPaid ? 'PAID' : 'PARTIALLY_PAID';

  await prisma.bill.update({
    where: { id: parseInt(id) },
    data: { status: newStatus },
  });

  res.status(201).json({ message: 'Bill split successfully.', billShares });
});

const getSharesForBill = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const bill = await prisma.bill.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!bill) {
    return res.status(404).json({ error: 'Bill not found.' });
  }

  const shares = await prisma.billSharing.findMany({
    where: { billId: parseInt(id) },
    include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
  });

  res.json({ shares });
});

const getMyShares = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { hasPaid } = req.query;

  const where = { userId };
  if (hasPaid !== undefined) where.hasPaid = hasPaid === 'true';

  const shares = await prisma.billSharing.findMany({
    where,
    include: {
      bill: {
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      },
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
    orderBy: { bill: { dueDate: 'asc' } },
  });

  res.json({ shares });
});

const markShareAsPaid = asyncHandler(async (req, res) => {
  const { id, shareId } = req.params;
  const userId = req.user.userId;

  const bill = await prisma.bill.findFirst({
    where: { id: parseInt(id), userId },
  });

  if (!bill) {
    return res.status(404).json({ error: 'Bill not found.' });
  }

  const share = await prisma.billSharing.findFirst({
    where: { id: parseInt(shareId), billId: parseInt(id) },
  });

  if (!share) {
    return res.status(404).json({ error: 'Bill share not found.' });
  }

  const updatedShare = await prisma.billSharing.update({
    where: { id: parseInt(shareId) },
    data: { hasPaid: true, paidAt: new Date() },
  });

  const unpaidShares = await prisma.billSharing.count({
    where: { billId: parseInt(id), hasPaid: false },
  });

  if (unpaidShares === 0) {
    await prisma.bill.update({
      where: { id: parseInt(id) },
      data: { status: 'PAID' },
    });
  }

  res.json({ message: 'Share marked as paid.', share: updatedShare });
});

const getBalanceSummary = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Get all bills created by this user with unpaid shares
  const billsOwned = await prisma.bill.findMany({
    where: { userId },
    include: {
      billSharing: {
        where: { hasPaid: false },
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      },
    },
  });

  // Get all unpaid shares for this user (bills they owe money on)
  const sharesOwed = await prisma.billSharing.findMany({
    where: { userId, hasPaid: false },
    include: {
      bill: {
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      },
    },
  });

  // Calculate total owed to user (from their bills where others haven't paid)
  const totalOwedToYou = billsOwned.reduce((sum, bill) => {
    return sum + bill.billSharing.reduce((shareSum, share) => shareSum + Number(share.shareAmount), 0);
  }, 0);

  // Calculate total user owes (from their unpaid shares)
  const totalYouOwe = sharesOwed.reduce((sum, share) => sum + Number(share.shareAmount), 0);

  // Calculate net balance per roommate
  const roommateBalances = {};

  // Add amounts others owe to you
  billsOwned.forEach((bill) => {
    bill.billSharing.forEach((share) => {
      const key = share.user.id;
      if (!roommateBalances[key]) {
        roommateBalances[key] = {
          user: share.user,
          owesYou: 0,
          youOwe: 0,
          netBalance: 0,
        };
      }
      roommateBalances[key].owesYou += Number(share.shareAmount);
    });
  });

  // Add amounts you owe to others
  sharesOwed.forEach((share) => {
    const key = share.bill.user.id;
    if (!roommateBalances[key]) {
      roommateBalances[key] = {
        user: share.bill.user,
        owesYou: 0,
        youOwe: 0,
        netBalance: 0,
      };
    }
    roommateBalances[key].youOwe += Number(share.shareAmount);
  });

  // Calculate net balance for each roommate
  Object.keys(roommateBalances).forEach((key) => {
    const balance = roommateBalances[key];
    balance.netBalance = balance.owesYou - balance.youOwe;
  });

  // Convert to array and sort by net balance (descending - people who owe you the most first)
  const roommateBalancesArray = Object.values(roommateBalances).sort((a, b) => b.netBalance - a.netBalance);

  res.json({
    totalOwedToYou,
    totalYouOwe,
    netBalance: totalOwedToYou - totalYouOwe,
    roommateBalances: roommateBalancesArray,
  });
});

module.exports = {
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
};
