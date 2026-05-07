/**
 * Servicio de simulación de correos electrónicos para NovaBank
 */
exports.sendWelcomeEmail = async (email, fullName) => {
  console.log(`[EmailService] Enviando correo de bienvenida a ${fullName} (${email})...`);
  // Aquí iría la integración con SendGrid, Mailgun, etc.
  return true;
};

exports.sendTransactionNotification = async (email, amount, type) => {
  console.log(`[EmailService] Notificación de transacción: ${type} por valor de ${amount} enviada a ${email}`);
  return true;
};
