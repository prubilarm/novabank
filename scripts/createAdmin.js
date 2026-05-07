const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdmin() {
  const email = 'admin@novabank.com';
  const password = 'AdminNova2026!'; // Contraseña segura por defecto
  const fullName = 'Administrador Maestro';

  console.log('🚀 Iniciando creación de usuario administrador...');

  try {
    // 1. Crear usuario en la tabla de perfiles (users)
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({
        email: email,
        full_name: fullName,
        role: 'admin',
        welcome_email_sent: true
      }, { onConflict: 'email' })
      .select()
      .single();

    if (userError) throw userError;

    // 2. Asegurarnos de que tenga una cuenta bancaria con saldo inicial
    const { error: accountError } = await supabase
      .from('accounts')
      .upsert({
        user_id: user.id,
        balance: 1000000 // El admin empieza con un millón para pruebas
      }, { onConflict: 'user_id' });

    if (accountError) throw accountError;

    console.log('✅ ¡Administrador creado exitosamente!');
    console.log('------------------------------------');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('------------------------------------');
    console.log('Ya puedes iniciar sesión en http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Error al crear admin:', error.message);
  }
}

createAdmin();
