const express = require('express');
const router = express.Router();

const { maintenanceRules } = require('../validators/maintenanceValidator');
const validate = require('../middleware/validate');

const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { getMaintenanceR, 
    getMaintenanceRById, 
    createMaintenanceR, 
    updateMaintenanceRStatus, 
    deleteMaintenanceR, 
    updateMaintenanceR,
    getMaintenanceMyRequests
} = require('../controllers/maintenanceCotroller');

// Maintenance routes
// student routes
router.post('/create', authenticateToken, maintenanceRules, validate, createMaintenanceR);
router.put('/student/:id', authenticateToken, updateMaintenanceR);
router.get('/myReq', authenticateToken, getMaintenanceMyRequests);

// admin routes
router.get('/', authenticateToken, requireAdmin, getMaintenanceR);
router.get('/:id', authenticateToken, requireAdmin, getMaintenanceRById);
router.patch('/:id/status', authenticateToken, requireAdmin, updateMaintenanceRStatus);

router.delete('/delete/:id', authenticateToken, deleteMaintenanceR);

module.exports = router;