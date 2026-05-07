const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Servicio de correos profesionales usando Resend
 */
exports.sendWelcomeEmail = async (email, fullName) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'NovaBank <onboarding@resend.dev>',
      to: [email],
      subject: '¡Bienvenido a NovaBank!',
      html: `<h1>Hola ${fullName},</h1><p>Tu cuenta ha sido creada con éxito. Bienvenido al futuro de tus finanzas.</p>`
    });

    if (error) {
      console.error('[Resend Error]', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[EmailService Error]', err);
    return false;
  }
};

exports.sendTransactionNotification = async (email, amount, type) => {
  try {
    await resend.emails.send({
      from: 'Alertas NovaBank <alerts@resend.dev>',
      to: [email],
      subject: `Notificación de ${type}`,
      html: `<p>Se ha registrado un ${type} por un monto de <strong>$${amount}</strong> en tu cuenta.</p>`
    });
    return true;
  } catch (err) {
    console.error('[EmailService Error]', err);
    return false;
  }
};
