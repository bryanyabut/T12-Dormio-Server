const bcrypt = require('bcrypt');
const {
  PrismaClient,
  UserRole,
  MealType,
  DietaryRestriction,
  Weekday,
  ScheduleType,
  UrgencyLevel,
  RequestStatus,
  BillStatus,
  ReminderMethod,
  ExpenseCategory,
  ChoreStatus,
} = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  const address1 = await prisma.address.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      street: '123 Generic Ave',
      city: 'Toronto',
      province: 'ON',
      country: 'Canada',
      postalCode: 'ABC DEF',
      unitNumber: '101',
    },
  })

  const address2 = await prisma.address.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      street: '456 Other Street',
      city: 'Vancouver',
      province: 'BC',
      country: 'Canada',
      postalCode: 'A12 B34',
      unitNumber: '202',
    },
  })

  const address3 = await prisma.address.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      street: '19 Maple Road',
      city: 'Calgary',
      province: 'AB',
      country: 'Canada',
      postalCode: 'AA1 BB2',
    },
  })

  const hashPassUser1 = await bcrypt.hash('pass123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      passwordHash: hashPassUser1,
      role: UserRole.STUDENT,
      addressId: address1.id,
    },
  })

  const hashPassUser2 = await bcrypt.hash('pass456', 10);

  const user2 = await prisma.user.upsert({
    where: { email: 'bob.smith@example.com' },
    update: {},
    create: {
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob.smith@example.com',
      passwordHash: hashPassUser2,
      role: UserRole.STUDENT,
      addressId: address2.id,
    },
  })

  const hashPassAdmin = await bcrypt.hash('adminpass', 10);

  const user3 = await prisma.user.upsert({
    where: { email: 'admin@dormio.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@dormio.com',
      passwordHash: hashPassAdmin,
      role: UserRole.ADMIN,
      addressId: address3.id,
    },
  })

  const mealPlanType1 = await prisma.mealPlanType.upsert({
    where: { name: 'Basic' },
    update: {},
    create: {
      name: 'Basic',
      description: 'Basic meal plan',
    },
  })

  const mealPlanType2 = await prisma.mealPlanType.upsert({
    where: { name: 'Premium' },
    update: {},
    create: {
      name: 'Premium',
      description: 'Premium meal contains all the basic meal items and extra options',
    },
  })

  const mealPlanType3 = await prisma.mealPlanType.upsert({
    where: { name: 'Vegetarian' },
    update: {},
    create: {
      name: 'Vegetarian',
      description: 'Plant-based meal plan',
    },
  })

  const ingredient1 = await prisma.ingredient.upsert({
    where: { name: 'Chicken Breast' },
    update: {},
    create: {
      name: 'Chicken Breast',
      dietaryRestriction: DietaryRestriction.GLUTEN_FREE,
    },
  })

  const ingredient2 = await prisma.ingredient.upsert({
    where: { name: 'Brown Rice' },
    update: {},
    create: {
      name: 'Brown Rice',
      dietaryRestriction: DietaryRestriction.VEGAN,
    },
  })

  const ingredient3 = await prisma.ingredient.upsert({
    where: { name: 'Cream' },
    update: {},
    create: {
      name: 'Cream',
    },
  })

  const mealItem1 = await prisma.mealItem.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Cheese stuffed chicken breast',
      description: 'Chicken breast stuffed with a cheese zucchini filling',
      category: MealType.LUNCH,
    },
  })

  const mealItem2 = await prisma.mealItem.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Veggie Stir Fry',
      description: 'Stir fry of mixed vegetables with tofu and brown rice',
      category: MealType.DINNER,
    },
  })

  const mealItem3 = await prisma.mealItem.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Chocolate Crepes',
      description: 'Crepes with added cocoa powder and filled with cream and strawberries',
      category: MealType.BREAKFAST,
    },
  })

  await prisma.mealItemIngredient.upsert({
    where: {
      mealItemId_ingredientId: {
        mealItemId: mealItem1.id,
        ingredientId: ingredient1.id,
      },
    },
    update: {},
    create: {
      mealItemId: mealItem1.id,
      ingredientId: ingredient1.id,
    },
  })

  await prisma.mealItemIngredient.upsert({
    where: {
      mealItemId_ingredientId: {
        mealItemId: mealItem2.id,
        ingredientId: ingredient2.id,
      },
    },
    update: {},
    create: {
      mealItemId: mealItem2.id,
      ingredientId: ingredient2.id,
    },
  })

  await prisma.mealItemIngredient.upsert({
    where: {
      mealItemId_ingredientId: {
        mealItemId: mealItem1.id,
        ingredientId: ingredient3.id,
      },
    },
    update: {},
    create: {
      mealItemId: mealItem1.id,
      ingredientId: ingredient3.id,
    },
  })

  await prisma.mealPlanTemplate.upsert({
    where: {
      mealPlanTypeId_dayOfWeek_mealType: {
        mealPlanTypeId: mealPlanType1.id,
        dayOfWeek: Weekday.MON,
        mealType: MealType.LUNCH,
      },
    },
    update: {},
    create: {
      mealPlanTypeId: mealPlanType1.id,
      dayOfWeek: Weekday.MON,
      mealType: MealType.LUNCH,
      mealItemId: mealItem1.id,
    },
  })

  await prisma.mealPlanTemplate.upsert({
    where: {
      mealPlanTypeId_dayOfWeek_mealType: {
        mealPlanTypeId: mealPlanType2.id,
        dayOfWeek: Weekday.TUE,
        mealType: MealType.DINNER,
      },
    },
    update: {},
    create: {
      mealPlanTypeId: mealPlanType2.id,
      dayOfWeek: Weekday.TUE,
      mealType: MealType.DINNER,
      mealItemId: mealItem2.id,
    },
  })

  await prisma.mealPlanTemplate.upsert({
    where: {
      mealPlanTypeId_dayOfWeek_mealType: {
        mealPlanTypeId: mealPlanType3.id,
        dayOfWeek: Weekday.WED,
        mealType: MealType.BREAKFAST,
      },
    },
    update: {},
    create: {
      mealPlanTypeId: mealPlanType3.id,
      dayOfWeek: Weekday.WED,
      mealType: MealType.BREAKFAST,
      mealItemId: mealItem3.id,
    },
  })

  await prisma.userMealPlan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userId: user1.id,
      mealPlanTypeId: mealPlanType1.id,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-07'),
    },
  })

  await prisma.userMealPlan.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      userId: user2.id,
      mealPlanTypeId: mealPlanType2.id,
      startDate: new Date('2025-01-08'),
      endDate: new Date('2025-07-14'),
    },
  })

  await prisma.schedule.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userId: user1.id,
      title: 'Math Class',
      type: ScheduleType.CLASS,
      description: 'Linear Algebra',
      startTime: new Date('2025-01-01T09:00:00Z'),
      endTime: new Date('2025-01-01T10:30:00Z'),
      location: 'Room 100',
      courseCode: 'MATH1000',
      section: 'ABC',
    },
  })

  await prisma.schedule.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      userId: user1.id,
      title: 'Statistics Class',
      type: ScheduleType.CLASS,
      description: 'Introduction to Statistics',
      startTime: new Date('2026-02-07T14:00:00Z'),
      endTime: new Date('2026-02-07T16:00:00Z'),
      location: 'Room 200',
      courseCode: 'CIVL1000',
      section: 'A112',
    },
  })

  await prisma.schedule.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      userId: user2.id,
      title: 'Study Session',
      type: ScheduleType.PERSONAL,
      description: 'Group study for upcoming tests',
      startTime: new Date('2026-02-26T18:00:00Z'),
      endTime: new Date('2026-02-26T20:00:00Z'),
      location: 'Library',
    },
  })

  await prisma.maintenanceRequest.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userId: user1.id,
      title: 'Leaky Shower Head',
      description: 'The bathtub shower head is leaking',
      urgency: UrgencyLevel.LOW,
      status: RequestStatus.PENDING,
    },
  })

  await prisma.maintenanceRequest.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      userId: user2.id,
      title: 'Broken Window Latch',
      description: 'Window in bedroom wont close properly',
      urgency: UrgencyLevel.MEDIUM,
      status: RequestStatus.IN_PROGRESS,
    },
  })

  await prisma.maintenanceRequest.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      userId: user1.id,
      title: 'AC Not Working',
      description: 'Air conditioning unit is not functioning at all',
      urgency: UrgencyLevel.HIGH,
      status: RequestStatus.RESOLVED,
    },
  })

  const bill1 = await prisma.bill.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userId: user1.id,
      billName: 'Internet Bill',
      totalAmount: 50.00,
      dueDate: new Date('2026-05-02'),
      status: BillStatus.UNPAID,
    },
  })

  const bill2 = await prisma.bill.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      userId: user2.id,
      billName: 'Electricity Bill',
      totalAmount: 120.00,
      dueDate: new Date('2026-05-15'),
      status: BillStatus.PAID,
    },
  })

  const bill3 = await prisma.bill.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      userId: user1.id,
      billName: 'Water Bill',
      totalAmount: 35.00,
      dueDate: new Date('2026-06-01'),
      status: BillStatus.UNPAID,
    },
  })

  await prisma.billSharing.upsert({
    where: {
      billId_userId: {
        billId: bill1.id,
        userId: user1.id,
      },
    },
    update: {},
    create: {
      billId: bill1.id,
      userId: user1.id,
      shareAmount: 50.00,
      hasPaid: false,
    },
  })

  await prisma.billSharing.upsert({
    where: {
      billId_userId: {
        billId: bill2.id,
        userId: user2.id,
      },
    },
    update: {},
    create: {
      billId: bill2.id,
      userId: user2.id,
      shareAmount: 60.00,
      hasPaid: true,
    },
  })

  await prisma.billSharing.upsert({
    where: {
      billId_userId: {
        billId: bill2.id,
        userId: user1.id,
      },
    },
    update: {},
    create: {
      billId: bill2.id,
      userId: user1.id,
      shareAmount: 60.00,
      hasPaid: true,
    },
  })

  await prisma.billReminder.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      billId: bill1.id,
      reminderDate: new Date('2026-01-25'),
      isSent: false,
      method: ReminderMethod.NOTIFICATION,
    },
  })

  await prisma.billReminder.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      billId: bill2.id,
      reminderDate: new Date('2026-05-10'),
      isSent: true,
      method: ReminderMethod.EMAIL,
    },
  })

  await prisma.billReminder.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      billId: bill3.id,
      reminderDate: new Date('2026-05-28'),
      isSent: false,
      method: ReminderMethod.NOTIFICATION,
    },
  })

  await prisma.budget.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userId: user1.id,
      budgetName: 'Monthly Groceries',
      totalAmount: 300.00,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-28'),
      category: ExpenseCategory.FOOD,
    },
  })

  await prisma.budget.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      userId: user2.id,
      budgetName: 'Entertainment',
      totalAmount: 150.00,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-28'),
      category: ExpenseCategory.ENTERTAINMENT,
    },
  })

  await prisma.budget.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      userId: user1.id,
      budgetName: 'Transportation',
      totalAmount: 100.00,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-31'),
      category: ExpenseCategory.TRANSPORTATION,
    },
  })

  await prisma.expense.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userId: user1.id,
      description: 'Dining Out',
      amount: 45.50,
      category: ExpenseCategory.FOOD,
      expenseDate: new Date('2026-02-22'),
    },
  })

  await prisma.expense.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      userId: user2.id,
      description: 'Movie Tickets',
      amount: 25.00,
      category: ExpenseCategory.ENTERTAINMENT,
      expenseDate: new Date('2026-01-08'),
    },
  })

  await prisma.expense.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      userId: user1.id,
      description: 'Bus Pass',
      amount: 80.00,
      category: ExpenseCategory.TRANSPORTATION,
      expenseDate: new Date('2026-01-10'),
    },
  })

  const chore1 = await prisma.chore.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      choreName: 'Vacuum',
      description: 'Vacuum the living room',
      dueDate: new Date('2026-03-10'),
      status: ChoreStatus.PENDING,
    },
  });

  const chore2 = await prisma.chore.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      choreName: 'Dishes',
      description: 'Clean the pile of dirty dishes in sink',
      dueDate: new Date('2026-01-11'),
      status: ChoreStatus.COMPLETED,
    },
  });

  const chore3 = await prisma.chore.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      choreName: 'Take Out Trash',
      description: 'Take bins to the curb',
      dueDate: new Date('2026-01-12'),
      status: ChoreStatus.PENDING,
    },
  });

  await prisma.choreAssignment.upsert({
    where: { choreId_userId: { choreId: 1, userId: user1.id } },
    update: {},
    create: {
      choreId: 1,
      userId: user1.id,
    },
  });

  await prisma.choreAssignment.upsert({
    where: { choreId_userId: { choreId: 2, userId: user2.id } },
    update: {},
    create: {
      choreId: 2,
      userId: user2.id,
    },
  });

  await prisma.choreAssignment.upsert({
    where: { choreId_userId: { choreId: 3, userId: user1.id } },
    update: {},
    create: {
      choreId: 3,
      userId: user1.id,
    },
  });

  await prisma.profile.upsert({
  where: { userId: user1.id },
  update: {},
  create: {
    studentId: "2026-001",
    roomNumber: "A101",
    avatarUrl: "https://example.com/avatar1.png",
    userId: user1.id,
  },
})

await prisma.profile.upsert({
  where: { userId: user2.id },
  update: {},
  create: {
    studentId: "2026-002",
    roomNumber: "A101", // same room → roommates 👀
    avatarUrl: "https://example.com/avatar2.png",
    userId: user2.id,
  },
})

await prisma.profile.upsert({
  where: { userId: user3.id },
  update: {},
  create: {
    studentId: "ADMIN-001",
    roomNumber: null,
    userId: user3.id,
  },
})

  console.log('Seeding was successful')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
