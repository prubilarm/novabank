const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Obtener todos los usuarios (solo admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida
 *       403:
 *         description: Acceso denegado (no es admin)
 *       401:
 *         description: No autorizado
 */
router.get('/users', authMiddleware, isAdmin, adminController.getAllUsers);

/**
 * @swagger
 * /admin/transactions:
 *   get:
 *     summary: Obtener todas las transacciones (solo admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Lista de transacciones obtenida
 */
router.get('/transactions', authMiddleware, isAdmin, adminController.getAllTransactions);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Obtener estadísticas del sistema (solo admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas
 */
router.get('/stats', authMiddleware, isAdmin, adminController.getStats);

module.exports = router;
