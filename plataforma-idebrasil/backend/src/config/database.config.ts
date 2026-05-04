import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'idebrasil_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

export const getConnection = async () => {
  return await pool.getConnection();
};

export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Conexão com banco de dados estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com banco de dados:', error);
    return false;
  }
};

export default pool;