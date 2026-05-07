const { createClient } = require('@supabase/supabase-js');

// Validar variables de entorno críticas
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Faltan variables de entorno de Supabase (URL o KEY). El servidor no podrá conectar con la DB.');
}

// Inicializar cliente de Supabase (con validación para evitar crash)
const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: true, persistSession: true }
    })
  : { 
      // Objeto "mock" para evitar que el servidor colapse si no hay conexión
      from: () => ({ 
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: 'DB no configurada' }) }) }),
        insert: () => Promise.resolve({ data: null, error: 'DB no configurada' }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: 'DB no configurada' }) })
      }) 
    };

module.exports = supabase;
