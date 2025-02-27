import { DefaultJwtSecret, Environments } from '@common/constants';

export default function config() {
  const conf = {
    env: Environments.includes(process.env.NODE_ENV)
      ? process.env.NODE_ENV
      : Environments[0],
    host: process.env.APP_HOST || 'localhost',
    port: parseInt(process.env.APP_PORT) || 12000,
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      pass: process.env.DB_PASS || 'root',
      name: process.env.DB_NAME || 'idp',
    },
    jwtSecret: process.env.JWT_SECRET || DefaultJwtSecret,
  };
  return conf;
}
