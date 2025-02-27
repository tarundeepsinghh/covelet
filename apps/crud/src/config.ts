import { AppPorts, Environments } from '@common/constants';

export default function config() {
  const conf = {
    env: Environments.includes(process.env.NODE_ENV)
      ? process.env.NODE_ENV
      : Environments[0],
    host: process.env.APP_HOST || 'localhost',
    port: parseInt(process.env.APP_PORT) || AppPorts.Crud,
    dbConnString:
      process.env.DB_CONN_STRING ||
      'mongodb+srv://dbadmin:V3hi7kg1O8EN5pYK@m01.mqovlxw.mongodb.net/learn?retryWrites=true&w=majority',
  };
  return conf;
}
