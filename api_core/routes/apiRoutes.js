const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const transactionController = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// --- RUTAS DE PERFIL ---

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Obtener perfil completo del usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 */
router.get('/user/profile', authMiddleware, userController.getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 */
router.put('/user/profile', authMiddleware, userController.updateProfile);


// --- RUTAS DE TRANSACCIONES ---

/**
 * @swagger
 * /api/balance:
 *   get:
 *     summary: Obtener saldo actual
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saldo obtenido exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/balance', authMiddleware, transactionController.getBalance);

/**
 * @swagger
 * /api/deposit:
 *   post:
 *     summary: Realizar un depósito
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100.00
 *               description:
 *                 type: string
 *                 example: Depósito en efectivo
 *     responses:
 *       200:
 *         description: Depósito exitoso
 *       400:
 *         description: Monto inválido
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/deposit', authMiddleware, transactionController.deposit);

/**
 * @swagger
 * /api/transfer:
 *   post:
 *     summary: Transferir dinero a otro usuario
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toEmail
 *               - amount
 *             properties:
 *               toEmail:
 *                 type: string
 *                 example: amigo@ejemplo.com
 *               amount:
 *                 type: number
 *                 example: 50.00
 *               description:
 *                 type: string
 *                 example: Pago por servicio
 *     responses:
 *       200:
 *         description: Transferencia exitosa
 *       400:
 *         description: Saldo insuficiente o datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Destinatario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/transfer', authMiddleware, transactionController.transfer);

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Obtener historial de transacciones
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Número de transacciones a obtener
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Desplazamiento para paginación
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/history', authMiddleware, transactionController.getHistory);

module.exports = router;
