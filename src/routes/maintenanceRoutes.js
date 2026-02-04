const express = require('express');
const router = express.Router();
const { getMaintenanceRequest, createMaintenanceRequest } = require('../controllers/maintenanceCotroller');

// Maintenance routes
router.get('/', getMaintenanceRequest);
router.post('/', createMaintenanceRequest);


module.exports = router;