const { createClient } = require('@supabase/supabase-js');

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // Usamos service_role para operaciones administrativas
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

module.exports = supabase;
