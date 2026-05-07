const { Resend } = require('resend');

// Inicializar Resend con la API key (Blindado para evitar crash en producción)
const resendKey = process.env.RESEND_API_KEY;
if (!resendKey) {
  console.warn('⚠️ AVISO: RESEND_API_KEY no configurada. Los correos no se enviarán.');
}
const resend = resendKey ? new Resend(resendKey) : { emails: { send: () => Promise.resolve({ data: null, error: 'Resend no configurado' }) } };

/**
 * Enviar email de bienvenida a nuevos usuarios
 */
const sendWelcomeEmail = async (to, name) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a NovaBank</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .header {
            text-align: center;
            padding: 30px 0;
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 32px;
          }
          .content {
            padding: 30px;
            background: white;
          }
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: white !important;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
          .stats {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏦 NovaBank</h1>
            <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Tu banca digital segura</p>
          </div>
          
          <div class="content">
            <h2>¡Bienvenido a NovaBank, ${name}! 🎉</h2>
            
            <p>Nos alegra mucho que te unas a nuestra comunidad financiera. En NovaBank, estamos comprometidos a ofrecerte la mejor experiencia bancaria digital.</p>
            
            <div class="stats">
              <p><strong>✨ Tu cuenta ya está activa</strong></p>
              <p>✅ Transferencias instantáneas</p>
              <p>✅ Control total de tus finanzas</p>
              <p>✅ Seguridad de nivel bancario</p>
              <p>✅ Soporte 24/7</p>
            </div>
            
            <p>Para comenzar a usar tu cuenta, haz clic en el botón de abajo:</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">
                Ir a mi cuenta → 
              </a>
            </div>
            
            <p>Si tienes alguna pregunta, nuestro equipo de soporte está disponible para ayudarte.</p>
            
            <p>¡Gracias por confiar en NovaBank!</p>
            
            <p>
              Saludos cordiales,<br>
              <strong>El equipo de NovaBank</strong>
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 NovaBank. Todos los derechos reservados.</p>
            <p>
              <a href="#" style="color: #6b7280; text-decoration: none;">Términos de servicio</a> |
              <a href="#" style="color: #6b7280; text-decoration: none;">Política de privacidad</a> |
              <a href="#" style="color: #6b7280; text-decoration: none;">Contacto</a>
            </p>
            <p>Este es un correo automático, por favor no responder a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const { data, error } = await resend.emails.send({
      from: 'NovaBank <welcome@novabank.com>',
      to: [to],
      subject: 'Bienvenido a NovaBank - Tu banca digital segura',
      html: htmlContent,
    });
    
    if (error) {
      console.error('Error al enviar email:', error);
      throw error;
    }
    
    console.log(`Email de bienvenida enviado a ${to}`);
    return data;
    
  } catch (error) {
    console.error('Error en sendWelcomeEmail:', error);
    throw error;
  }
};

module.exports = { sendWelcomeEmail };
