const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * Validaciones para registro
 */
const registerValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('full_name').notEmpty().withMessage('El nombre completo es requerido')
];

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *         full_name:
 *           type: string
 *         role:
 *           type: string
 *         avatar_url:
 *           type: string
 *
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - full_name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@ejemplo.com
 *               full_name:
 *                 type: string
 *                 example: Juan Pérez
 *               password:
 *                 type: string
 *                 example: miPassword123
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en los datos de entrada
 *
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 example: miPassword123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciales inválidas
 *
 * /auth/sync-google:
 *   post:
 *     summary: Sincronizar usuario de Google OAuth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               full_name:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *               google_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sincronización exitosa
 *
 * /auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                     currency:
 *                       type: string
 */

router.post('/register', registerValidation, authController.register);
router.post('/login', authController.login);
router.post('/sync-google', authController.syncGoogleUser);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
