const { prisma } = require('../config/db');

const createSchedule = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, type, description, startTime, endTime, location, courseCode, section } = req.body;

    const schedule = await prisma.schedule.create({
      data: {
        userId,
        title,
        type,
        description: description || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location: location || null,
        courseCode: courseCode || null,
        section: section || null,
      },
    });

    res.status(201).json({
      message: 'Schedule created successfully.',
      schedule,
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'An error occurred while creating the schedule.' });
  }
};

const getMySchedules = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    const where = { userId };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    const schedules = await prisma.schedule.findMany({
      where,
      orderBy: { startTime: 'asc' },
    });

    res.json({ schedules });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'An error occurred while fetching schedules.' });
  }
};

const getScheduleById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const schedule = await prisma.schedule.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    res.json({ schedule });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the schedule.' });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { title, type, description, startTime, endTime, location, courseCode, section } = req.body;

    const existing = await prisma.schedule.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    const schedule = await prisma.schedule.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(description !== undefined && { description }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(location !== undefined && { location }),
        ...(courseCode !== undefined && { courseCode }),
        ...(section !== undefined && { section }),
      },
    });

    res.json({ message: 'Schedule updated successfully.', schedule });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ error: 'An error occurred while updating the schedule.' });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const existing = await prisma.schedule.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    await prisma.schedule.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Schedule deleted successfully.' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'An error occurred while deleting the schedule.' });
  }
};

module.exports = { createSchedule, getMySchedules, getScheduleById, updateSchedule, deleteSchedule };
