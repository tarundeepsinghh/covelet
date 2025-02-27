import { AppPorts, Environments } from '@common/constants';

export default function config() {
  const conf = {
    env: Environments.includes(process.env.NODE_ENV)
      ? process.env.NODE_ENV
      : Environments[0],
    host: process.env.APP_HOST || 'localhost',
    port: parseInt(process.env.APP_PORT) || AppPorts.Cache,
  };
  return conf;
}
