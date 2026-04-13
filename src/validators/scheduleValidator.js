const { body } = require('express-validator');

exports.createScheduleRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['WORK', 'CLASS', 'PERSONAL']).withMessage('Type must be WORK, CLASS, or PERSONAL'),
  body('startTime').notEmpty().withMessage('Start time is required').isISO8601().withMessage('Start time must be a valid date'),
  body('endTime').notEmpty().withMessage('End time is required').isISO8601().withMessage('End time must be a valid date'),
];

exports.updateScheduleRules = [
  body('type')
    .optional()
    .isIn(['WORK', 'CLASS', 'PERSONAL']).withMessage('Type must be WORK, CLASS, or PERSONAL'),
  body('startTime').optional().isISO8601().withMessage('Start time must be a valid date'),
  body('endTime').optional().isISO8601().withMessage('End time must be a valid date'),
];
