# 🏦 NovaBank - Sistema Bancario Digital

NovaBank es una plataforma bancaria moderna, segura y escalable construida con las mejores tecnologías del ecosistema JavaScript.

## 🚀 Tecnologías

| Área | Tecnología |
|------|------------|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js (MVC) |
| Móvil | React Native (Expo) |
| Base de Datos | Supabase (PostgreSQL) |
| Autenticación | JWT + Google OAuth |
| Deployment | Vercel |
| Documentación | Swagger/OpenAPI |

## ✨ Características

- ✅ Dashboard financiero en tiempo real
- ✅ Transferencias instantáneas entre usuarios
- ✅ Historial completo de transacciones
- ✅ Autenticación segura con JWT
- ✅ Login con Google OAuth
- ✅ Panel de administración
- ✅ Email de bienvenida automático
- ✅ Diseño responsive y moderno
- ✅ App móvil nativa
- ✅ Documentación API completa

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase (gratis)
- Cuenta en Resend para emails (gratis)
- Cuenta en Vercel para deploy (gratis)

## 🛠️ Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/prubilarm/novabank.git
cd novabank
```

### 2. Configurar el Backend
```bash
cd backend
npm install
# Crear archivo .env basado en .env.example y completar con tus credenciales
npm run dev
```

### 3. Configurar el Frontend
```bash
cd ../frontend
npm install
# Crear archivo .env y configurar REACT_APP_API_URL=http://localhost:3001
npm start
```

### 4. Configurar el Móvil
```bash
cd ../mobile
npm install
npx expo start
```

## 🔒 Variables de Entorno (.env)

El sistema requiere las siguientes variables para funcionar correctamente:

**Backend:**
- `PORT`: Puerto del servidor (ej. 3001)
- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Key administrativa de Supabase
- `JWT_SECRET`: Clave secreta para firmar los tokens
- `RESEND_API_KEY`: Key para el envío de emails
- `FRONTEND_URL`: URL del frontend para los links en los emails

**Frontend:**
- `REACT_APP_API_URL`: URL de la API del backend

## 📚 Documentación de la API
Una vez que el backend esté en ejecución, puedes acceder a la documentación interactiva en:
`http://localhost:3001/api-docs`

## 🛡️ Seguridad

- ✅ **JWT**: Autenticación con expiración de 7 días para un equilibrio entre UX y seguridad.
- ✅ **Bcrypt**: Hashing de contraseñas de alta seguridad.
- ✅ **CORS**: Configurado para permitir solo orígenes de confianza.
- ✅ **Validación**: Uso de `express-validator` en todos los endpoints sensibles.
- ✅ **Storage**: Tokens almacenados en `localStorage` (Web) y `AsyncStorage` (Móvil).
- ✅ **Privilegios**: Uso de `Service Role` en backend para bypass de RLS controlado.

## 🤝 Contribución

1. Haz un Fork del proyecto
2. Crea tu rama feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.

## 📞 Contacto

Soporte: [soporte@novabank.com](mailto:soporte@novabank.com)

---
© 2024 NovaBank. Desarrollado con ❤️ para el futuro de las finanzas.
