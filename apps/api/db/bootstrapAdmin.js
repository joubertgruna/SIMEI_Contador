require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const isProduction = process.env.NODE_ENV === 'production';

function getSanitizedDatabaseUrl() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error('DATABASE_URL não configurada');
  }

  const parsed = new URL(rawUrl);
  parsed.searchParams.delete('ssl-mode');
  parsed.searchParams.delete('sslmode');
  return parsed.toString();
}

async function getConnection() {
  return mysql.createConnection({
    uri: getSanitizedDatabaseUrl(),
    ...(isProduction && { ssl: { rejectUnauthorized: false } }),
  });
}

async function bootstrapAdmin() {
  const email = (process.env.BOOTSTRAP_ADMIN_EMAIL || 'admin@simei.com').trim().toLowerCase();
  const senha = process.env.BOOTSTRAP_ADMIN_PASSWORD || 'admin123';
  const nome = process.env.BOOTSTRAP_ADMIN_NOME || 'Administrador';
  const role = process.env.BOOTSTRAP_ADMIN_ROLE || 'super_usuario';

  let connection;

  try {
    connection = await getConnection();

    const [existingRows] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ? AND deleted_at IS NULL LIMIT 1',
      [email]
    );

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      console.log(`👤 Usuário admin já existe (${email}) — bootstrap ignorado.`);
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    await connection.query(
      `INSERT INTO usuarios (nome, email, senha_hash, role, empresa_id, created_at)
       VALUES (?, ?, ?, ?, NULL, NOW())`,
      [nome, email, senhaHash, role]
    );

    console.log(`✅ Admin bootstrap criado: ${email}`);
    if (process.env.BOOTSTRAP_ADMIN_PASSWORD) {
      console.log('🔐 Senha definida por variável BOOTSTRAP_ADMIN_PASSWORD.');
    } else {
      console.log('⚠️  Senha padrão usada (admin123). Troque após o primeiro login.');
    }
  } catch (err) {
    console.error('❌ Erro no bootstrap do admin:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

bootstrapAdmin();
