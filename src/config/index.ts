import loggerFactory from '../utils/logging';
import { Role } from '../models/Role';
const logger = loggerFactory.getLogger('Config');
interface IConfig {
  port: number;
  production: boolean;
  authorizedRole: string[];
  mongoDbUri: string;
  idPUri: string;
  clientId: string;
  clientSecret: string;
  tenantUserLogin: string;
  idpTenantHostname: string;
}
const config: IConfig = <IConfig>{
  port: 80,
  production: false,
  authorizedRole: [Role.root, Role.admin, Role.manager, Role.employee],
};

if (process.env.PORT) config.port = parseInt(process.env.PORT);
if (process.env.NODE_ENV) config.production = process.env.NODE_ENV === 'production';

if (process.env.MONGO_DB_URL) {
  config.mongoDbUri = process.env.MONGO_DB_URL;
} else {
  logger.error('Missing parameter: MONGO_DB_URL! Exiting...');
  process.exit(1);
}

if (process.env.TENANT_USER_LOGIN) {
  config.tenantUserLogin = process.env.TENANT_USER_LOGIN;
} else {
  logger.error('Missing parameter: TENANT_USER_LOGIN! Exiting...');
  process.exit(1);
}

if (process.env.IDP_URI) {
  config.idPUri = process.env.IDP_URI;
} else {
  logger.error('Missing parameter: IDP_URI! Exiting...');
  process.exit(1);
}
if (process.env.IDP_TENANT_HOSTNAME) {
  config.idpTenantHostname = process.env.IDP_TENANT_HOSTNAME;
} else {
  logger.error('Missing parameter: IDP_TENANT_HOSTNAME! Exiting...');
  process.exit(1);
}

if (process.env.CLIENT_ID) {
  config.clientId = process.env.CLIENT_ID;
} else {
  logger.error('Missing parameter: CLIENT_ID! Exiting...');
  process.exit(1);
}

if (process.env.CLIENT_SECRET) {
  config.clientSecret = process.env.CLIENT_SECRET;
} else {
  logger.error('Missing parameter: CLIENT_SECRET! Exiting...');
  process.exit(1);
}

logger.info('Config for the app: %o', config);

export default config;
