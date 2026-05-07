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
  body('fullName').notEmpty().withMessage('El nombre completo es requerido')
];

router.post('/register', registerValidation, authController.register);
router.post('/login', authController.login);
router.post('/sync-google', authController.syncGoogleUser);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
