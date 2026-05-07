const { Client } = require('pg');

// Usamos el puerto 6543 que es el Transaction Pooler (más estable)
const connectionString = 'postgresql://postgres:Makita1234%23$.,@db.rcvrtebpbakqryhgcdjc.supabase.co:6543/postgres?sslmode=require';

const client = new Client({
  connectionString: connectionString,
});

const sql = `
-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'client',
  welcome_email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Cuentas (Saldos)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(15,2) DEFAULT 0.00,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- 3. Tabla de Transacciones
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  counterparty_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL,
  direction TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
`;

async function setup() {
  try {
    console.log('⏳ Conectando a Supabase vía Pooler (6543)...');
    await client.connect();
    console.log('✅ Conexión establecida.');
    
    console.log('⏳ Ejecutando comandos SQL...');
    await client.query(sql);
    console.log('✅ ¡Base de datos lista para operar!');
    
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
    console.log('Sugerencia: Si esto falla, puede ser un bloqueo de red local del bot.');
  } finally {
    await client.end();
  }
}

setup();
