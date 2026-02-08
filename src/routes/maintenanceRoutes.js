const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { getMaintenanceR, 
    getMaintenanceRById, 
    createMaintenanceR, 
    updateMaintenanceRStatus, 
    deleteMaintenanceR, 
    updateMaintenanceR
} = require('../controllers/maintenanceCotroller');

// Maintenance routes
// student routes
router.post('/create', authenticateToken, createMaintenanceR);
router.put('/update/:id', authenticateToken, updateMaintenanceR);

// admin routes
router.get('/', authenticateToken, requireAdmin, getMaintenanceR);
router.get('/:id', authenticateToken, requireAdmin, getMaintenanceRById);
router.patch('/:id/status', authenticateToken, requireAdmin, updateMaintenanceRStatus);

router.delete('/delete/:id', authenticateToken, deleteMaintenanceR);

module.exports = router;