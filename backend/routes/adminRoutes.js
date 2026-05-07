const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Solo administradores pueden acceder
router.get('/stats', authMiddleware, isAdmin, adminController.getStats);
router.post('/suspend', authMiddleware, isAdmin, adminController.suspendUser);

module.exports = router;
