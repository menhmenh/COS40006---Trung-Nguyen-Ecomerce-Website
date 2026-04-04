import 'server-only'
import sql from 'mssql'

const config = {
  server: process.env.AZURE_SQL_SERVER!,
  database: process.env.AZURE_SQL_DATABASE!,
  user: process.env.AZURE_SQL_USER!,
  password: process.env.AZURE_SQL_PASSWORD!,
  port: Number(process.env.AZURE_SQL_PORT || 1433),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

declare global {
  var __sqlPool: Promise<any> | undefined
}

export async function getPool() {
  globalThis.__sqlPool ??= new sql.ConnectionPool(config).connect()
  return globalThis.__sqlPool
}

export { sql }
