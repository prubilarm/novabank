const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Aquí se podría añadir un middleware de checkAdmin
router.get('/stats', authMiddleware, adminController.getStats);
router.post('/suspend', authMiddleware, adminController.suspendUser);

module.exports = router;
