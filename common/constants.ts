export enum AppNames {
  Idp = 'Identity',
  Cache = 'Cache',
  Generator = 'Generator',
  Crud = 'Crud',
  Gateway = 'Gateway',
}

export const Environments = ['development', 'production'];

export const DefaultJwtSecret = 'insecure';

export enum AppPorts {
  Idp = 12000,
  Cache = 12001,
  Generator = 12002,
  Crud = 12003,
  Gateway = 12004,
}

export const DefaultPaginationSize = 10;
