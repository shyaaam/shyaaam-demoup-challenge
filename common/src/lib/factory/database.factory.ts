import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { join } from 'path';

export const LOCAL_ENV = 'local';
export const CLI_ENV = 'cli';
export const STAGING_ENV = 'staging';
export const PROD_ENV = 'prod';

export const databaseConfigFactory = async (logger: PinoLogger, directory: string): Promise<TypeOrmModuleOptions> => {
  const {
    DB_PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    NODE_ENV,
    DB_READER_HOST,
    DB_READER_PORT,
    DB_READER_NAME,
    APP_ENV = PROD_ENV,
    ENABLE_SQL_LOG,
    DISABLE_SQL_LOG,
  } = process.env;

  const mainConnection = {
    port: Number(DB_PORT) ?? 5432,
    host: DB_HOST ?? 'localhost',
    username: DB_USER ?? 'scale',
    password: DB_PASSWORD ?? 'scale',
    database: DB_NAME ?? 'scale',
    installExtensions: false,
  };

  const isLocal = APP_ENV === LOCAL_ENV;
  const forceQueryLogging = ENABLE_SQL_LOG ?? false;
  const disableLogging = DISABLE_SQL_LOG ?? false;
  const useLogging = isLocal || (forceQueryLogging && !disableLogging);
  const useReplicationSetup = NODE_ENV === 'production' && DB_READER_HOST;

  return {
    autoLoadEntities: true,
    type: 'postgres',
    logging: APP_ENV === CLI_ENV ? ['error'] : ['error', 'schema', 'warn', 'info'],
    extra: {
      idleTimeoutMillis: 5000,
      max: 5,
      connectionTimeoutMillis: 10000,
    },
    ...(useReplicationSetup
      ? {
          replication: {
            master: mainConnection,
            slaves: [
              {
                ...mainConnection,
                host: DB_READER_HOST,
                port: Number(DB_READER_PORT) ?? 5432,
                database: DB_READER_NAME ?? DB_NAME,
              },
            ],
          },
        }
      : mainConnection),
    ...(useLogging && {
      logging: true,
    }),

    synchronize: false,
    migrations: [join(directory, 'migrations/*.ts')],
  };
};
