import { AppPorts, Environments } from '@common/constants';

export default function config() {
  const conf = {
    env: Environments.includes(process.env.NODE_ENV)
      ? process.env.NODE_ENV
      : Environments[0],
    host: process.env.host || 'localhost',
    port: parseInt(process.env.APP_PORT) || AppPorts.Generator,
    cacheUrl: process.env.CACHE_URL || `http://localhost:${AppPorts.Cache}`,
  };

  return conf;
}
