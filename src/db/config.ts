import { Pool } from 'pg';
import { config } from 'dotenv';
import { join } from 'path';

config({
  path: join(process.cwd(),'../.env')
})

const pool = new Pool({
  user: process.env.DB_USER || 'root',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'filesharing',
  password: process.env.DB_PASSWORD || 'asdfgh',
  port: parseInt(process.env.DB_PORT || '5433'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;