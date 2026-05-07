const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const transactionController = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Perfil de usuario
router.get('/user/profile', authMiddleware, userController.getProfile);
router.put('/user/profile', authMiddleware, userController.updateProfile);

// Transacciones
router.get('/transactions', authMiddleware, transactionController.getHistory);
router.post('/transactions/transfer', authMiddleware, transactionController.transfer);

module.exports = router;
