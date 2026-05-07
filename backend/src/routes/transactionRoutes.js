const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, transactionController.getTransactions);
router.post('/transfer', authMiddleware, transactionController.transfer);

module.exports = router;
