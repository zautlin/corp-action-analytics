/**
 * ClickHouse Client Configuration
 * Reads connection parameters from environment variables
 */

export interface ClickHouseConfig {
  host: string
  port: number
  user: string
  password: string
  protocol: 'http' | 'https'
  secure: boolean
  verifySSL: boolean
  database: string
}

export function getClickHouseConfig(): ClickHouseConfig {
  // Check if we're in browser or server
  const isBrowser = typeof window !== 'undefined'
  
  if (isBrowser) {
    throw new Error('ClickHouse client should only be used on the server side')
  }

  return {
    host: process.env.CLICKHOUSE_HOST || 'localhost',
    port: parseInt(process.env.CLICKHOUSE_PORT || '8443', 10),
    user: process.env.CLICKHOUSE_USER || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    protocol: (process.env.CLICKHOUSE_PROTOCOL || 'https') as 'http' | 'https',
    secure: process.env.CLICKHOUSE_SECURE === 'true',
    verifySSL: process.env.CLICKHOUSE_VERIFY_SSL !== 'false',
    database: process.env.CLICKHOUSE_DATABASE || 'six_poc',
  }
}

export function getClickHouseConnectionString(): string {
  const config = getClickHouseConfig()
  return `${config.protocol}://${config.host}:${config.port}`
}

export function getClickHouseQueryUrl(): string {
  const config = getClickHouseConfig()
  return `${config.protocol}://${config.host}:${config.port}/?user=${config.user}&password=${config.password}&database=${config.database}`
}
