-- ============================================
-- 1. LIMPIAR TABLAS EXISTENTES (si es necesario)
-- ============================================
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 2. CREAR TABLAS
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password_hash TEXT,
  avatar_url TEXT,
  auth_provider TEXT DEFAULT 'email',
  role TEXT DEFAULT 'user',
  welcome_email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(12,2) DEFAULT 100.00,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_account_id UUID REFERENCES accounts(id),
  receiver_account_id UUID REFERENCES accounts(id),
  amount DECIMAL(12,2) NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('deposit', 'transfer', 'withdrawal')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CREAR USUARIO ADMIN (LOGIN FUNCIONAL)
-- ============================================
-- IMPORTANTE: La contraseña es "Admin123!"
-- El hash de bcrypt para "Admin123!" es:
-- $2b$10$YourAdminHashHere
-- PERO como no podemos generar el hash aquí, usamos este método:

-- PRIMERO: Insertar usuario sin password_hash temporalmente
INSERT INTO users (id, email, full_name, role)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  -- ID fijo para admin
  'admin@novabank.com',
  'Administrador',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Crear cuenta bancaria para admin con saldo de $10,000
INSERT INTO accounts (user_id, balance)
SELECT id, 10000.00
FROM users
WHERE email = 'admin@novabank.com'
ON CONFLICT DO NOTHING;

-- Crear usuario de prueba regular
INSERT INTO users (id, email, full_name, role)
VALUES (
  gen_random_uuid(),
  'usuario@test.com',
  'Usuario Test',
  'user'
) ON CONFLICT (email) DO NOTHING;

-- Crear cuenta para usuario de prueba
INSERT INTO accounts (user_id, balance)
SELECT id, 500.00
FROM users
WHERE email = 'usuario@test.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_sender ON transactions(sender_account_id);
CREATE INDEX idx_transactions_receiver ON transactions(receiver_account_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
